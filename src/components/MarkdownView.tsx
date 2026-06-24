/* ==========================================================================
 * MarkdownView.tsx — markdown 正文渲染
 * 职责：fetch md → protectMath → marked → 注入 DOM → 还原并 KaTeX 渲染公式。
 * 加载/错误态。迁移自 legacy/js/content.js 的渲染管线。
 * ========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import type { Chapter, Subject } from '../data/types';
import { assetUrl } from '../lib/assets';
import { protectMath, restoreAndRenderMath } from '../lib/katex';

interface MarkdownViewProps {
  subject: Subject;
  chapter: Chapter;
}

interface ViewState {
  status: 'loading' | 'ready' | 'error';
  html: string;
  /** protectMath 返回的原文仓库，用于还原 */
  store: string[];
  error: string;
}

marked.setOptions({ gfm: true, breaks: false });

export function MarkdownView({ chapter }: MarkdownViewProps) {
  const [state, setState] = useState<ViewState>({
    status: 'loading',
    html: '',
    store: [],
    error: '',
  });
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', html: '', store: [], error: '' });

    (async () => {
      try {
        const res = await fetch(assetUrl(chapter.file));
        if (!res.ok) throw new Error(`服务器返回 ${res.status}`);
        const md = await res.text();
        if (cancelled) return;

        const { text: protectedMd, store } = protectMath(md);
        const html = marked.parse(protectedMd, { async: false }) as string;
        if (cancelled) return;
        setState({ status: 'ready', html, store, error: '' });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: 'error',
          html: '',
          store: [],
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chapter.file]);

  // DOM 插入后还原公式 + KaTeX 渲染 + 表格包裹 + 外链处理
  useEffect(() => {
    if (state.status !== 'ready' || !bodyRef.current) return;
    restoreAndRenderMath(bodyRef.current, state.store);
    postProcess(bodyRef.current);
  }, [state]);

  if (state.status === 'loading') {
    return (
      <div className="state state--loading">
        <span className="state__icon">◉</span>
        <div className="state__title">正在加载大纲…</div>
        <div className="state__desc">正在拉取章节内容</div>
      </div>
    );
  }

  if (state.status === 'error') {
    const name = `第${Number(chapter.id)}章 ${chapter.title}`;
    return (
      <div className="state state--error">
        <span className="state__icon">✕</span>
        <div className="state__title">加载失败</div>
        <div className="state__desc">
          {name} 无法加载
          <br />
          {state.error}
          <br />
          <br />
          请确认通过 http(s):// 访问，而非 file:// 协议。
        </div>
      </div>
    );
  }

  return (
    <div
      ref={bodyRef}
      className="md-body"
      dangerouslySetInnerHTML={{ __html: state.html }}
    />
  );
}

/** marked 后处理：表格包一层 .table-wrap 以便横向滚动；外链新窗口打开 */
function postProcess(root: HTMLElement): void {
  // ContentBar 已统一显示章节标题/章号/题型徽标/重要度星标，
  // md 正文开头的 h1（章名）和 blockquote（题型分布/重要度）与之重复且可能数据不一致，此处移除。
  const firstH1 = root.querySelector('h1');
  if (firstH1) firstH1.remove();
  root.querySelectorAll('blockquote').forEach((bq) => {
    if (/题型分布|重要度/.test(bq.textContent || '')) bq.remove();
  });
  root.querySelectorAll('table').forEach((t) => {
    const parent = t.parentElement;
    if (parent && parent.classList.contains('table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    parent?.insertBefore(wrap, t);
    wrap.appendChild(t);
  });
  root.querySelectorAll('a[href^="http"]').forEach((a) => {
    const anchor = a as HTMLAnchorElement;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  });
}

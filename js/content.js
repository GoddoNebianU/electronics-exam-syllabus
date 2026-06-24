/* ==========================================================================
 * content.js — 主内容区渲染
 * 职责：fetch md → marked 渲染 → 注入主区；加载/错误/欢迎态；面包屑。
 * 依赖：全局 window.marked（vendor/marked.min.js）
 * ========================================================================== */

import { TOPIC_TYPES } from './config.js';
import * as progress from './progress.js';

const contentEl = typeof document !== 'undefined' ? document.getElementById('content') : null;
const breadcrumbEl = typeof document !== 'undefined' ? document.getElementById('breadcrumb-current') : null;

/* ---- marked 基础配置（仅一次）---- */
function ensureMarked() {
  if (window.marked && window.marked.setOptions) {
    window.marked.setOptions({ gfm: true, breaks: false });
  }
}

/* ---- HTML 转义（用于拼装）---- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/** 星标 HTML：实心 ★ + 灰色 ★ */
function starsHtml(n) {
  const full = '★'.repeat(n);
  const dim = '★'.repeat(3 - n);
  return `<span class="chapter__stars">${full}<span class="dim">${dim}</span></span>`;
}

/** 题型徽标 HTML */
function badgesHtml(topics) {
  return topics.map((t) => {
    const meta = TOPIC_TYPES[t.key] || { label: t.key, type: 'fill' };
    return `<span class="badge" data-type="${meta.type}">${meta.label} ${esc(t.range)}</span>`;
  }).join('');
}

/** 顶部工具条（章号 + 标题 + 星标 + 徽标 + 标记已复习）*/
function buildBar(subject, chapter) {
  const reviewed = progress.isReviewed(subject.id, chapter.id);
  const fullTitle = `第${Number(chapter.id)}章 ${chapter.title}`;
  return `
    <div class="content__bar">
      <div>
        <div class="content__bar-title"><small>${esc(chapter.id)}</small>${esc(fullTitle)}</div>
        <div class="chapter__meta" style="margin-top:6px">
          ${starsHtml(chapter.importance)}
          ${badgesHtml(chapter.topics)}
        </div>
      </div>
      <span class="content__bar-spacer"></span>
      <button class="toggle-review" data-reviewed="${reviewed}" id="btn-review">
        <span class="toggle-review__box"></span>
        <span>${reviewed ? '已复习' : '标记已复习'}</span>
      </button>
    </div>`;
}

/** 渲染加载占位 */
export function showLoading() {
  contentEl.innerHTML = `
    <div class="state state--loading">
      <span class="state__icon">◉</span>
      <div class="state__title">正在加载大纲…</div>
      <div class="state__desc">正在拉取章节内容</div>
    </div>`;
}

/** 渲染错误占位 */
export function showError(err, subject, chapter) {
  const name = chapter ? `第${Number(chapter.id)}章 ${chapter.title}` : '该章节';
  contentEl.innerHTML = `
    <div class="state state--error">
      <span class="state__icon">✕</span>
      <div class="state__title">加载失败</div>
      <div class="state__desc">${esc(name)} 无法加载<br>${esc(err.message || String(err))}<br><br>请确认通过 http(s):// 访问，而非 file:// 协议。</div>
    </div>`;
}

/** 更新面包屑 */
function updateBreadcrumb(subject, chapter) {
  if (breadcrumbEl) {
    breadcrumbEl.textContent = `第${Number(chapter.id)}章 ${chapter.title}`;
  }
  document.title = `${chapter.title} · ${subject.name} · 电子技术基础考纲`;
}

/** marked 后处理：表格包一层 .table-wrap 以便横向滚动 */
function postProcess(root) {
  root.querySelectorAll('table').forEach((t) => {
    if (t.parentElement.classList.contains('table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    t.parentNode.insertBefore(wrap, t);
    wrap.appendChild(t);
  });
  // 外链新窗口打开
  root.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
}

/** 绑定"标记已复习"按钮 */
function bindReviewButton(subject, chapter) {
  const btn = document.getElementById('btn-review');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const reviewed = progress.toggleReviewed(subject.id, chapter.id);
    btn.setAttribute('data-reviewed', reviewed);
    btn.querySelector('span:last-child').textContent = reviewed ? '已复习' : '标记已复习';
  });
}

/* ---- LaTeX 公式保护 ----
 * marked 会把公式里的 _ * \ ^ 当 markdown 语法吞掉，故先提取为占位符 @@MATHn@@，
 * 该记号只含 @/字母/数字，不会触发任何 markdown 或 HTML 转义，可安全穿过渲染管线。
 */
const MATH_PLACEHOLDER_RE = /@@MATH(\d+)@@/g;

export function protectMath(text) {
  const store = [];
  const stash = (raw) => {
    const i = store.length;
    store.push(raw);
    return `@@MATH${i}@@`;
  };
  // 顺序敏感：块级 $$ / \[ 必须先于行内 $ / \( 消化，否则 $ 会误吞 $$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (m) => stash(m));
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (m) => stash(m));
  text = text.replace(/\\\(([\s\S]+?)\\\)/g, (m) => stash(m));
  text = text.replace(/\$([^\$\n]+?)\$/g, (m) => stash(m));
  return { text, store };
}

function restoreMath(root, store) {
  if (!store.length || !root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (parent && parent.closest('code, pre')) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.indexOf('@@MATH') !== -1
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const targets = [];
  let cur;
  while ((cur = walker.nextNode())) targets.push(cur);
  for (const node of targets) {
    node.nodeValue = node.nodeValue.replace(
      MATH_PLACEHOLDER_RE,
      (_, i) => store[Number(i)] ?? '',
    );
  }
}

function renderMath(root) {
  if (typeof window === 'undefined' || typeof window.renderMathInElement !== 'function') return;
  try {
    window.renderMathInElement(root, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
    });
  } catch (e) { /* 公式渲染失败不应阻塞正文阅读 */ }
}

/**
 * 渲染指定章节
 * @param {{subject:Object, chapter:Object}} pair  config.getChapter() 的返回
 */
export async function renderChapter(pair) {
  if (!pair) { renderWelcome(); return; }
  const { subject, chapter } = pair;
  ensureMarked();
  showLoading();
  updateBreadcrumb(subject, chapter);
  try {
    const res = await fetch(chapter.file);
    if (!res.ok) throw new Error(`服务器返回 ${res.status}`);
    const md = await res.text();
    const { text: safeMd, store } = protectMath(md);
    const html = window.marked.parse(safeMd);
    contentEl.innerHTML = buildBar(subject, chapter) + `<div class="markdown">${html}</div>`;
    postProcess(contentEl);
    const markdownEl = contentEl.querySelector('.markdown');
    restoreMath(markdownEl, store);
    renderMath(markdownEl);
    bindReviewButton(subject, chapter);
  } catch (err) {
    showError(err, subject, chapter);
  }
}

/** 欢迎页（无路由时）*/
export function renderWelcome() {
  if (breadcrumbEl) breadcrumbEl.textContent = '首页';
  document.title = '电子技术基础考纲 · 备考工具';
  contentEl.innerHTML = `
    <div class="welcome">
      <div class="welcome__hero">
        <h1>电子技术基础考试大纲</h1>
        <p>数电 + 模电 双科目，19 章全覆盖。左侧选择章节开始复习，顶部搜索快速定位知识点。</p>
      </div>
      <div class="welcome__grid">
        <div class="welcome__card" data-go="shudian">
          <div class="welcome__card-num">9</div>
          <div class="welcome__card-label">数字电子技术 · 章节</div>
        </div>
        <div class="welcome__card" data-go="modian">
          <div class="welcome__card-num">10</div>
          <div class="welcome__card-label">模拟电子技术 · 章节</div>
        </div>
      </div>
    </div>`;
  contentEl.querySelectorAll('.welcome__card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-go');
      // 派发自定义事件交由 main 路由
      window.dispatchEvent(new CustomEvent('ezt:goto-subject', { detail: id }));
    });
  });
}

/* ==========================================================================
 * protect-math.ts — Markdown 渲染（marked）+ LaTeX 公式保护与还原
 *
 * marked 会把公式里的 _ * \ ^ 当 markdown 语法吞掉，故先提取为占位符 @@MATHn@@，
 * 该记号只含 @/字母/数字，不会触发任何 markdown 或 HTML 转义，可安全穿过渲染管线。
 * 渲染后再用 KaTeX 还原。
 * ========================================================================== */
import katex from 'katex';
import { marked } from 'marked';
import { KATEX_OPTS, escapeHtml } from './render';

const MATH_PLACEHOLDER_RE = /@@MATH(\d+)@@/g;

/** 提取 $$ $ \[ \] \( \) 公式为占位符，返回占位后的文本与原文仓库。 */
export function protectMath(text: string): { text: string; store: string[] } {
  const store: string[] = [];
  const stash = (raw: string): string => {
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

/** marked 配置（仅一次） */
let markedReady = false;
function ensureMarked(): void {
  if (markedReady) return;
  marked.setOptions({ gfm: true, breaks: false });
  markedReady = true;
}

/** 渲染某段 markdown 为 HTML 字符串（公式已保护）。 */
export function renderMarkdown(md: string): string {
  ensureMarked();
  const { text: safeMd } = protectMath(md);
  return marked.parse(safeMd, { async: false }) as string;
}

/**
 * 把 protectMath 返回的 store 还原到已渲染的 DOM 容器，并用 KaTeX 渲染公式。
 * 在 .md-body 渲染插入 DOM 后调用。
 */
export function restoreAndRenderMath(
  root: HTMLElement,
  store: string[],
): void {
  if (!store.length || !root) return;

  // 1) 还原占位符（在文本节点中）
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (parent && parent.closest('code, pre')) return NodeFilter.FILTER_REJECT;
      return node.nodeValue && node.nodeValue.indexOf('@@MATH') !== -1
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const targets: Text[] = [];
  let cur: Node | null;
  while ((cur = walker.nextNode())) targets.push(cur as Text);
  for (const node of targets) {
    if (!node.nodeValue) continue;
    node.nodeValue = node.nodeValue.replace(
      MATH_PLACEHOLDER_RE,
      (_, i) => store[Number(i)] ?? '',
    );
  }

  // 2) 用 KaTeX auto-render 思路：扫描文本节点里的 $$ $ \[ \] \( \) 并就地渲染
  renderMathInElement(root);
}

const DISPLAY_DELIMS: [string, string][] = [
  ['$$', '$$'],
  ['\\[', '\\]'],
];
const INLINE_DELIMS: [string, string][] = [
  ['\\(', '\\)'],
  ['$', '$'],
];

/**
 * 在 root 内查找公式定界符并用 KaTeX 渲染（就地替换文本节点为 katex html）。
 * 移植自 KaTeX auto-render 的核心思路，定制 delimiters。
 */
export function renderMathInElement(root: HTMLElement): void {
  try {
    const textNodes = collectMathTextNodes(root);
    for (const node of textNodes) {
      if (!node.nodeValue) continue;
      const replaced = renderTextNode(node.nodeValue);
      if (replaced !== null) {
        const span = document.createElement('span');
        span.innerHTML = replaced;
        node.parentNode?.replaceChild(span, node);
      }
    }
  } catch {
    /* 公式渲染失败不应阻塞正文阅读 */
  }
}

/** 收集所有非 code/pre 内、含定界符的文本节点 */
function collectMathTextNodes(root: HTMLElement): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // 跳过已渲染的 katex 内部
      if (parent.closest('.katex')) return NodeFilter.FILTER_REJECT;
      if (parent.closest('code, pre')) return NodeFilter.FILTER_REJECT;
      const v = node.nodeValue ?? '';
      if (
        v.includes('$$') ||
        v.includes('\\[') ||
        v.includes('\\(') ||
        v.includes('$')
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_REJECT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

/** 把单个文本节点的值按公式定界符切分渲染，返回 HTML 串；无公式返回 null。 */
function renderTextNode(value: string): string | null {
  // 先处理块级（$$...$$ 与 \[...\]），再处理行内（\(...\) 与 $...$）
  let parts: Segment[] = [{ text: value, math: false, display: false }];

  for (const [left, right] of DISPLAY_DELIMS) {
    parts = splitByDelim(parts, left, right, true);
  }
  for (const [left, right] of INLINE_DELIMS) {
    parts = splitByDelim(parts, left, right, false);
  }

  const hasMath = parts.some((p) => p.math);
  if (!hasMath) return null;

  return parts
    .map((p) => {
      if (!p.math) return escapeHtml(p.text);
      // p.text 此刻是定界符包裹的原文（含 $$ / $）；剥定界符后渲染
      const inner = stripDelims(p.text);
      try {
        return katex.renderToString(inner, {
          ...KATEX_OPTS,
          displayMode: p.display,
        });
      } catch {
        return escapeHtml(p.text);
      }
    })
    .join('');
}

interface Segment {
  text: string;
  math: boolean;
  display: boolean;
}

/** 在已有分段上，按 (left,right) 定界符进一步切分出公式段。 */
function splitByDelim(
  parts: Segment[],
  left: string,
  right: string,
  display: boolean,
): Segment[] {
  const out: Segment[] = [];
  const leftEsc = regexEscape(left);
  const rightEsc = regexEscape(right);
  const re = new RegExp(`${leftEsc}([\\s\\S]+?)${rightEsc}`, 'g');

  for (const seg of parts) {
    if (seg.math) {
      out.push(seg);
      continue;
    }
    let last = 0;
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(seg.text)) !== null) {
      if (m.index > last) {
        out.push({ text: seg.text.slice(last, m.index), math: false, display: false });
      }
      // 保留原始定界符包裹，renderTextNode 里统一剥
      out.push({ text: m[0], math: true, display });
      last = m.index + m[0].length;
    }
    if (last < seg.text.length) {
      out.push({ text: seg.text.slice(last), math: false, display: false });
    }
  }
  return out;
}

function stripDelims(raw: string): string {
  // $$...$$ / $...$ / \[...\] / \(...\)
  if (raw.startsWith('$$') && raw.endsWith('$$')) return raw.slice(2, -2);
  if (raw.startsWith('\\[') && raw.endsWith('\\]')) return raw.slice(2, -2);
  if (raw.startsWith('\\(') && raw.endsWith('\\)')) return raw.slice(2, -2);
  if (raw.startsWith('$') && raw.endsWith('$')) return raw.slice(1, -1);
  return raw;
}

function regexEscape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

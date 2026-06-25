/* ==========================================================================
 * render.ts — KaTeX 基础渲染（display / inline）+ 共享选项与转义
 * trust:true / strict:false：支持 \htmlClass（符号标记用），关闭警告。
 * renderToString：公式卡片 display 渲染。
 * ========================================================================== */
import katex from 'katex';

/** 共享渲染选项（\htmlClass 需 trust，strict 关警告风暴） */
export const KATEX_OPTS = {
  throwOnError: false,
  trust: true,
  strict: false,
} as const;

/** display 模式渲染（公式卡片） */
export function renderDisplay(latex: string): string {
  try {
    return katex.renderToString(latex, {
      ...KATEX_OPTS,
      displayMode: true,
    });
  } catch {
    return `<code>${escapeHtml(latex)}</code>`;
  }
}

/** inline 模式渲染（符号弹窗内的符号行内展示） */
export function renderInline(latex: string): string {
  try {
    return katex.renderToString(latex, {
      ...KATEX_OPTS,
      displayMode: false,
    });
  } catch {
    return escapeHtml(latex);
  }
}

export function escapeHtml(s: string): string {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c] as string,
  );
}

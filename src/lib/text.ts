/* ==========================================================================
 * text.ts — 富文本渲染：把 $...$ 行内数学段用 KaTeX 渲染，其余 HTML 转义。
 * 用于例题题干 / 解答步骤文字（不需要符号弹窗的场景）。
 * 推导步骤（DerivationSteps）因需符号 popover 仍用自带 markupSymbols 版本。
 * ========================================================================== */
import { renderInline } from './katex';

function escapeHtml(s: string): string {
  return s.replace(
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

/** 渲染含 $...$ 行内数学的纯文本 → HTML 字符串 */
export function renderRichText(text: string): string {
  if (!text) return '';
  return text
    .split(/(\$[^$]+\$)/g)
    .map((part) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        try {
          return renderInline(part.slice(1, -1));
        } catch {
          return escapeHtml(part);
        }
      }
      return escapeHtml(part);
    })
    .join('');
}

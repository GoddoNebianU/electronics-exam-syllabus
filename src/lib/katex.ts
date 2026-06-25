/* ==========================================================================
 * katex.ts — KaTeX 渲染辅助（聚合入口）
 * 实现拆分到：
 *   - render.ts        display/inline 渲染 + 共享 KATEX_OPTS/escapeHtml
 *   - protect-math.ts  markdown 公式保护 + restoreAndRenderMath/renderMathInElement
 * 对外导出保持不变（renderDisplay / renderInline / protectMath /
 * restoreAndRenderMath / renderMathInElement / renderMarkdown）。
 * ========================================================================== */
export { renderDisplay, renderInline, KATEX_OPTS } from './render';
export {
  protectMath,
  renderMarkdown,
  restoreAndRenderMath,
  renderMathInElement,
} from './protect-math';

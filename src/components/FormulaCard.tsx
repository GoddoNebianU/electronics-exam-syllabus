/* ==========================================================================
 * FormulaCard.tsx — 单条公式卡片
 * markupSymbols(latex, symbols, dict) → KaTeX display 渲染。
 * 符号点击由父级做事件委托（监听 .sym），本组件只负责渲染。
 * ========================================================================== */
import { useMemo } from 'react';
import type { Formula, SymbolDict } from '../data/types';
import { markupSymbols } from '../lib/markupSymbols';
import { renderDisplay } from '../lib/katex';

interface FormulaCardProps {
  formula: Formula;
  symbols: SymbolDict;
}

export function FormulaCard({ formula, symbols }: FormulaCardProps) {
  const mathHtml = useMemo(() => {
    const marked = markupSymbols(formula.latex, formula.symbols, symbols);
    return renderDisplay(marked);
  }, [formula.latex, formula.symbols, symbols]);

  return (
    <article className="formula" id={`f-${formula.id}`}>
      <h4 className="formula__title">{formula.title}</h4>
      <div
        className="formula-math"
        dangerouslySetInnerHTML={{ __html: mathHtml }}
      />
      {formula.note && <p className="formula__note">{formula.note}</p>}
    </article>
  );
}

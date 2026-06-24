/* ==========================================================================
 * FormulaCard.tsx — 单条公式卡片
 * markupSymbols(latex, symbols, dict) → KaTeX display 渲染。
 * 符号点击由父级做事件委托（监听 .sym），本组件只负责渲染。
 * 右上角星标按钮：收藏 toggle（viewId + formulaId）。
 * ========================================================================== */
import { useMemo } from 'react';
import type { Formula, SymbolDict } from '../data/types';
import { markupSymbols } from '../lib/markupSymbols';
import { renderDisplay } from '../lib/katex';
import { DerivationSteps } from './DerivationSteps';
import {
  useFavoriteStore,
  formulaFavKey,
} from '../store/useFavoriteStore';

interface FormulaCardProps {
  formula: Formula;
  symbols: SymbolDict;
  /** 公式视图 id（收藏键之一）；不传则不渲染星标 */
  viewId: string;
}

export function FormulaCard({ formula, symbols, viewId }: FormulaCardProps) {
  const mathHtml = useMemo(() => {
    const marked = markupSymbols(formula.latex, formula.symbols, symbols);
    return renderDisplay(marked);
  }, [formula.latex, formula.symbols, symbols]);

  const key = formulaFavKey(viewId, formula.id);
  const isFavorite = useFavoriteStore((s) => Boolean(s.items[key]));
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite);

  return (
    <article className="formula" id={`f-${formula.id}`}>
      <button
        type="button"
        className="formula__fav"
        data-fav={isFavorite}
        aria-label={isFavorite ? '取消收藏' : '收藏公式'}
        aria-pressed={isFavorite}
        title={isFavorite ? '取消收藏' : '收藏公式'}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(key);
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            className="formula__fav-path"
            d="M12 2.5l2.9 6.05 6.6.78-4.85 4.55 1.25 6.52L12 17.9l-5.9 2.5 1.25-6.52L2.5 9.33l6.6-.78L12 2.5z"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h4 className="formula__title">{formula.title}</h4>
      <div
        className="formula-math"
        dangerouslySetInnerHTML={{ __html: mathHtml }}
      />
      {formula.note && <p className="formula__note">{formula.note}</p>}
      {formula.derivation && formula.derivation.length > 0 && (
        <DerivationSteps steps={formula.derivation} symbols={symbols} />
      )}
    </article>
  );
}

/* ==========================================================================
 * DerivationSteps.tsx — 公式推导折叠区（独立组件）
 *
 * 接收推导步骤数组 + 符号字典，渲染可折叠的推导过程：
 *   - 默认收起，点「推导」展开
 *   - 每步：text（文字说明）+ latex（KaTeX inline，符号经 markupSymbols 可点击）
 *   - 符号点击事件冒泡到 FormulaPage 的 .sym 委托（与公式本体体验一致）
 *   - 素雅风格：小圆角、无渐变，复用现有令牌
 * ========================================================================== */
import { useMemo, useState } from 'react';
import type { DerivationStep, SymbolDict } from '../data/types';
import { markupSymbols } from '../lib/markupSymbols';
import { renderInline } from '../lib/katex';

interface DerivationStepsProps {
  steps: DerivationStep[];
  symbols: SymbolDict;
}

export function DerivationSteps({ steps, symbols }: DerivationStepsProps) {
  const [open, setOpen] = useState(false);

  // 字典全部 token 作为候选——markupSymbols 会自动只标记实际出现的
  const allTokens = useMemo(() => Object.keys(symbols), [symbols]);

  const rendered = useMemo(
    () =>
      steps.map((s) => {
        const html =
          s.latex != null && s.latex !== ''
            ? renderInline(markupSymbols(s.latex, allTokens, symbols))
            : '';
        return { text: s.text, html };
      }),
    [steps, allTokens, symbols],
  );

  return (
    <div className="derivation" data-open={open}>
      <button
        type="button"
        className="derivation__toggle"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span className="derivation__toggle-icon">{open ? '▾' : '▸'}</span>
        推导
        <span className="derivation__toggle-count">{steps.length} 步</span>
      </button>
      {open && (
        <ol className="derivation__list">
          {rendered.map((s, i) => (
            <li className="derivation__step" key={i}>
              <span className="derivation__step-text">{s.text}</span>
              {s.html && (
                <span
                  className="derivation__step-math"
                  dangerouslySetInnerHTML={{ __html: s.html }}
                />
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import type { DerivationStep, SymbolDict } from '../data/types';
import { markupSymbols } from '../lib/markupSymbols';
import { renderInline } from '../lib/katex';

interface DerivationStepsProps {
  steps: DerivationStep[];
  symbols: SymbolDict;
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string),
  );
}

function renderTextWithMath(text: string, allTokens: string[], dict: SymbolDict): string {
  if (!text) return '';
  return text
    .split(/(\$[^$]+\$)/g)
    .map((part) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const tex = part.slice(1, -1);
        try {
          return renderInline(markupSymbols(tex, allTokens, dict));
        } catch {
          return escapeHtml(part);
        }
      }
      return escapeHtml(part);
    })
    .join('');
}

export function DerivationSteps({ steps, symbols }: DerivationStepsProps) {
  const [open, setOpen] = useState(false);

  const allTokens = useMemo(() => Object.keys(symbols), [symbols]);

  const rendered = useMemo(
    () =>
      steps.map((s) => ({
        textHtml: renderTextWithMath(s.text, allTokens, symbols),
        mathHtml:
          s.latex != null && s.latex !== ''
            ? renderInline(markupSymbols(s.latex, allTokens, symbols))
            : '',
      })),
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
              <span
                className="derivation__step-text"
                dangerouslySetInnerHTML={{ __html: s.textHtml }}
              />
              {s.mathHtml && (
                <span
                  className="derivation__step-math"
                  dangerouslySetInnerHTML={{ __html: s.mathHtml }}
                />
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

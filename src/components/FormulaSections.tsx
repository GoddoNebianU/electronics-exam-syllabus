/* ==========================================================================
 * FormulaSections.tsx — 公式手册页的列表/分组渲染
 * 从 FormulaPage 抽出：分类节渲染、收藏分组渲染、空态、筛选高亮。
 * ========================================================================== */
import type { Formula, FormulaCategory, SymbolDict } from '../data/types';
import type { FormulaView } from '../data/formula-registry';
import { FormulaCard } from './FormulaCard';

function regEscape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(s: string): string {
  return String(s).replace(
    /[&<>]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string,
  );
}

function highlightHtml(text: string, query: string): string {
  const escaped = escapeHtml(text);
  if (!query) return escaped;
  const re = new RegExp(`(${regEscape(query)})`, 'gi');
  return escaped.replace(re, '<mark>$1</mark>');
}

/** 公式是否匹配查询（标题 / 说明 / 符号 name+desc） */
function matchFormula(f: Formula, symbols: SymbolDict, q: string): boolean {
  if (!q) return true;
  const hay = (f.title + ' ' + (f.note ?? '')).toLowerCase();
  if (hay.includes(q)) return true;
  for (const tok of f.symbols) {
    const def = symbols[tok];
    if (!def) continue;
    if (
      def.name.toLowerCase().includes(q) ||
      def.desc.toLowerCase().includes(q) ||
      tok.toLowerCase().includes(q)
    ) {
      return true;
    }
  }
  return false;
}

interface FormulaSectionProps {
  category: FormulaCategory;
  formulas: Formula[];
  symbols: SymbolDict;
  viewId: string;
  filterText: string;
}

/** 单个分类节（已过滤后的公式列表） */
export function FormulaSection({
  category,
  formulas,
  symbols,
  viewId,
  filterText,
}: FormulaSectionProps) {
  return (
    <section
      key={category.id}
      className="fields-section"
      id={`cat-${category.id}`}
      data-cat={category.id}
    >
      <header className="fields-section__head">
        <h3
          className="fields-section__title"
          dangerouslySetInnerHTML={{
            __html: highlightHtml(category.name, filterText),
          }}
        />
        <p className="fields-section__brief">{category.brief}</p>
      </header>
      {formulas.map((f) => (
        <FormulaCard
          key={f.id}
          formula={f}
          symbols={symbols}
          viewId={viewId}
        />
      ))}
    </section>
  );
}

interface FormulaSectionListProps {
  categories: FormulaCategory[];
  formulas: Formula[];
  symbols: SymbolDict;
  viewId: string;
  query: string;
  filterText: string;
}

/** 全部分类节 + 无匹配空态 */
export function FormulaSectionList({
  categories,
  formulas,
  symbols,
  viewId,
  query,
  filterText,
}: FormulaSectionListProps) {
  const visible = categories.map((c) => ({
    c,
    fs: formulas.filter((f) => f.cat === c.id && matchFormula(f, symbols, query)),
  }));
  const any = visible.some(({ fs }) => fs.length > 0);
  return (
    <>
      {visible.map(({ c, fs }) =>
        fs.length ? (
          <FormulaSection
            key={c.id}
            category={c}
            formulas={fs}
            symbols={symbols}
            viewId={viewId}
            filterText={filterText}
          />
        ) : null,
      )}
      {query && !any && (
        <div className="state">
          <div className="state__title">没有匹配的公式</div>
          <div className="state__desc">
            试试其他关键词（标题、说明或符号名），或清空筛选。
          </div>
        </div>
      )}
    </>
  );
}

/** 单个收藏分组（按公式视图分组） */
export function FavoriteFormulaSection({
  view,
  formulas,
}: {
  view: FormulaView;
  formulas: Formula[];
}) {
  return (
    <section
      key={view.id}
      className="fields-section"
      data-cat={view.id}
    >
      <header className="fields-section__head">
        <h3 className="fields-section__title">{view.title}</h3>
        <p className="fields-section__brief">{view.subtitle}</p>
      </header>
      {formulas.map((f) => (
        <FormulaCard
          key={`${view.id}-${f.id}`}
          formula={f}
          symbols={view.data.symbols}
          viewId={view.id}
        />
      ))}
    </section>
  );
}

/** 收藏分组列表 + 无收藏空态 */
export function FavoriteSectionList({
  groups,
}: {
  groups: { view: FormulaView; formulas: Formula[] }[];
}) {
  if (groups.length === 0) {
    return (
      <div className="state">
        <div className="state__title">还没有收藏的公式</div>
        <div className="state__desc">
          在公式卡片右上角点 ☆ 即可收藏，便于跨科目速查。
        </div>
      </div>
    );
  }
  return (
    <>
      {groups.map(({ view, formulas }) => (
        <FavoriteFormulaSection key={view.id} view={view} formulas={formulas} />
      ))}
    </>
  );
}

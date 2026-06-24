/* ==========================================================================
 * FormulaPage.tsx — 公式手册页（数据驱动）
 * 路由 /:routeName[/:catId]，routeName ∈ {fields, modian-formulas}。
 * 职责：
 *   - 取公式视图配置（分类/公式/符号字典）
 *   - 设 <html data-subject>（主题色：fields 紫灰 / modian 暖灰）
 *   - 工具条（返回 + 标题 + 筛选）+ 左分类导航 + 右公式区
 *   - 符号点击委托：.sym → KID → token → 弹窗
 *   - 滚动联动高亮（FormulaNav scrollspy）
 * 迁移自 legacy/js/formula-view.js + formula-core.js 的 mountFormulaPage。
 * ========================================================================== */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFormulaView } from '../data/formula-registry';
import type { SymbolDef } from '../data/types';
import { getRegistry } from '../lib/markupSymbols';
import { FormulaCard } from '../components/FormulaCard';
import { FormulaNav } from '../components/FormulaNav';
import { SymbolPopover } from '../components/SymbolPopover';

interface FormulaPageProps {
  /** 公式视图路由名（fields | modian-formulas），由路由表传入 */
  routeName: string;
}

export function FormulaPage({ routeName }: FormulaPageProps) {
  const { catId } = useParams();
  const view = getFormulaView(routeName);

  const [activeCat, setActiveCat] = useState<string>(catId ?? '');
  const [filter, setFilter] = useState('');
  const [popover, setPopover] = useState<{
    token: string;
    def: SymbolDef;
    anchor: HTMLElement;
  } | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);

  const { categories, formulas, symbols } = view?.data ?? {
    categories: [],
    formulas: [],
    symbols: {},
  };
  const registry = useMemo(
    () => (view ? getRegistry(symbols) : null),
    [view, symbols],
  );

  // 设主题色 + 标题
  useEffect(() => {
    if (!view) return;
    document.documentElement.setAttribute('data-subject', view.subject);
    document.title = `${view.title} · 公式手册 · 电子技术基础考纲`;
  }, [view]);

  // 路由带 catId 时滚动到分类
  useEffect(() => {
    if (!catId) return;
    setActiveCat(catId);
    const el = document.getElementById(`cat-${CSS.escape(catId)}`);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [catId]);

  // 点击导航分类 → 平滑滚动
  const onNavigate = useCallback(
    (cId: string) => {
      setActiveCat(cId);
      const el = document.getElementById(`cat-${CSS.escape(cId)}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [],
  );

  // 符号点击委托：在公式区监听 .sym 点击
  const onContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!registry) return;
      const target = e.target as HTMLElement;
      const sym = target.closest('.sym') as HTMLElement | null;
      if (!sym) return;
      e.preventDefault();
      e.stopPropagation();
      const cls = sym.getAttribute('class') || '';
      const m = cls.match(/sym-([A-Za-z0-9_-]+)/);
      if (!m) return;
      const token = registry.resolve(m[1]);
      if (!token) return;
      const def = symbols[token];
      if (def) setPopover({ token, def, anchor: sym });
    },
    [registry, symbols],
  );

  if (!view) {
    return (
      <div className="state state--error">
        <span className="state__icon">✕</span>
        <div className="state__title">未知公式页</div>
      </div>
    );
  }

  const q = filter.trim().toLowerCase();

  return (
    <div className="fields-root">
      {/* 工具条 */}
      <div className="fields-toolbar">
        <div className="fields-toolbar__left">
          <Link className="fields-back" to="/shudian/01" title="返回考纲大纲">
            ← 考纲
          </Link>
          <div className="fields-toolbar__title">
            <span className="fields-toolbar__name">{view.title}</span>
            <span className="fields-toolbar__sub">{view.subtitle}</span>
          </div>
        </div>
        <div className="fields-toolbar__right">
          <div className="fields-search">
            <span className="fields-search__icon">⌕</span>
            <input
              className="fields-search__input"
              type="text"
              placeholder="筛选公式标题或说明…"
              autoComplete="off"
              spellCheck={false}
              aria-label="筛选公式"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 主体两栏 */}
      <div className="fields-body">
        <FormulaNav
          categories={categories}
          formulas={formulas}
          activeCat={activeCat}
          onNavigate={onNavigate}
        />
        <div
          className="fields-main"
          ref={mainRef}
          onClick={onContainerClick}
        >
          {categories.map((c) => {
            const fs = formulas.filter(
              (f) =>
                f.cat === c.id &&
                (!q ||
                  (f.title + ' ' + (f.note ?? ''))
                    .toLowerCase()
                    .includes(q)),
            );
            if (!fs.length) return null;
            return (
              <section
                key={c.id}
                className="fields-section"
                id={`cat-${c.id}`}
                data-cat={c.id}
              >
                <header className="fields-section__head">
                  <h3 className="fields-section__title">{c.name}</h3>
                  <p className="fields-section__brief">{c.brief}</p>
                </header>
                {fs.map((f) => (
                  <FormulaCard key={f.id} formula={f} symbols={symbols} />
                ))}
              </section>
            );
          })}
          {/* 无匹配时的空态 */}
          {q &&
            !categories.some((c) =>
              formulas.some(
                (f) =>
                  f.cat === c.id &&
                  (f.title + ' ' + (f.note ?? '')).toLowerCase().includes(q),
              ),
            ) && (
              <div className="state">
                <div className="state__title">没有匹配的公式</div>
                <div className="state__desc">试试其他关键词，或清空筛选。</div>
              </div>
            )}
        </div>
      </div>

      <SymbolPopover
        def={popover?.def ?? null}
        token={popover?.token ?? null}
        anchor={popover?.anchor ?? null}
        onClose={() => setPopover(null)}
      />
    </div>
  );
}

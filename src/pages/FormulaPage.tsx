/* ==========================================================================
 * FormulaPage.tsx — 公式手册页（数据驱动）
 * 路由 /:routeName[/:catId]，routeName ∈ {fields, modian-formulas}。
 * 职责：
 *   - 取公式视图配置（分类/公式/符号字典）
 *   - 设 <html data-subject>（主题色：fields 紫灰 / modian 暖灰）
 *   - 工具条（返回 + 标题 + 筛选 + ★收藏切换）+ 左分类导航 + 右公式区
 *   - 符号点击委托：.sym → KID → token → 弹窗
 *   - 滚动联动高亮（FormulaNav scrollspy）
 *   - 搜索范围：标题 / 说明 / 符号 name+desc（symbolsDict）；命中高亮
 *   - ★收藏 模式：跨所有公式视图展示已收藏公式，按视图分组
 * 列表/分组/空态渲染见 components/FormulaSections.tsx。
 * 迁移自 legacy/js/formula-view.js + formula-core.js 的 mountFormulaPage。
 * ========================================================================== */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFormulaView, FORMULA_VIEWS } from '../data/formula-registry';
import type { SymbolDef } from '../data/types';
import { getRegistry } from '../lib/markupSymbols';
import { FormulaNav } from '../components/FormulaNav';
import { SymbolPopover } from '../components/SymbolPopover';
import {
  FormulaSectionList,
  FavoriteSectionList,
} from '../components/FormulaSections';
import { useFavoriteStore } from '../store/useFavoriteStore';

interface FormulaPageProps {
  routeName: string;
}

export function FormulaPage({ routeName }: FormulaPageProps) {
  const { catId } = useParams();
  const view = getFormulaView(routeName);

  const [activeCat, setActiveCat] = useState<string>(catId ?? '');
  const [filter, setFilter] = useState('');
  const [favMode, setFavMode] = useState(false);
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

  const favList = useFavoriteStore((s) => s.formulaList());
  const favCount = useFavoriteStore((s) => s.count);

  useEffect(() => {
    if (!view) return;
    document.documentElement.setAttribute('data-subject', view.subject);
    document.title = `${view.title} · 公式手册 · 电子技术基础考纲`;
  }, [view]);

  useEffect(() => {
    if (!catId) return;
    setActiveCat(catId);
    const el = document.getElementById(`cat-${CSS.escape(catId)}`);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [catId]);

  const onNavigate = useCallback((cId: string) => {
    setActiveCat(cId);
    const el = document.getElementById(`cat-${CSS.escape(cId)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

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
  const trimmedFilter = filter.trim();

  const enterFavMode = () => {
    setFavMode(true);
    setFilter('');
    window.scrollTo({ top: 0 });
  };
  const exitFavMode = () => {
    setFavMode(false);
    window.scrollTo({ top: 0 });
  };

  // 收藏模式下：跨视图收集已收藏公式，按视图分组
  const favGroups = useMemo(() => {
    if (!favMode) return [];
    return FORMULA_VIEWS.map((v) => {
      const ids = new Set(
        favList
          .filter((f) => f.viewId === v.id)
          .map((f) => f.formulaId),
      );
      const fs = v.data.formulas.filter((f) => ids.has(f.id));
      return { view: v, formulas: fs };
    }).filter((g) => g.formulas.length > 0);
  }, [favMode, favList]);

  return (
    <div className="fields-root">
      <div className="fields-toolbar">
        <div className="fields-toolbar__left">
          <Link className="fields-back" to="/shudian/01" title="返回考纲大纲">
            ← 考纲
          </Link>
          <div className="fields-toolbar__title">
            <span className="fields-toolbar__name">
              {favMode ? '★ 收藏公式' : view.title}
            </span>
            <span className="fields-toolbar__sub">
              {favMode
                ? `跨科目 · 共 ${favList.length} 式`
                : view.subtitle}
            </span>
          </div>
        </div>
        <div className="fields-toolbar__right">
          <button
            type="button"
            className="fields-fav-toggle"
            data-active={favMode}
            onClick={favMode ? exitFavMode : enterFavMode}
            title={favMode ? '退出收藏视图' : '查看收藏的公式'}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path
                d="M12 2.5l2.9 6.05 6.6.78-4.85 4.55 1.25 6.52L12 17.9l-5.9 2.5 1.25-6.52L2.5 9.33l6.6-.78L12 2.5z"
                fill={favMode ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <span>收藏</span>
            {favCount > 0 && <em className="fields-fav-toggle__count">{favCount}</em>}
          </button>
          {!favMode && (
            <div className="fields-search">
              <span className="fields-search__icon">⌕</span>
              <input
                className="fields-search__input"
                type="text"
                placeholder="搜索标题 / 说明 / 符号…"
                autoComplete="off"
                spellCheck={false}
                aria-label="筛选公式"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              {filter && (
                <button
                  type="button"
                  className="fields-search__clear"
                  aria-label="清空筛选"
                  onClick={() => setFilter('')}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fields-body">
        {!favMode && (
          <FormulaNav
            categories={categories}
            formulas={formulas}
            activeCat={activeCat}
            onNavigate={onNavigate}
          />
        )}
        <div
          className={`fields-main ${favMode ? 'fields-main--fav' : ''}`}
          ref={mainRef}
          onClick={onContainerClick}
        >
          {favMode ? (
            <FavoriteSectionList groups={favGroups} />
          ) : (
            <FormulaSectionList
              categories={categories}
              formulas={formulas}
              symbols={symbols}
              viewId={view.id}
              query={q}
              filterText={trimmedFilter}
            />
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

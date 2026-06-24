/* ==========================================================================
 * Header.tsx — 顶栏
 * 共享于大纲页与公式页。根据当前路由决定：
 *   - 大纲页：显示汉堡按钮（移动端）+ 搜索框
 *   - 公式页：隐藏汉堡按钮与搜索框（避免误触发大纲抽屉遮罩盖住公式页）
 * 公式入口按钮始终显示，当前视图对应高亮。
 * 统计按钮始终显示（大纲页与公式页均可查看复习统计）。
 * ========================================================================== */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FORMULA_VIEWS } from '../data/formula-registry';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';
import { StatsPanel } from './StatsPanel';

/** 判断当前路径是否命中某公式视图（返回视图 id 或 null） */
function matchFormulaView(pathname: string): string | null {
  const seg = pathname.replace(/^\/+/, '').split('/')[0];
  const view = FORMULA_VIEWS.find((v) => v.routeName === seg);
  return view ? view.id : null;
}

export function Header() {
  const location = useLocation();
  const openSidebar = useSyllabusStore((s) => s.openSidebar);
  const formulaViewId = matchFormulaView(location.pathname);
  const isFormula = formulaViewId !== null;
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <header className="header">
      {!isFormula && (
        <button
          type="button"
          className="header__menu-btn"
          aria-label="打开菜单"
          onClick={openSidebar}
        >
          ☰
        </button>
      )}

      <div className="header__brand">
        <div className="header__logo">电</div>
        <div className="header__title">
          电子技术基础
          <small>数电 + 模电 · 考纲</small>
        </div>
      </div>

      <div className="header__tools">
        {FORMULA_VIEWS.map((v) => (
          <Link
            key={v.id}
            to={`/${v.routeName}`}
            title={v.entryTitle}
            className={`header__fields-btn ${
              formulaViewId === v.id ? 'is-active' : ''
            }`}
          >
            <span className="header__fields-icon" aria-hidden="true">
              📐
            </span>
            <span className="header__fields-text">{v.entryLabel}</span>
          </Link>
        ))}

        {!isFormula && <SearchBox />}

        <button
          type="button"
          className="icon-btn"
          title="复习统计"
          aria-label="打开复习统计面板"
          onClick={() => setStatsOpen(true)}
        >
          ▥
        </button>

        <ThemeToggle />
      </div>

      <StatsPanel open={statsOpen} onClose={() => setStatsOpen(false)} />
    </header>
  );
}

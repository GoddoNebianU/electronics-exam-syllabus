/* ==========================================================================
 * Header.tsx — 顶栏
 * 入口按钮与高亮、是否隐藏汉堡/搜索，均由 app-pages 注册表驱动。
 * 全宽页（公式手册 / 背记 / 例题）隐藏汉堡与搜索，避免误触发大纲抽屉遮罩
 * 盖住全宽主区。统计按钮与主题切换始终显示。
 * ========================================================================== */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HEADER_ENTRIES, FULL_WIDTH_SEGMENTS } from '../data/app-pages';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';
import { StatsPanel } from './StatsPanel';

export function Header() {
  const { pathname } = useLocation();
  const openSidebar = useSyllabusStore((s) => s.openSidebar);
  const seg = pathname.replace(/^\/+/, '').split('/')[0];
  const hideChrome = FULL_WIDTH_SEGMENTS.has(seg);
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <header className="header">
      {!hideChrome && (
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
        {HEADER_ENTRIES.map((e) => (
          <Link
            key={e.segment}
            to={e.to}
            title={e.title}
            className={`header__entry ${seg === e.segment ? 'is-active' : ''}`}
          >
            <span className="header__entry-icon" aria-hidden="true">
              {e.icon}
            </span>
            <span className="header__entry-text">{e.label}</span>
          </Link>
        ))}

        {!hideChrome && <SearchBox />}

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

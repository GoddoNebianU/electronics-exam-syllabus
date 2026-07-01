/* ==========================================================================
 * FormulaNav.tsx — 公式分类导航（左侧）
 * 列出分类（名称 + 简介 + 计数），点击平滑滚动到对应区块；
 * 滚动联动高亮当前分类（IntersectionObserver scrollspy）。
 * 迁移自 legacy/js/formula-core.js 的 renderNav + setupScrollSpy。
 * ========================================================================== */
import { useEffect } from 'react';
import type { Formula, FormulaCategory } from '../data/types';

interface FormulaNavProps {
  categories: FormulaCategory[];
  formulas: Formula[];
  /** 当前激活分类（scrollspy 维护，外部也可设初值） */
  activeCat: string;
  /** 用户点击导航项：高亮 + 平滑滚动到该分类 */
  onNavigate: (catId: string) => void;
  /** scrollspy 检测到当前可视分类：仅更新高亮，不滚动（避免覆盖用户点击的目标） */
  onHighlight: (catId: string) => void;
}

export function FormulaNav({
  categories,
  formulas,
  activeCat,
  onNavigate,
  onHighlight,
}: FormulaNavProps) {
  const countOf = (catId: string) =>
    formulas.reduce((n, f) => n + (f.cat === catId ? 1 : 0), 0);

  // scrollspy：监听区块进入视口，仅更新激活高亮（不触发滚动）
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = document.querySelectorAll('.fields-section');
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const en of entries) {
          if (en.isIntersecting) {
            if (!best || en.boundingClientRect.top < best.boundingClientRect.top) {
              best = en;
            }
          }
        }
        if (best) {
          const cat = (best.target as HTMLElement).getAttribute('data-cat');
          if (cat) onHighlight(cat);
        }
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [onHighlight]);

  return (
    <nav className="fields-nav" aria-label="公式分类导航">
      <div className="fields-nav__label">章节分类</div>
      {categories.map((c) => (
        <a
          key={c.id}
          className={`fields-nav__item ${c.id === activeCat ? 'is-active' : ''}`}
          href={`#/cat-${c.id}`}
          data-cat={c.id}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(c.id);
          }}
        >
          <span className="fields-nav__name">{c.name}</span>
          <span className="fields-nav__brief">{c.brief}</span>
          <span className="fields-nav__count">{countOf(c.id)}</span>
        </a>
      ))}
    </nav>
  );
}

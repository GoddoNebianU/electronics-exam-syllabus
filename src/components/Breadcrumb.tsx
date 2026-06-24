/* ==========================================================================
 * Breadcrumb.tsx — 面包屑导航
 * ========================================================================== */

interface BreadcrumbProps {
  /** 当前页名（章节标题 / 公式页名） */
  current: string;
}

export function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="路径">
      <span>电子技术基础</span>
      <span className="breadcrumb__sep">›</span>
      <span className="breadcrumb__current">{current}</span>
    </nav>
  );
}

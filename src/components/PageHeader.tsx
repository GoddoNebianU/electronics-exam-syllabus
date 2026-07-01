/* ==========================================================================
 * PageHeader.tsx — 共享页头（返回链接 + 标题 + 右侧控件槽）
 *
 * 三种全宽页（公式手册 / 背记 / 例题）复用同一套页头结构与样式。
 * sticky 模式用于公式手册全幅粘性工具条（替换原 .fields-toolbar）；
 * 默认模式用于居中单列页（背记 / 例题）。
 * ========================================================================== */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** 返回链接目标，默认回考纲 */
  backTo?: string;
  backLabel?: string;
  /** 全幅粘性工具条（公式手册用）；默认否（居中单列页） */
  sticky?: boolean;
  /** 右侧控件槽（筛选/选择/搜索等） */
  children?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo = '/shudian/01',
  backLabel = '← 考纲',
  sticky = false,
  children,
}: PageHeaderProps) {
  return (
    <div className={`page-header${sticky ? ' page-header--sticky' : ''}`}>
      <div className="page-header__left">
        <Link className="page-header__back" to={backTo} title="返回考纲">
          {backLabel}
        </Link>
        <div className="page-header__title">
          <span className="page-header__name">{title}</span>
          {subtitle && <span className="page-header__sub">{subtitle}</span>}
        </div>
      </div>
      {children && <div className="page-header__right">{children}</div>}
    </div>
  );
}

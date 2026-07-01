/* ==========================================================================
 * app-pages.tsx — 顶层页面注册表（路由 / 布局 / 顶栏入口的唯一数据源）
 *
 * 设计目的：把"新增一个全宽页要改 routes/App/Header 三处"的散点逻辑收拢为
 * 一处声明。routes.tsx 生成 <Route>、App.tsx 判布局、Header.tsx 渲入口按钮
 * 三者均消费本表，互不耦合。
 *
 * 注：内容数据（公式/符号/例题）仍在 content/*.json，与本表（路由配置）分离。
 * ========================================================================== */
import type { ReactElement } from 'react';
import { FormulaPage } from '../pages/FormulaPage';
import { MemorizePage } from '../pages/MemorizePage';
import { ExamplesPage } from '../pages/ExamplesPage';
import { OutlinePage } from '../pages/OutlinePage';
import { FORMULA_VIEWS } from './formula-registry';

export type PageLayout = 'full' | 'sidebar';

export interface RouteDef {
  path: string;
  element: ReactElement;
}

export interface HeaderEntry {
  /** 路径首段，用于顶栏高亮匹配 */
  segment: string;
  icon: string;
  label: string;
  title: string;
  to: string;
}

export interface AppPage {
  id: string;
  /** 路径首段；大纲页为兜底动态路由，segment 留空 */
  segment: string;
  layout: PageLayout;
  routes: RouteDef[];
  /** 顶栏入口；无则不显示（大纲页） */
  header?: HeaderEntry;
}

export const APP_PAGES: AppPage[] = [
  // 三个公式手册视图（由 FORMULA_VIEWS 派生）
  ...FORMULA_VIEWS.map((v) => ({
    id: v.id,
    segment: v.routeName,
    layout: 'full' as const,
    routes: [
      { path: `/${v.routeName}`, element: <FormulaPage routeName={v.routeName} /> },
      { path: `/${v.routeName}/:catId`, element: <FormulaPage routeName={v.routeName} /> },
    ],
    header: {
      segment: v.routeName,
      icon: '📐',
      label: v.entryLabel,
      title: v.entryTitle,
      to: `/${v.routeName}`,
    },
  })),
  // 公式背记（闪卡）
  {
    id: 'memorize',
    segment: 'memorize',
    layout: 'full',
    routes: [{ path: '/memorize', element: <MemorizePage /> }],
    header: { segment: 'memorize', icon: '🧠', label: '背诵', title: '公式背记 · 闪卡训练', to: '/memorize' },
  },
  // 电磁场例题
  {
    id: 'examples',
    segment: 'examples',
    layout: 'full',
    routes: [{ path: '/examples', element: <ExamplesPage /> }],
    header: { segment: 'examples', icon: '📝', label: '例题', title: '电磁场例题 · 期末考点全覆盖', to: '/examples' },
  },
  // 大纲页（侧栏布局，兜底动态路由，须在静态路由之后）
  {
    id: 'outline',
    segment: '',
    layout: 'sidebar',
    routes: [{ path: '/:subjectId/:chapterId', element: <OutlinePage /> }],
  },
];

/** 全宽页路径首段集合（App.tsx 布局判断用） */
export const FULL_WIDTH_SEGMENTS = new Set(
  APP_PAGES.filter((p) => p.layout === 'full').map((p) => p.segment),
);

/** 顶栏入口列表（Header.tsx 渲染用） */
export const HEADER_ENTRIES: HeaderEntry[] = APP_PAGES.flatMap((p) =>
  p.header ? [p.header] : [],
);

/** 全部路由定义（routes.tsx 生成 <Route> 用，顺序保证大纲兜底在最后） */
export const ALL_ROUTES: RouteDef[] = APP_PAGES.flatMap((p) => p.routes);

/* ==========================================================================
 * routes.tsx — HashRouter 路由表（由 app-pages 注册表驱动）
 *
 * 路由声明集中在 data/app-pages.tsx；本文件只负责渲染 <Route> 与兜底跳转。
 * react-router v6 按特异性匹配：静态段（/fields、/memorize、/examples）先于
 * 动态段 /:subjectId/:chapterId 命中，故大纲兜底路由须在 ALL_ROUTES 末尾。
 * ========================================================================== */
import { Routes, Route, Navigate } from 'react-router-dom';
import { ALL_ROUTES } from './data/app-pages';
import { DEFAULT_ROUTE } from './data/syllabus';

const defaultHref = `/${DEFAULT_ROUTE.subjectId}/${DEFAULT_ROUTE.chapterId}`;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultHref} replace />} />
      {ALL_ROUTES.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
      <Route path="*" element={<Navigate to={defaultHref} replace />} />
    </Routes>
  );
}

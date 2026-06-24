/* ==========================================================================
 * routes.tsx — HashRouter 路由表
 * - "/"                 → 默认路由（数电 01）
 * - "/fields"[/:catId]  → 电磁场公式手册
 * - "/modian-formulas"[/:catId] → 模电公式手册
 * - "/:subjectId/:chapterId"    → 大纲（数电/模电 章节）
 * - "*"                 → 兜底回默认
 *
 * 公式路由为静态前缀，react-router v6 按特异性优先匹配，故 /fields 先于
 * /:subjectId/:chapterId 命中。大纲路由对非法 subjectId 会回退（OutlinePage 内校验）。
 * ========================================================================== */
import { Routes, Route, Navigate } from 'react-router-dom';
import { OutlinePage } from './pages/OutlinePage';
import { FormulaPage } from './pages/FormulaPage';
import { FORMULA_VIEWS } from './data/formula-registry';
import { DEFAULT_ROUTE } from './data/syllabus';

const defaultHref = `/${DEFAULT_ROUTE.subjectId}/${DEFAULT_ROUTE.chapterId}`;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultHref} replace />} />

      {/* 公式页（静态前缀，优先于下方动态大纲路由） */}
      {FORMULA_VIEWS.map((v) => (
        <Route
          key={v.id}
          path={`/${v.routeName}`}
          element={<FormulaPage routeName={v.routeName} />}
        />
      ))}
      {FORMULA_VIEWS.map((v) => (
        <Route
          key={`${v.id}-cat`}
          path={`/${v.routeName}/:catId`}
          element={<FormulaPage routeName={v.routeName} />}
        />
      ))}

      {/* 大纲页 */}
      <Route path="/:subjectId/:chapterId" element={<OutlinePage />} />

      {/* 兜底 → 默认 */}
      <Route path="*" element={<Navigate to={defaultHref} replace />} />
    </Routes>
  );
}

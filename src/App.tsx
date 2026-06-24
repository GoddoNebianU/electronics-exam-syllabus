/* ==========================================================================
 * App.tsx — 应用根：HashRouter + 布局壳
 * 布局：顶栏（共享）+ [大纲页：侧边栏 + 主区] / [公式页：全宽主区]
 * 主题色由路由驱动（data-subject）。公式页不渲染侧边栏/汉堡/遮罩，
 * 从根本上避免原版"汉堡触发大纲遮罩盖住公式页"的移动端 bug。
 * ========================================================================== */
import { HashRouter, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AppRoutes } from './routes';
import { FORMULA_VIEWS } from './data/formula-registry';

/** 判断是否公式页路由 */
function isFormulaRoute(pathname: string): boolean {
  const seg = pathname.replace(/^\/+/, '').split('/')[0];
  return FORMULA_VIEWS.some((v) => v.routeName === seg);
}

function AppLayout() {
  const location = useLocation();
  const formula = isFormulaRoute(location.pathname);

  return (
    <div className={`app ${formula ? 'app--formula' : ''}`}>
      <Header />
      {!formula && <Sidebar />}
      <main className="main">
        <AppRoutes />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}

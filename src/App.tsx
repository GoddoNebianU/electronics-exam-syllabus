/* ==========================================================================
 * App.tsx — 应用根：HashRouter + 布局壳
 * 布局由 app-pages 注册表驱动：全宽页（公式手册 / 背记 / 例题）只渲染顶栏 +
 * 主区；大纲页额外渲染侧边栏。全宽页不渲染侧边栏/汉堡/遮罩，从根本上避免
 * 原版"汉堡触发大纲遮罩盖住公式页"的移动端 bug。主题色由路由驱动（data-subject）。
 * ========================================================================== */
import { HashRouter, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AppRoutes } from './routes';
import { FULL_WIDTH_SEGMENTS } from './data/app-pages';

function AppLayout() {
  const { pathname } = useLocation();
  const seg = pathname.replace(/^\/+/, '').split('/')[0];
  const fullWidth = FULL_WIDTH_SEGMENTS.has(seg);

  return (
    <div className={`app ${fullWidth ? 'app--full' : ''}`}>
      <Header />
      {!fullWidth && <Sidebar />}
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

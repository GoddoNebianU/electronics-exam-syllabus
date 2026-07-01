import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';
import { useThemeStore } from './store/useThemeStore';
import { useProgressStore } from './store/useProgressStore';
import { useFavoriteStore } from './store/useFavoriteStore';
import { useMemorizeStore } from './store/useMemorizeStore';

// 注册 Service Worker（autoUpdate：新版本自动 skipWaiting 激活）
// dev 模式下 vite-plugin-pwa devOptions.enabled=false，此处为空操作。
registerSW({ immediate: true });

function Root() {
  const initTheme = useThemeStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const initFavorite = useFavoriteStore((s) => s.init);
  const initMemorize = useMemorizeStore((s) => s.init);

  useEffect(() => {
    initTheme();
    initProgress();
    initFavorite();
    initMemorize();
  }, [initTheme, initProgress, initFavorite, initMemorize]);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

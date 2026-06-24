import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { useThemeStore } from './store/useThemeStore';
import { useProgressStore } from './store/useProgressStore';
import { useFavoriteStore } from './store/useFavoriteStore';

function Root() {
  // 初始化各持久化 store（主题、进度、收藏）
  const initTheme = useThemeStore((s) => s.init);
  const initProgress = useProgressStore((s) => s.init);
  const initFavorite = useFavoriteStore((s) => s.init);

  useEffect(() => {
    initTheme();
    initProgress();
    initFavorite();
  }, [initTheme, initProgress, initFavorite]);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

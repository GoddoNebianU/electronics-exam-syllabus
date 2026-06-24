/* ==========================================================================
 * ThemeToggle.tsx — 亮暗主题切换按钮
 * ========================================================================== */
import { useThemeStore } from '../store/useThemeStore';

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="icon-btn"
      title={isDark ? '切换到亮色' : '切换到暗色'}
      aria-label={isDark ? '切换到亮色主题' : '切换到暗色主题'}
      onClick={toggle}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}

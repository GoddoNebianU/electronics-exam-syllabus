/* ==========================================================================
 * useThemeStore.ts — 亮/暗主题状态
 * - 优先读 localStorage；无记忆时跟随系统 prefers-color-scheme；
 * - 切换后写回 localStorage，并同步 <html data-theme> + color-scheme；
 * - 无记忆时监听系统偏好变化。
 * 迁移自 legacy/js/theme.js。
 * ========================================================================== */
import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ezt-theme';
const MQ = '(prefers-color-scheme: dark)';

function systemPref(): Theme {
  return window.matchMedia(MQ).matches ? 'dark' : 'light';
}

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function applyToDom(theme: Theme): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.setProperty('color-scheme', theme);
}

interface ThemeState {
  theme: Theme;
  /** 是否来自用户记忆（false 表示跟随系统） */
  remembered: boolean;
  /** 初始化：应用已存主题，否则跟随系统；并监听系统变化（仅当无记忆时） */
  init: () => void;
  /** 切换并持久化 */
  toggle: () => void;
  /** 直接设置（持久化） */
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  remembered: false,

  init: () => {
    const stored = storedTheme();
    const initial = stored ?? systemPref();
    applyToDom(initial);
    set({ theme: initial, remembered: stored !== null });

    // 监听系统偏好变化：仅当用户未记忆时跟随
    window.matchMedia(MQ).addEventListener('change', (e) => {
      if (storedTheme() === null) {
        const next = e.matches ? 'dark' : 'light';
        applyToDom(next);
        set({ theme: next, remembered: false });
      }
    });
  },

  toggle: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyToDom(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage 不可用时静默降级 */
    }
    set({ theme: next, remembered: true });
  },

  setTheme: (t) => {
    applyToDom(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* noop */
    }
    set({ theme: t, remembered: true });
  },
}));

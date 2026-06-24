/* ==========================================================================
 * theme.js — 亮/暗主题切换
 * - 优先读 localStorage；
 * - 无记忆时跟随系统 prefers-color-scheme；
 * - 切换后写回 localStorage，并广播变化。
 * ========================================================================== */

const STORAGE_KEY = 'ezt-theme';
const ROOT = document.documentElement;
const MQ = '(prefers-color-scheme: dark)';

/** 系统当前偏好 */
function systemPref() {
  return window.matchMedia(MQ).matches ? 'dark' : 'light';
}

/** 已存储的主题（可能为 null = 未记忆） */
function storedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** 当前生效主题 */
export function currentTheme() {
  return ROOT.getAttribute('data-theme') || systemPref();
}

/** 应用主题到 <html data-theme> */
export function applyTheme(theme) {
  ROOT.setAttribute('data-theme', theme);
  // 同步切换 color-scheme，让表单控件/滚动条跟随
  ROOT.style.setProperty('color-scheme', theme);
  emit(theme);
  return theme;
}

/** 切换并持久化 */
export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* localStorage 不可用时静默降级 */
  }
  return next;
}

const listeners = new Set();
export function onThemeChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function emit(theme) {
  listeners.forEach((cb) => cb(theme));
}

/** 初始化：应用已存主题，否则跟随系统；并监听系统变化（仅当无记忆时） */
export function initTheme() {
  const stored = storedTheme();
  applyTheme(stored || systemPref());
  window.matchMedia(MQ).addEventListener('change', (e) => {
    if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light');
  });
}

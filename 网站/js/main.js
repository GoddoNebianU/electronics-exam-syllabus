/* ==========================================================================
 * main.js — 入口编排模块（仅做初始化与模块互连，不含业务实现）
 * 加载方式：<script type="module" src="js/main.js">
 *
 * 公式页采用数据驱动的可注册视图：所有公式视图在 formula-views.js 注册，
 * 本文件对 formulaViews 数组统一派发，无任何 per-视图硬编码。
 * ========================================================================== */

import { getChapter, getSubject, DEFAULT_ROUTE } from './config.js';
import * as router from './router.js';
import * as theme from './theme.js';
import * as progress from './progress.js';
import { initSidebar, syncToRoute, renderProgress } from './sidebar.js';
import { initSearch } from './search.js';
import { renderChapter } from './content.js';
import { formulaViews } from './formula-views.js';

const themeToggle = document.getElementById('theme-toggle');
let currentRoute = null;

/* ---- 主题切换按钮 ---- */
function updateThemeIcon() {
  const isDark = theme.currentTheme() === 'dark';
  themeToggle.textContent = isDark ? '☀' : '☾';
  themeToggle.setAttribute('title', isDark ? '切换到亮色' : '切换到暗色');
  themeToggle.setAttribute('aria-label', isDark ? '切换到亮色主题' : '切换到暗色主题');
}
themeToggle.addEventListener('click', () => {
  theme.toggleTheme();
});
theme.onThemeChange(updateThemeIcon);

/* ---- 路由处理：公式视图统一派发 + 大纲回退 ---- */
function handleRoute(route) {
  // 命中任一公式视图（#/fields, #/modian-formulas, …）
  for (const v of formulaViews) {
    const cat = v.match(location.hash);
    if (cat !== null) {
      // 互斥：退出其他所有公式视图（各自恢复大纲布局标记 + 关弹窗）
      formulaViews.forEach((x) => { if (x !== v) x.deactivate(); });
      v.ensureMounted();
      if (v.isActive()) {
        // 已在该视图，仅滚动到目标分类（保留筛选状态）
        const sec = cat && document.getElementById(`cat-${cat}`);
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        v.activate(cat);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      currentRoute = null;
      return;
    }
  }

  // 无公式视图匹配 → 退出所有公式视图，走大纲
  formulaViews.forEach((v) => v.deactivate());

  currentRoute = route;
  let pair = getChapter(route.subjectId, route.chapterId);
  if (!pair) {
    // 无效路由：回退到默认（科目或章节不存在）
    pair = getChapter(DEFAULT_ROUTE.subjectId, DEFAULT_ROUTE.chapterId);
    router.navigate(DEFAULT_ROUTE.subjectId, DEFAULT_ROUTE.chapterId);
    return; // navigate 会再次触发 hashchange → handleRoute
  }
  syncToRoute(route);
  renderChapter(pair);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ---- 复习进度变化 → 刷新进度条 + 章节勾选 ---- */
progress.onProgressChange(() => {
  renderProgress();
  if (currentRoute) syncToRoute(currentRoute);
});

/* ---- 欢迎页卡片：跳转到某科目首章 ---- */
window.addEventListener('ezt:goto-subject', (e) => {
  const subj = getSubject(e.detail);
  if (subj && subj.chapters.length) {
    router.navigate(subj.id, subj.chapters[0].id);
  }
});

/* ---- 启动 ---- */
function boot() {
  theme.initTheme();
  document.documentElement.setAttribute('data-subject', DEFAULT_ROUTE.subjectId);
  updateThemeIcon();

  initSidebar();
  initSearch();
  renderProgress();

  // 预挂载所有公式视图的 root + 入口按钮（按注册顺序并排于搜索框前，避免首访顺序导致错位）
  formulaViews.forEach((v) => v.ensureMounted());

  router.onRoute(handleRoute);

  // 若首屏无 hash，跳到默认路由（触发 handleRoute）
  if (!location.hash) {
    router.navigate(DEFAULT_ROUTE.subjectId, DEFAULT_ROUTE.chapterId);
  } else {
    handleRoute(router.getRoute());
  }
}

// DOM 已就绪（module 脚本默认 defer，可直接执行）
boot();

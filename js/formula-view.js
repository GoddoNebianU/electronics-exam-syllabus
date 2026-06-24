/* ==========================================================================
 * formula-view.js — 公式视图工厂（数据驱动、可注册）
 *
 * 把"公式页"抽象成配置驱动的视图对象。新增一个公式科目只需在 formula-views.js
 * 里加一个 createFormulaView({...}) 调用 —— main.js / index.html 零改动。
 *
 * 视图对象 { id, match, activate, deactivate, ensureMounted, isActive }：
 *   - match(hash)        匹配 routeBase[/<cat>]，返回 catId 或 null
 *   - ensureMounted()    幂等：动态创建自己的 root 容器 + 顶栏入口按钮
 *   - activate(catId)    进入视图（切布局/主题/隐藏大纲 + 渲染整页）
 *   - deactivate()       退出视图（隐藏自己 root + 清理 + 关弹窗）
 *
 * 复用 formula-core 的 createPopover + mountFormulaPage；不重写任何渲染算法。
 * 全部 DOM 访问都有 typeof document 守卫，无 DOM 环境（node）下安全。
 * ========================================================================== */

import { createPopover, mountFormulaPage } from './formula-core.js';

/** 转义 regex 特字符，用于把 routeBase 编译成锚点匹配正则。 */
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 创建一个公式视图。
 * @param {Object} cfg
 * @param {string} cfg.id               唯一标识（'fields' | 'modian-formula' | …）
 * @param {string} cfg.routeBase        hash 前缀（'#/fields'）
 * @param {{categories:Array, formulas:Array, symbols:Object}} cfg.data
 * @param {string} cfg.title            工具栏主标题
 * @param {string} cfg.subtitle         工具栏副标题
 * @param {string} cfg.subject          data-subject 主题（'fields' | 'modian'）
 * @param {string} cfg.appClass         .app 上的全屏布局类（'app--fields'）
 * @param {string} cfg.backHref         返回大纲的 hash
 * @param {{icon:string,label:string,title:string}} cfg.entry  顶栏入口按钮
 */
export function createFormulaView(cfg) {
  const {
    id, routeBase,
    data: { categories, formulas, symbols },
    title, subtitle, subject, appClass, backHref,
    entry: { icon, label, title: entryTitle } = {},
  } = cfg;

  // 每视图独立弹窗（独立 kidToToken 由 core 按字典缓存隔离）
  const popover = createPopover(symbols);

  const rootId = `formula-root-${id}`;
  const entryId = `formula-entry-${id}`;
  const baseRe = new RegExp('^' + escapeRe(routeBase) + '(?:/([a-z0-9-]+))?$', 'i');

  let active = false;
  let mounted = false;

  /** 匹配 hash，命中返回分类 id（或空串），否则 null。纯字符串，无 DOM。 */
  function match(hash) {
    const m = (hash || '').match(baseRe);
    return m ? (m[1] || '') : null;
  }

  /** 幂等：动态创建本视图的 root 容器 + 顶栏入口按钮（复用现有 class）。 */
  function ensureMounted() {
    if (typeof document === 'undefined' || mounted) return;
    mounted = true;

    // root 容器 → 挂到 .main 末尾（默认 hidden）
    const mainEl = document.querySelector('.main');
    if (mainEl && !document.getElementById(rootId)) {
      const root = document.createElement('div');
      root.className = 'fields-root';
      root.id = rootId;
      root.hidden = true;
      mainEl.appendChild(root);
    }

    // 入口按钮 → 插到 .header__tools 里 #search 之前（保持注册顺序并排于搜索框前）
    const tools = document.querySelector('.header__tools');
    if (tools && !document.getElementById(entryId)) {
      const a = document.createElement('a');
      a.className = 'header__fields-btn';
      a.id = entryId;
      a.href = routeBase;
      a.title = entryTitle || label || '';
      a.innerHTML =
        `<span class="header__fields-icon" aria-hidden="true">${icon || ''}</span>` +
        `<span class="header__fields-text">${label || ''}</span>`;
      const anchor = document.getElementById('search') || tools.firstChild;
      tools.insertBefore(a, anchor);
    }
  }

  /** 进入视图：切布局/主题、隐藏大纲、渲染整页。 */
  function activate(catId) {
    if (typeof document === 'undefined') return;
    ensureMounted();

    const app = document.querySelector('.app');
    if (app) app.classList.add(appClass);
    document.documentElement.setAttribute('data-subject', subject);
    const crumb = document.querySelector('.breadcrumb');
    if (crumb) crumb.hidden = true;
    const content = document.getElementById('content');
    if (content) content.hidden = true;

    const root = document.getElementById(rootId);
    mountFormulaPage({
      rootEl: root, categories, formulas, symbols,
      title, subtitle, routeBase, backHref, catId, popover,
    });

    const entryEl = document.getElementById(entryId);
    if (entryEl) entryEl.classList.add('is-active');
    active = true;
  }

  /** 退出视图：移除布局类、隐藏自己 root、清内容、关弹窗。 */
  function deactivate() {
    if (typeof document === 'undefined') return;
    const app = document.querySelector('.app');
    if (app) app.classList.remove(appClass);
    const root = document.getElementById(rootId);
    if (root) { root.hidden = true; root.innerHTML = ''; }
    const crumb = document.querySelector('.breadcrumb');
    if (crumb) crumb.hidden = false;
    const content = document.getElementById('content');
    if (content) content.hidden = false;
    const entryEl = document.getElementById(entryId);
    if (entryEl) entryEl.classList.remove('is-active');
    popover.close();
    active = false;
  }

  function isActive() { return active; }

  return { id, match, activate, deactivate, ensureMounted, isActive };
}

/* ==========================================================================
 * sidebar.js — 侧边栏渲染
 * 职责：科目 Tab 切换 + 章节树（徽标/星标/已复习勾）+ 进度条 + 移动端抽屉。
 * 不直接操作路由，通过回调上抛意图，由 main 编排。
 * ========================================================================== */

import { SYLLABUS, TOPIC_TYPES, TOTAL_CHAPTERS } from './config.js';
import * as router from './router.js';
import * as progress from './progress.js';

const tabsEl = document.getElementById('tabs');
const subjectLabelEl = document.getElementById('subject-label');
const listEl = document.getElementById('chapter-list');
const progressCountEl = document.getElementById('progress-count');
const progressFillEl = document.getElementById('progress-fill');
const sidebarEl = document.getElementById('sidebar');
const overlayEl = document.getElementById('sidebar-overlay');
const menuBtn = document.getElementById('menu-btn');

let activeSubject = SYLLABUS[0].id;

/* ---- HTML 片段 ---- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function starsHtml(n) {
  return `<span class="chapter__stars">${'★'.repeat(n)}<span class="dim">${'★'.repeat(3 - n)}</span></span>`;
}

function badgesHtml(topics) {
  return topics.map((t) => {
    const meta = TOPIC_TYPES[t.key] || { label: t.key, type: 'fill' };
    return `<span class="badge" data-type="${meta.type}">${meta.label} ${esc(t.range)}</span>`;
  }).join('');
}

/** 渲染顶部科目 Tab */
function renderTabs() {
  tabsEl.innerHTML = SYLLABUS.map((s) => `
    <button class="tab" data-subject="${s.id}" data-active="${s.id === activeSubject}">
      ${esc(s.short)}
      <span class="tab__count">${s.chapters.length}</span>
    </button>`).join('');
  tabsEl.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => switchSubject(btn.getAttribute('data-subject')));
  });
}

/** 渲染章节列表 */
function renderList(activeChapterId) {
  const subject = SYLLABUS.find((s) => s.id === activeSubject);
  subjectLabelEl.textContent = `${subject.name} · ${subject.short}`;
  listEl.innerHTML = subject.chapters.map((c) => {
    const reviewed = progress.isReviewed(subject.id, c.id);
    const active = c.id === activeChapterId;
    return `
      <a class="chapter"
         href="${router.toHash(subject.id, c.id)}"
         data-subject="${subject.id}"
         data-chapter="${c.id}"
         data-active="${active}"
         data-reviewed="${reviewed}">
        <span class="chapter__num">${esc(c.id)}</span>
        <span class="chapter__body">
          <span class="chapter__title">${esc(c.title)}</span>
          <span class="chapter__meta">
            ${starsHtml(c.importance)}
            ${badgesHtml(c.topics)}
          </span>
        </span>
      </a>`;
  }).join('');
}

/** 渲染进度条 */
export function renderProgress() {
  const done = progress.countReviewed();
  if (progressCountEl) {
    progressCountEl.innerHTML = `已复习 <em>${done}</em> / ${TOTAL_CHAPTERS}`;
  }
  if (progressFillEl) {
    progressFillEl.style.width = `${(done / TOTAL_CHAPTERS) * 100}%`;
  }
}

/** 切换科目（重渲染列表 + 通知主题色变化）*/
function switchSubject(subjectId) {
  if (!SYLLABUS.some((s) => s.id === subjectId)) return;
  activeSubject = subjectId;
  // 切换根元素的科目主题色
  document.documentElement.setAttribute('data-subject', subjectId);
  renderTabs();
  // 列表先用 null 章节高亮渲染（切科目时不预选）
  renderList(null);
}

/**
 * 根据当前路由刷新侧边栏高亮（不重建整列，避免抖动）
 * 若路由科目与当前不同，则整体切换。
 */
export function syncToRoute(route) {
  if (route.subjectId !== activeSubject) {
    activeSubject = route.subjectId;
    document.documentElement.setAttribute('data-subject', route.subjectId);
    renderTabs();
  }
  renderList(route.chapterId);
  closeOnMobile();
}

/** 移动端打开 / 关闭抽屉 */
export function openMobile() {
  sidebarEl.classList.add('is-open');
  overlayEl.classList.add('is-visible');
}
export function closeOnMobile() {
  sidebarEl.classList.remove('is-open');
  overlayEl.classList.remove('is-visible');
}

/** 初始化侧边栏（仅渲染结构，不主动跳转）*/
export function initSidebar() {
  renderTabs();
  renderList(null);
  renderProgress();
  document.documentElement.setAttribute('data-subject', activeSubject);

  // 汉堡按钮 / 遮罩
  menuBtn.addEventListener('click', openMobile);
  overlayEl.addEventListener('click', closeOnMobile);
  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOnMobile();
  });
}

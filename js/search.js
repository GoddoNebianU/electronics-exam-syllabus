/* ==========================================================================
 * search.js — 全文搜索
 * 首次搜索时惰性 fetch 全部 md 到内存建索引；
 * 输入防抖；结果按科目分组；命中片段高亮并支持点击跳转。
 * ========================================================================== */

import { flattenChapters, SYLLABUS } from './config.js';
import * as router from './router.js';

const inputEl = document.getElementById('search-input');
const clearEl = document.getElementById('search-clear');
const boxEl = document.getElementById('search');
const resultsEl = document.getElementById('search-results');

let index = null;          // [{ subject, chapter, text }] | null
let building = null;       // 进行中的建索引 Promise（防重入）
let debounceTimer = null;

/* ---- 纯文本化（去掉 md 标记，便于 includes 匹配）---- */
function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')   // 代码块
    .replace(/`([^`]+)`/g, '$1')       // 行内代码保留内容
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[#>\-*|+\s]+/gm, '')     // 行首标记符
    .replace(/[*_~]/g, '')
    .replace(/\n{2,}/g, '\n');
}

/** 建立内存索引（仅执行一次） */
async function buildIndex() {
  if (index) return index;
  if (building) return building;
  building = (async () => {
    const items = flattenChapters();
    const entries = await Promise.all(
      items.map(async ({ subject, chapter }) => {
        let text = '';
        try {
          const res = await fetch(chapter.file);
          if (res.ok) text = await res.text();
        } catch { /* 单章失败不阻塞其余 */ }
        return { subject, chapter, text, plain: stripMarkdown(text) };
      })
    );
    index = entries;
    building = null;
    return index;
  })();
  return building;
}

/** 转义正则特殊字符 */
function regEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 在 plain 文本中找命中片段（前后各取若干字符） */
function snippet(plain, query, len = 60) {
  const lower = plain.toLowerCase();
  const at = lower.indexOf(query.toLowerCase());
  if (at < 0) return '';
  const start = Math.max(0, at - len);
  const end = Math.min(plain.length, at + query.length + len);
  let s = plain.slice(start, end).replace(/\n/g, ' ').trim();
  if (start > 0) s = '…' + s;
  if (end < plain.length) s = s + '…';
  return s;
}

/** 给文本中的关键词加 <mark> */
function highlight(text, query) {
  if (!text) return '';
  const re = new RegExp(`(${regEscape(query)})`, 'gi');
  return text.replace(re, '<mark>$1</mark>')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/&lt;mark&gt;/g, '<mark>').replace(/&lt;\/mark&gt;/g, '</mark>');
}

/* ---- 执行搜索 ---- */
async function runSearch(rawQuery) {
  const query = rawQuery.trim();
  if (!query) { closeResults(); return; }

  resultsEl.innerHTML = `<div class="search__empty">正在建立索引…</div>`;
  openResults();

  const idx = await buildIndex();

  const q = query.toLowerCase();
  const hits = [];
  for (const entry of idx) {
    const inTitle = entry.chapter.title.toLowerCase().includes(q);
    const at = entry.plain.toLowerCase().indexOf(q);
    if (inTitle || at >= 0) {
      hits.push({ ...entry, inTitle, snippet: snippet(entry.plain, query) });
    }
  }

  if (!hits.length) {
    resultsEl.innerHTML = `<div class="search__empty">未找到包含「${escapeHtml(query)}」的章节</div>`;
    return;
  }

  // 按科目分组
  const html = SYLLABUS.map((subj) => {
    const group = hits.filter((h) => h.subject.id === subj.id);
    if (!group.length) return '';
    return `
      <div class="search__group-label">${escapeHtml(subj.name)}（${group.length}）</div>
      ${group.map((h) => `
        <a class="search__item" href="${router.toHash(h.subject.id, h.chapter.id)}">
          <div class="search__item-title">${highlight(h.chapter.title, query)}</div>
          ${h.snippet ? `<div class="search__item-preview">${highlight(h.snippet, query)}</div>` : ''}
        </a>`).join('')}`;
  }).join('');

  resultsEl.innerHTML = html;
  // 点击后关闭浮层
  resultsEl.querySelectorAll('.search__item').forEach((a) => {
    a.addEventListener('click', closeResults);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function openResults() { resultsEl.classList.add('is-open'); }
function closeResults() { resultsEl.classList.remove('is-open'); }

/* ---- 绑定事件 ---- */
export function initSearch() {
  inputEl.addEventListener('input', () => {
    boxEl.classList.toggle('is-active', inputEl.value.length > 0);
    clearTimeout(debounceTimer);
    const v = inputEl.value;
    if (!v) { closeResults(); return; }
    debounceTimer = setTimeout(() => runSearch(v), 200);
  });

  inputEl.addEventListener('focus', () => {
    if (inputEl.value.trim()) runSearch(inputEl.value);
  });

  clearEl.addEventListener('click', () => {
    inputEl.value = '';
    boxEl.classList.remove('is-active');
    closeResults();
    inputEl.focus();
  });

  // 点击外部关闭
  document.addEventListener('click', (e) => {
    if (!boxEl.contains(e.target)) closeResults();
  });

  // "/" 快捷键聚焦搜索
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== inputEl) {
      e.preventDefault();
      inputEl.focus();
    }
    if (e.key === 'Escape' && document.activeElement === inputEl) {
      inputEl.blur();
      closeResults();
    }
  });
}

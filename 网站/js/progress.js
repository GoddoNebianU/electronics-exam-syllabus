/* ==========================================================================
 * progress.js — 复习进度标记
 * 数据以 { "shudian/01": timestamp } 存于 localStorage。
 * 提供查询 / 切换 / 计数 / 订阅变更。
 * ========================================================================== */

import { flattenChapters, TOTAL_CHAPTERS } from './config.js';

const STORAGE_KEY = 'ezt-reviewed';
const listeners = new Set();

/** 读取完整进度 map（带容错） */
function readMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** 写回完整 map */
function writeMap(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* 静默降级 */
  }
}

/** 统一 key */
function key(subjectId, chapterId) {
  return `${subjectId}/${chapterId}`;
}

/** 某章是否已标记复习 */
export function isReviewed(subjectId, chapterId) {
  return Boolean(readMap()[key(subjectId, chapterId)]);
}

/** 设置某章复习状态 */
export function setReviewed(subjectId, chapterId, reviewed) {
  const map = readMap();
  const k = key(subjectId, chapterId);
  if (reviewed) {
    map[k] = Date.now();
  } else {
    delete map[k];
  }
  writeMap(map);
  emit();
}

/** 切换某章复习状态，返回切换后状态 */
export function toggleReviewed(subjectId, chapterId) {
  const next = !isReviewed(subjectId, chapterId);
  setReviewed(subjectId, chapterId, next);
  return next;
}

/** 已复习章节数 */
export function countReviewed() {
  const map = readMap();
  return flattenChapters().filter(({ subject, chapter }) => map[key(subject.id, chapter.id)]).length;
}

/** 总章节数 */
export function total() {
  return TOTAL_CHAPTERS;
}

/** 完成百分比 0~100 */
export function percent() {
  return Math.round((countReviewed() / TOTAL_CHAPTERS) * 100);
}

/** 订阅进度变化 */
export function onProgressChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function emit() {
  const done = countReviewed();
  listeners.forEach((cb) => cb(done, TOTAL_CHAPTERS));
}

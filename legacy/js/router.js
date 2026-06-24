/* ==========================================================================
 * router.js — 极简 hash 路由
 * 格式：#/shudian/01   /   #/modian/10
 * 刷新可定位、可分享；无第三方依赖。
 * ========================================================================== */

import { DEFAULT_ROUTE } from './config.js';

const listeners = new Set();

/** 解析 location.hash → { subjectId, chapterId } | null */
function parse(hash) {
  const m = (hash || '').match(/^#\/([a-z]+)\/([0-9]+)/i);
  if (!m) return null;
  return { subjectId: m[1].toLowerCase(), chapterId: m[2] };
}

/** 读取当前路由（无效则回落到默认） */
export function getRoute() {
  return parse(location.hash) || { ...DEFAULT_ROUTE };
}

/** 编码为 hash 字符串 */
export function toHash(subjectId, chapterId) {
  return `#/${subjectId}/${chapterId}`;
}

/** 跳转（仅改 hash，触发 hashchange） */
export function navigate(subjectId, chapterId) {
  const hash = toHash(subjectId, chapterId);
  if (location.hash === hash) {
    // 同地址也要强制刷新（如点击已激活章节）
    dispatch();
  } else {
    location.hash = hash;
  }
}

/** 订阅路由变化，返回取消函数 */
export function onRoute(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** 手动派发一次（供同地址跳转） */
function dispatch() {
  const route = getRoute();
  listeners.forEach((cb) => cb(route));
}

window.addEventListener('hashchange', dispatch);
window.addEventListener('DOMContentLoaded', dispatch);

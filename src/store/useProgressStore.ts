/* ==========================================================================
 * useProgressStore.ts — 复习进度标记
 * 数据以 { "shudian/01": timestamp } 存于 localStorage。
 * 迁移自 legacy/js/progress.js。Zustand 订阅替代原先的 listeners。
 *
 * 预留扩展字段：perChapter 完成率统计（后续新功能）。
 * ========================================================================== */
import { create } from 'zustand';
import { TOTAL_CHAPTERS } from '../data/syllabus';

const STORAGE_KEY = 'ezt-reviewed';

/** 进度 map：`${subjectId}/${chapterId}` → 时间戳 */
type ProgressMap = Record<string, number>;

function readMap(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* 静默降级 */
  }
}

function key(subjectId: string, chapterId: string): string {
  return `${subjectId}/${chapterId}`;
}

interface ProgressState {
  /** 当前进度 map */
  map: ProgressMap;
  /** 初始化：从 localStorage 读取 */
  init: () => void;
  /** 某章是否已标记复习 */
  isReviewed: (subjectId: string, chapterId: string) => boolean;
  /** 设置某章复习状态 */
  setReviewed: (subjectId: string, chapterId: string, reviewed: boolean) => void;
  /** 切换某章复习状态，返回切换后状态 */
  toggleReviewed: (subjectId: string, chapterId: string) => boolean;
  /** 已复习章节数 */
  countReviewed: () => number;
  /** 总章节数 */
  total: () => number;
  /** 完成百分比 0~100 */
  percent: () => number;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  map: {},

  init: () => {
    set({ map: readMap() });
  },

  isReviewed: (subjectId, chapterId) =>
    Boolean(get().map[key(subjectId, chapterId)]),

  setReviewed: (subjectId, chapterId, reviewed) => {
    const map = { ...get().map };
    const k = key(subjectId, chapterId);
    if (reviewed) {
      map[k] = Date.now();
    } else {
      delete map[k];
    }
    writeMap(map);
    set({ map });
  },

  toggleReviewed: (subjectId, chapterId) => {
    const next = !get().isReviewed(subjectId, chapterId);
    get().setReviewed(subjectId, chapterId, next);
    return next;
  },

  countReviewed: () => Object.keys(get().map).length,

  total: () => TOTAL_CHAPTERS,

  percent: () =>
    Math.round((Object.keys(get().map).length / TOTAL_CHAPTERS) * 100),
}));

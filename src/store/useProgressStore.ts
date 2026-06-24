/* ==========================================================================
 * useProgressStore.ts — 复习进度标记
 * 数据以 { "shudian/01": timestamp } 存于 localStorage。
 * map 的 value 即 reviewedAt（标记复习的时间戳）。
 * 迁移自 legacy/js/progress.js。Zustand 订阅替代原先的 listeners。
 *
 * 统计接口（供 StatsPanel）：
 *   - perSubject(): 每科目已复习/总数
 *   - recent(n): 最近复习记录（按时间戳倒序）
 * ========================================================================== */
import { create } from 'zustand';
import { SYLLABUS, TOTAL_CHAPTERS } from '../data/syllabus';

const STORAGE_KEY = 'ezt-reviewed';

/** 进度 map：`${subjectId}/${chapterId}` → 时间戳(reviewedAt) */
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

export interface SubjectStat {
  subjectId: string;
  name: string;
  short: string;
  reviewed: number;
  total: number;
}

export interface RecentReview {
  subjectId: string;
  chapterId: string;
  at: number;
}

interface ProgressState {
  /** 当前进度 map */
  map: ProgressMap;
  /** 初始化：从 localStorage 读取 */
  init: () => void;
  /** 某章是否已标记复习 */
  isReviewed: (subjectId: string, chapterId: string) => boolean;
  /** 取某章复习时间戳（无则 0） */
  reviewedAt: (subjectId: string, chapterId: string) => number;
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
  /** 各科目复习统计（按大纲顺序） */
  perSubject: () => SubjectStat[];
  /** 最近复习记录（按时间倒序，默认 8 条） */
  recent: (n?: number) => RecentReview[];
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  map: {},

  init: () => {
    set({ map: readMap() });
  },

  isReviewed: (subjectId, chapterId) =>
    Boolean(get().map[key(subjectId, chapterId)]),

  reviewedAt: (subjectId, chapterId) =>
    get().map[key(subjectId, chapterId)] ?? 0,

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

  perSubject: () =>
    SYLLABUS.map((s) => {
      const reviewed = s.chapters.filter((c) =>
        Boolean(get().map[key(s.id, c.id)]),
      ).length;
      return {
        subjectId: s.id,
        name: s.name,
        short: s.short,
        reviewed,
        total: s.chapters.length,
      };
    }),

  recent: (n = 8) =>
    Object.entries(get().map)
      .map(([k, at]) => {
        const [subjectId, chapterId] = k.split('/');
        return { subjectId, chapterId, at };
      })
      .sort((a, b) => b.at - a.at)
      .slice(0, n),
}));

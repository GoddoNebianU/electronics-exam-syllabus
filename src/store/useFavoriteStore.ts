/* ==========================================================================
 * useFavoriteStore.ts — 收藏夹
 *
 * 收藏两类对象：
 *   - 章节：键 `chapter:${subjectId}/${chapterId}`
 *   - 公式：键 `formula:${viewId}/${formulaId}`
 * 存于 localStorage（key `ezt-favorites-v2`），值为 key→时间戳。
 *
 * Sidebar 渲染「收藏章节」快捷列表；公式页顶部「★ 收藏」筛选；FormulaCard
 * 右上角星标 toggle；ChapterList 章节项角标 toggle。
 * ========================================================================== */
import { create } from 'zustand';

const STORAGE_KEY = 'ezt-favorites-v2';

type FavoriteSet = Record<string, number>;

function readSet(): FavoriteSet {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteSet) : {};
  } catch {
    return {};
  }
}

function writeSet(set: FavoriteSet): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(set));
  } catch {
    /* noop */
  }
}

export function chapterFavKey(subjectId: string, chapterId: string): string {
  return `chapter:${subjectId}/${chapterId}`;
}

export function formulaFavKey(viewId: string, formulaId: string): string {
  return `formula:${viewId}/${formulaId}`;
}

/** 解析章节收藏 key → { subjectId, chapterId }；非章节 key 返回 null */
export function parseChapterKey(
  key: string,
): { subjectId: string; chapterId: string } | null {
  const m = /^chapter:([^/]+)\/(.+)$/.exec(key);
  return m ? { subjectId: m[1], chapterId: m[2] } : null;
}

/** 解析公式收藏 key → { viewId, formulaId }；非公式 key 返回 null */
export function parseFormulaKey(
  key: string,
): { viewId: string; formulaId: string } | null {
  const m = /^formula:([^/]+)\/(.+)$/.exec(key);
  return m ? { viewId: m[1], formulaId: m[2] } : null;
}

interface FavoriteState {
  items: FavoriteSet;
  init: () => void;
  isFavorite: (key: string) => boolean;
  toggleFavorite: (key: string) => boolean;
  setFavorite: (key: string, fav: boolean) => void;
  /** 全部收藏 key 列表 */
  list: () => string[];
  /** 全部已收藏章节（按收藏时间倒序） */
  chapterList: () => Array<{ subjectId: string; chapterId: string; at: number }>;
  /** 全部已收藏公式（按收藏时间倒序） */
  formulaList: () => Array<{ viewId: string; formulaId: string; at: number }>;
  /** 收藏总数（订阅用） */
  count: number;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  items: {},
  count: 0,

  init: () => {
    const items = readSet();
    set({ items, count: Object.keys(items).length });
  },

  isFavorite: (key) => Boolean(get().items[key]),

  toggleFavorite: (key) => {
    const next = !get().isFavorite(key);
    get().setFavorite(key, next);
    return next;
  },

  setFavorite: (key, fav) => {
    const items = { ...get().items };
    if (fav) {
      items[key] = Date.now();
    } else {
      delete items[key];
    }
    writeSet(items);
    set({ items, count: Object.keys(items).length });
  },

  list: () => Object.keys(get().items),

  chapterList: () =>
    Object.entries(get().items)
      .map(([key, at]) => ({ ...parseChapterKey(key), at }))
      .filter((c): c is { subjectId: string; chapterId: string; at: number } =>
        Boolean(c.subjectId),
      )
      .sort((a, b) => b.at - a.at),

  formulaList: () =>
    Object.entries(get().items)
      .map(([key, at]) => ({ ...parseFormulaKey(key), at }))
      .filter((f): f is { viewId: string; formulaId: string; at: number } =>
        Boolean(f.viewId),
      )
      .sort((a, b) => b.at - a.at),
}));

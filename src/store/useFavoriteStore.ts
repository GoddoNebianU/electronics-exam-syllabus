/* ==========================================================================
 * useFavoriteStore.ts — 收藏夹（预留接口，本阶段仅建 store + localStorage）
 *
 * 收藏对象：章节（后续可扩展公式）。
 * 键约定：章节用 `chapter:${subjectId}/${chapterId}`；公式用 `formula:${viewId}/${formulaId}`。
 *
 * Sidebar 预留收藏区，但本阶段不强制渲染（有收藏时才显示）。
 * ========================================================================== */
import { create } from 'zustand';

const STORAGE_KEY = 'ezt-favorites';

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

interface FavoriteState {
  items: FavoriteSet;
  init: () => void;
  isFavorite: (key: string) => boolean;
  toggleFavorite: (key: string) => boolean;
  setFavorite: (key: string, fav: boolean) => void;
  /** 全部收藏 key 列表 */
  list: () => string[];
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  items: {},

  init: () => {
    set({ items: readSet() });
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
    set({ items });
  },

  list: () => Object.keys(get().items),
}));

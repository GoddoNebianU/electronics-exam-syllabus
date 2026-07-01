/* ==========================================================================
 * useMemorizeStore.ts — 背记进度（「已会」公式集）
 *
 * 背记页（MemorizePage）每张闪卡可标记「会了」，记录到 localStorage。
 * 键 `${viewId}/${formulaId}`（与收藏 store 同型，保证跨科目唯一）。
 * 存于 localStorage（key `ezt-memorize-v1`），值为 key→时间戳。
 * ==========================================================================
 */
import { create } from 'zustand';

const STORAGE_KEY = 'ezt-memorize-v1';

type KnownSet = Record<string, number>;

function readSet(): KnownSet {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as KnownSet) : {};
  } catch {
    return {};
  }
}

function writeSet(set: KnownSet): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(set));
  } catch {
    /* noop */
  }
}

export function memorizeKey(viewId: string, formulaId: string): string {
  return `${viewId}/${formulaId}`;
}

interface MemorizeState {
  known: KnownSet;
  count: number;
  init: () => void;
  isKnown: (key: string) => boolean;
  toggleKnown: (key: string) => boolean;
  setKnown: (key: string, known: boolean) => void;
  clearAll: () => void;
}

export const useMemorizeStore = create<MemorizeState>((set, get) => ({
  known: {},
  count: 0,

  init: () => {
    const known = readSet();
    set({ known, count: Object.keys(known).length });
  },

  isKnown: (key) => Boolean(get().known[key]),

  toggleKnown: (key) => {
    const next = !get().isKnown(key);
    get().setKnown(key, next);
    return next;
  },

  setKnown: (key, isKnown) => {
    const known = { ...get().known };
    if (isKnown) {
      known[key] = Date.now();
    } else {
      delete known[key];
    }
    writeSet(known);
    set({ known, count: Object.keys(known).length });
  },

  clearAll: () => {
    writeSet({});
    set({ known: {}, count: 0 });
  },
}));

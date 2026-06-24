/* ==========================================================================
 * useSyllabusStore.ts — 大纲 UI 状态（当前科目 + 移动端抽屉）
 * 路由状态由 react-router 管理，本 store 只管：
 *   - activeSubjectId：侧边栏当前展开的科目 tab（驱动 data-subject 主题色）
 *   - sidebarOpen：移动端抽屉开合
 * ========================================================================== */
import { create } from 'zustand';

interface SyllabusState {
  /** 当前科目 id（shudian | modian）；公式页可临时设为 fields/modian */
  activeSubjectId: string;
  /** 移动端抽屉开合 */
  sidebarOpen: boolean;
  setActiveSubject: (id: string) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useSyllabusStore = create<SyllabusState>((set) => ({
  activeSubjectId: 'shudian',
  sidebarOpen: false,
  setActiveSubject: (id) => set({ activeSubjectId: id }),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

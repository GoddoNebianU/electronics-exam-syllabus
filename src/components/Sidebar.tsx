/* ==========================================================================
 * Sidebar.tsx — 侧边栏（科目 Tab + 进度条 + 章节列表 + 移动端抽屉）
 * 迁移自 legacy/js/sidebar.js。
 * activeSubjectId 来自 store（由路由同步设置）；点击 Tab 切换科目并跳首章。
 * ========================================================================== */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SYLLABUS, getSubject } from '../data/syllabus';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { ChapterList } from './ChapterList';
import { ProgressTrack } from './ProgressTrack';

export function Sidebar() {
  const navigate = useNavigate();
  const activeSubjectId = useSyllabusStore((s) => s.activeSubjectId);
  const setActiveSubject = useSyllabusStore((s) => s.setActiveSubject);
  const sidebarOpen = useSyllabusStore((s) => s.sidebarOpen);
  const closeSidebar = useSyllabusStore((s) => s.closeSidebar);
  const favCount = useFavoriteStore((s) => Object.keys(s.items).length);

  const subject = getSubject(activeSubjectId);

  // ESC 关闭抽屉
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSidebar();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeSidebar]);

  const switchSubject = (id: string) => {
    if (!SYLLABUS.some((s) => s.id === id)) return;
    setActiveSubject(id);
    const subj = getSubject(id);
    // 切科目跳首章
    if (subj && subj.chapters.length) {
      navigate(`/${id}/${subj.chapters[0].id}`);
    }
  };

  return (
    <>
      <aside
        className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}
        aria-label="章节导航"
      >
        <div className="sidebar__progress">
          <ProgressTrack />
        </div>

        <div className="sidebar__tabs" role="tablist">
          {SYLLABUS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="tab"
              data-subject={s.id}
              data-active={s.id === activeSubjectId}
              onClick={() => switchSubject(s.id)}
            >
              {s.short}
              <span className="tab__count">{s.chapters.length}</span>
            </button>
          ))}
        </div>

        <div className="sidebar__subject-label">
          {subject ? `${subject.name} · ${subject.short}` : ''}
        </div>

        <nav className="sidebar__list" aria-label="章节列表">
          {subject && (
            <ChapterList
              subjectId={subject.id}
              chapters={subject.chapters}
              activeChapterId={null}
            />
          )}
        </nav>

        {/* 收藏区预留：有收藏时才显示 */}
        {favCount > 0 && (
          <div className="sidebar__favorites">
            <div className="sidebar__fav-label">收藏 · {favCount}</div>
          </div>
        )}
      </aside>

      {/* 移动端遮罩 */}
      <div
        className={`sidebar__overlay ${sidebarOpen ? 'is-visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
    </>
  );
}

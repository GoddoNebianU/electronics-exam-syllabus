/* ==========================================================================
 * Sidebar.tsx — 侧边栏（科目 Tab + 进度条 + 章节列表 + 收藏章节快捷列表 +
 *                移动端抽屉）
 * 迁移自 legacy/js/sidebar.js。
 * activeSubjectId 来自 store（由路由同步设置）；点击 Tab 切换科目并跳首章。
 * 统计入口在 Header（全局可见，含公式页），此处不重复。
 * ========================================================================== */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SYLLABUS, getSubject, getChapter } from '../data/syllabus';
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
  const favChapters = useFavoriteStore((s) => s.chapterList());

  const subject = getSubject(activeSubjectId);

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

        {favChapters.length > 0 && (
          <div className="sidebar__favorites">
            <div className="sidebar__fav-label">收藏章节 · {favChapters.length}</div>
            <ul className="sidebar__fav-list">
              {favChapters.map(({ subjectId, chapterId }) => {
                const pair = getChapter(subjectId, chapterId);
                if (!pair) return null;
                const subjShort = getSubject(subjectId)?.short ?? subjectId;
                return (
                  <li key={`${subjectId}/${chapterId}`}>
                    <Link
                      to={`/${subjectId}/${chapterId}`}
                      className="sidebar__fav-item"
                      data-subject={subjectId}
                      onClick={closeSidebar}
                      title={`${subjShort} · ${pair.chapter.title}`}
                    >
                      <span className="sidebar__fav-subject">{subjShort}</span>
                      <span className="sidebar__fav-title">
                        {pair.chapter.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>

      <div
        className={`sidebar__overlay ${sidebarOpen ? 'is-visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
    </>
  );
}

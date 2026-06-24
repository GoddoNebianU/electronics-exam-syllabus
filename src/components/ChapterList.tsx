/* ==========================================================================
 * ChapterList.tsx — 侧边栏章节列表
 * 渲染某科目的章节项（章号 + 标题 + 星标 + 题型徽标 + 已复习勾 +
 * 右侧小收藏星标 toggle）。
 * 迁移自 legacy/js/sidebar.js 的 renderList。
 * ========================================================================== */
import { Link } from 'react-router-dom';
import type { Chapter, TopicRef } from '../data/types';
import { TOPIC_TYPES } from '../data/syllabus';
import { useProgressStore } from '../store/useProgressStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import {
  useFavoriteStore,
  chapterFavKey,
} from '../store/useFavoriteStore';

function Stars({ n }: { n: number }) {
  return (
    <span className="chapter__stars">
      {'★'.repeat(n)}
      <span className="dim">{'★'.repeat(3 - n)}</span>
    </span>
  );
}

function Badges({ topics }: { topics: TopicRef[] }) {
  return (
    <>
      {topics.map((t, i) => {
        const meta = TOPIC_TYPES[t.key] ?? { label: t.key, type: 'fill' as const };
        return (
          <span key={i} className="badge" data-type={meta.type}>
            {meta.label} {t.range}
          </span>
        );
      })}
    </>
  );
}

interface ChapterListProps {
  subjectId: string;
  chapters: Chapter[];
  activeChapterId: string | null;
}

export function ChapterList({
  subjectId,
  chapters,
  activeChapterId,
}: ChapterListProps) {
  const map = useProgressStore((s) => s.map);
  const closeSidebar = useSyllabusStore((s) => s.closeSidebar);
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite);
  const favMap = useFavoriteStore((s) => s.items);

  return (
    <>
      {chapters.map((c) => {
        const reviewed = Boolean(map[`${subjectId}/${c.id}`]);
        const active = c.id === activeChapterId;
        const favKey = chapterFavKey(subjectId, c.id);
        const fav = Boolean(favMap[favKey]);
        return (
          <Link
            key={c.id}
            to={`/${subjectId}/${c.id}`}
            className="chapter"
            data-subject={subjectId}
            data-chapter={c.id}
            data-active={active}
            data-reviewed={reviewed}
            data-fav={fav}
            onClick={closeSidebar}
          >
            <span className="chapter__num">{c.id}</span>
            <span className="chapter__body">
              <span className="chapter__title">{c.title}</span>
              <span className="chapter__meta">
                <Stars n={c.importance} />
                <Badges topics={c.topics} />
              </span>
            </span>
            <button
              type="button"
              className="chapter__fav"
              data-fav={fav}
              aria-label={fav ? '取消收藏章节' : '收藏章节'}
              aria-pressed={fav}
              title={fav ? '取消收藏' : '收藏章节'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(favKey);
              }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                <path
                  d="M12 2.5l2.9 6.05 6.6.78-4.85 4.55 1.25 6.52L12 17.9l-5.9 2.5 1.25-6.52L2.5 9.33l6.6-.78L12 2.5z"
                  fill={fav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Link>
        );
      })}
    </>
  );
}

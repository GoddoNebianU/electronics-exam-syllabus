/* ==========================================================================
 * ChapterList.tsx — 侧边栏章节列表
 * 渲染某科目的章节项（章号 + 标题 + 星标 + 题型徽标 + 已复习勾）。
 * 迁移自 legacy/js/sidebar.js 的 renderList。
 * ========================================================================== */
import { Link } from 'react-router-dom';
import type { Chapter, TopicRef } from '../data/types';
import { TOPIC_TYPES } from '../data/syllabus';
import { useProgressStore } from '../store/useProgressStore';
import { useSyllabusStore } from '../store/useSyllabusStore';

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

  return (
    <>
      {chapters.map((c) => {
        const reviewed = Boolean(map[`${subjectId}/${c.id}`]);
        const active = c.id === activeChapterId;
        return (
          <Link
            key={c.id}
            to={`/${subjectId}/${c.id}`}
            className="chapter"
            data-subject={subjectId}
            data-chapter={c.id}
            data-active={active}
            data-reviewed={reviewed}
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
          </Link>
        );
      })}
    </>
  );
}

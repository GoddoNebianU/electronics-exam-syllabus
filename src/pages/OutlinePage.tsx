/* ==========================================================================
 * OutlinePage.tsx — 大纲页
 * 路由 /:subjectId/:chapterId。职责：
 *   - 校验路由（无效则回退默认）
 *   - 同步 store.activeSubjectId + <html data-subject>（主题色）
 *   - 渲染章节工具条（标题/星标/徽标/标记已复习）+ MarkdownView + 面包屑
 * 迁移自 legacy/js/content.js + main.js 的 outline 分支。
 * ========================================================================== */
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DEFAULT_ROUTE,
  TOPIC_TYPES,
  getChapter,
} from '../data/syllabus';
import type { TopicRef } from '../data/types';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useProgressStore } from '../store/useProgressStore';
import { MarkdownView } from '../components/MarkdownView';
import { Breadcrumb } from '../components/Breadcrumb';

function Stars({ n }: { n: number }) {
  return (
    <span className="chapter__stars">
      {'★'.repeat(n)}
      <span className="dim">{'★'.repeat(5 - n)}</span>
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

export function OutlinePage() {
  const { subjectId = '', chapterId = '' } = useParams();
  const navigate = useNavigate();
  const setActiveSubject = useSyllabusStore((s) => s.setActiveSubject);
  const closeSidebar = useSyllabusStore((s) => s.closeSidebar);

  const pair = getChapter(subjectId, chapterId);

  // 路由校验：无效回退默认
  useEffect(() => {
    if (!pair) {
      navigate(`/${DEFAULT_ROUTE.subjectId}/${DEFAULT_ROUTE.chapterId}`, {
        replace: true,
      });
    }
  }, [pair, navigate]);

  // 同步科目主题色 + 侧边栏激活科目；移动端选章后关抽屉
  useEffect(() => {
    if (!pair) return;
    setActiveSubject(pair.subject.id);
    document.documentElement.setAttribute('data-subject', pair.subject.id);
    closeSidebar();
  }, [pair, setActiveSubject, closeSidebar]);

  if (!pair) {
    return (
      <div className="state state--loading">
        <span className="state__icon">◉</span>
        <div className="state__title">正在跳转…</div>
      </div>
    );
  }

  const { subject, chapter } = pair;
  const fullTitle = `第${Number(chapter.id)}章 ${chapter.title}`;

  return (
    <>
      <Breadcrumb current={fullTitle} />
      <DocTitle title={`${chapter.title} · ${subject.name} · 电子技术基础考纲`} />
      <article className="content">
        <ContentBar subject={subject} chapter={chapter} />
        <MarkdownView subject={subject} chapter={chapter} />
      </article>
    </>
  );
}

/** 章节顶部工具条（章号 + 标题 + 星标 + 徽标 + 标记已复习） */
function ContentBar({
  subject,
  chapter,
}: {
  subject: { id: string };
  chapter: { id: string; title: string; importance: number; topics: TopicRef[] };
}) {
  const map = useProgressStore((s) => s.map);
  const setReviewed = useProgressStore((s) => s.setReviewed);
  const reviewed = Boolean(map[`${subject.id}/${chapter.id}`]);
  const fullTitle = `第${Number(chapter.id)}章 ${chapter.title}`;
  return (
    <div className="content__bar">
      <div>
        <div className="content__bar-title">
          <small>{chapter.id}</small>
          {fullTitle}
        </div>
        <div className="chapter__meta" style={{ marginTop: 6 }}>
          <Stars n={chapter.importance} />
          <Badges topics={chapter.topics} />
        </div>
      </div>
      <span className="content__bar-spacer" />
      <button
        type="button"
        className="toggle-review"
        data-reviewed={reviewed}
        onClick={() => setReviewed(subject.id, chapter.id, !reviewed)}
      >
        <span className="toggle-review__box" />
        <span>{reviewed ? '已复习' : '标记已复习'}</span>
      </button>
    </div>
  );
}

/** 副作用：设置 document.title */
function DocTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}

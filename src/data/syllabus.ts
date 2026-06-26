/* ==========================================================================
 * syllabus.ts — 大纲元数据 + 重要度计算逻辑
 *
 * 知识数据（科目/章节/题型分布）已迁至 content/syllabus.json；本文件只保留
 * 逻辑：题型权重、parseCount、calcImportance，以及对外查询函数。
 * ========================================================================== */
import type { Chapter, Subject, TopicType, TopicTypeKey, TopicRef } from './types';
import rawSyllabus from '../../content/syllabus.json';

export const TOPIC_TYPES: Record<TopicTypeKey, TopicType> = {
  judge: { label: '判断', type: 'judge' },
  fill: { label: '填空', type: 'fill' },
  short: { label: '简答', type: 'short' },
  comp: { label: '综合', type: 'comp' },
  calc: { label: '计算', type: 'calc' },
  design: { label: '设计', type: 'design' },
};

const TOPIC_WEIGHT: Record<string, number> = {
  judge: 1, fill: 1.5, short: 4, comp: 7, calc: 4, design: 9,
};

function parseCount(range: string): number {
  const m = range.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (m) return parseInt(m[2]) - parseInt(m[1]) + 1;
  return 1;
}

function calcImportance(topics: TopicRef[]): { importance: 1|2|3|4|5; importanceReason: string } {
  let score = 0;
  const parts: string[] = [];
  for (const t of topics) {
    const n = parseCount(t.range);
    const w = TOPIC_WEIGHT[t.key] ?? 1;
    score += n * w;
    const label = TOPIC_TYPES[t.key as TopicTypeKey]?.label ?? t.key;
    parts.push(`${label}${n}`);
  }
  const importance = Math.max(1, Math.min(5, Math.round(score / 45 * 4 + 1))) as 1|2|3|4|5;
  return { importance, importanceReason: `${parts.join('+')} 共${score}分` };
}

/** 大纲原始数据形态（来自 content/syllabus.json，不含计算字段） */
interface RawChapter extends Omit<Chapter, 'importance' | 'importanceReason'> {}
interface RawSubject {
  id: string;
  name: string;
  short: string;
  dir: string;
  chapters: RawChapter[];
}

const RAW: RawSubject[] = rawSyllabus as unknown as RawSubject[];

export const SYLLABUS: Subject[] = RAW.map((s) => ({
  ...s,
  chapters: s.chapters.map((c: RawChapter) => ({ ...c, ...calcImportance(c.topics) })),
}));

export const TOTAL_CHAPTERS = SYLLABUS.reduce((n, s) => n + s.chapters.length, 0);

export function getSubject(subjectId: string): Subject | null {
  return SYLLABUS.find((s) => s.id === subjectId) ?? null;
}

export function getChapter(subjectId: string, chapterId: string): { subject: Subject; chapter: Chapter } | null {
  const subject = getSubject(subjectId);
  if (!subject) return null;
  const chapter = subject.chapters.find((c) => c.id === chapterId) ?? null;
  return chapter ? { subject, chapter } : null;
}

export function flattenChapters(): { subject: Subject; chapter: Chapter }[] {
  const list: { subject: Subject; chapter: Chapter }[] = [];
  for (const subject of SYLLABUS) for (const chapter of subject.chapters) list.push({ subject, chapter });
  return list;
}

export const DEFAULT_ROUTE = { subjectId: 'shudian', chapterId: '01' } as const;

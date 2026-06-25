import type { Chapter, Subject, TopicType, TopicTypeKey, TopicRef } from './types';

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

type RawChapter = Omit<Chapter, 'importance' | 'importanceReason'>;

const RAW: { id: string; name: string; short: string; dir: string; chapters: RawChapter[] }[] = [
  {
    id: 'shudian', name: '数字电子技术', short: '数电', dir: '大纲/数电',
    chapters: [
      { id: '01', title: '数字逻辑概论', file: '大纲/数电/01-数字逻辑概论.md', topics: [{ key: 'judge', range: '1-8' }, { key: 'fill', range: '1-7' }] },
      { id: '02', title: '逻辑代数基础', file: '大纲/数电/02-逻辑代数基础.md', topics: [{ key: 'judge', range: '9-13' }, { key: 'fill', range: '8-14' }, { key: 'short', range: '5-7' }] },
      { id: '03', title: '门电路', file: '大纲/数电/03-门电路.md', topics: [{ key: 'judge', range: '14-21' }, { key: 'fill', range: '15-20' }] },
      { id: '04', title: '组合逻辑电路', file: '大纲/数电/04-组合逻辑电路.md', topics: [{ key: 'judge', range: '22-28' }, { key: 'fill', range: '21-26' }, { key: 'comp', range: '24-26' }] },
      { id: '05', title: '锁存器与触发器', file: '大纲/数电/05-锁存器与触发器.md', topics: [{ key: 'judge', range: '29-33' }, { key: 'fill', range: '27-29' }, { key: 'short', range: '3-4' }] },
      { id: '06', title: '时序逻辑电路', file: '大纲/数电/06-时序逻辑电路.md', topics: [{ key: 'judge', range: '34-44' }, { key: 'fill', range: '30-35' }, { key: 'comp', range: '1-2' }] },
      { id: '07', title: '半导体存储器', file: '大纲/数电/07-半导体存储器.md', topics: [{ key: 'judge', range: '45-50' }, { key: 'fill', range: '36-40' }] },
      { id: '08', title: '脉冲波形的产生与整形', file: '大纲/数电/08-脉冲波形的产生与整形.md', topics: [{ key: 'judge', range: '51-54' }, { key: 'fill', range: '41-43' }, { key: 'short', range: '1-2' }] },
      { id: '09', title: '数模与模数转换', file: '大纲/数电/09-数模与模数转换.md', topics: [{ key: 'judge', range: '55-60' }, { key: 'fill', range: '44-50' }] },
    ],
  },
  {
    id: 'modian', name: '模拟电子技术', short: '模电', dir: '大纲/模电',
    chapters: [
      { id: '01', title: '放大电路基础', file: '大纲/模电/01-放大电路基础.md', topics: [{ key: 'fill', range: '1-4' }, { key: 'calc', range: '1-3' }] },
      { id: '02', title: '半导体基础与PN结', file: '大纲/模电/02-半导体基础与PN结.md', topics: [{ key: 'fill', range: '5-18' }, { key: 'calc', range: '二极管 1-5' }] },
      { id: '03', title: '场效应管与双极性三极管', file: '大纲/模电/03-场效应管与双极性三极管.md', topics: [{ key: 'fill', range: '19-40' }, { key: 'calc', range: 'MOS/BJT/频响 1-4' }] },
      { id: '04', title: '模拟集成电路', file: '大纲/模电/04-模拟集成电路.md', topics: [{ key: 'fill', range: '41-47' }, { key: 'calc', range: '差分 1-4' }] },
      { id: '05', title: '反馈放大电路', file: '大纲/模电/05-反馈放大电路.md', topics: [{ key: 'fill', range: '48-59' }, { key: 'short', range: '反馈判断 1-4' }] },
      { id: '06', title: '信号的运算与处理', file: '大纲/模电/06-信号的运算与处理.md', topics: [{ key: 'fill', range: '60-72' }, { key: 'calc', range: '比较器 1-2' }] },
      { id: '07', title: '波形发生与信号转换', file: '大纲/模电/07-波形发生与信号转换.md', topics: [{ key: 'fill', range: '73-78' }, { key: 'calc', range: '振荡 1-4' }] },
      { id: '08', title: '功率放大电路', file: '大纲/模电/08-功率放大电路.md', topics: [{ key: 'fill', range: '79-86' }, { key: 'calc', range: '功放 1-4' }] },
      { id: '09', title: '直流稳压电源', file: '大纲/模电/09-直流稳压电源.md', topics: [{ key: 'fill', range: '87-95' }] },
      { id: '10', title: '综合应用与电路设计', file: '大纲/模电/10-综合应用与电路设计.md', topics: [{ key: 'comp', range: '95-100' }, { key: 'design', range: '1-4' }] },
    ],
  },
];

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

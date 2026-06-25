/* ==========================================================================
 * syllabus.ts — 大纲目录数据（单一数据源）
 * 迁移自 legacy/js/config.js，TS 化。
 * 其他模块一律从此 import，禁止在他处硬编码章节信息。
 * ========================================================================== */
import type { Chapter, Subject, TopicType, TopicTypeKey } from './types';

/** 题型 -> { label, type } */
export const TOPIC_TYPES: Record<TopicTypeKey, TopicType> = {
  judge: { label: '判断', type: 'judge' },
  fill: { label: '填空', type: 'fill' },
  short: { label: '简答', type: 'short' },
  comp: { label: '综合', type: 'comp' },
  calc: { label: '计算', type: 'calc' },
  design: { label: '设计', type: 'design' },
};

export const SYLLABUS: Subject[] = [
  {
    id: 'shudian',
    name: '数字电子技术',
    short: '数电',
    dir: '大纲/数电',
    chapters: [
      {
        id: '01', title: '数字逻辑概论',
        file: '大纲/数电/01-数字逻辑概论.md',
        topics: [{ key: 'judge', range: '1-8' }, { key: 'fill', range: '1-7' }],
        importance: 2,
        importanceReason: '基础概念题为主（判断8+填空7），无计算/综合大题',
      },
      {
        id: '02', title: '逻辑代数基础',
        file: '大纲/数电/02-逻辑代数基础.md',
        topics: [{ key: 'judge', range: '9-13' }, { key: 'fill', range: '8-14' }, { key: 'short', range: '5-7' }],
        importance: 4,
        importanceReason: '卡诺图化简简答必考（简答5-7），判断5+填空7',
      },
      {
        id: '03', title: '门电路',
        file: '大纲/数电/03-门电路.md',
        topics: [{ key: 'judge', range: '14-21' }, { key: 'fill', range: '15-20' }],
        importance: 2,
        importanceReason: 'TTL/CMOS 概念辨析为主，无计算/设计大题',
      },
      {
        id: '04', title: '组合逻辑电路',
        file: '大纲/数电/04-组合逻辑电路.md',
        topics: [{ key: 'judge', range: '22-28' }, { key: 'fill', range: '21-26' }, { key: 'comp', range: '24-26' }],
        importance: 4,
        importanceReason: '组合逻辑设计大题（综合24-26：多数表决/液位/裁判），判断7+填空6',
      },
      {
        id: '05', title: '锁存器与触发器',
        file: '大纲/数电/05-锁存器与触发器.md',
        topics: [{ key: 'judge', range: '29-33' }, { key: 'fill', range: '27-29' }, { key: 'short', range: '3-4' }],
        importance: 4,
        importanceReason: '触发器特性方程简答必考（简答3-4），判断5+填空3',
      },
      {
        id: '06', title: '时序逻辑电路',
        file: '大纲/数电/06-时序逻辑电路.md',
        topics: [{ key: 'judge', range: '34-44' }, { key: 'fill', range: '30-35' }, { key: 'comp', range: '1-2' }],
        importance: 5,
        importanceReason: '压轴综合大题（综合1-2：555+161+138+153 时序系统），判断11+填空6',
      },
      {
        id: '07', title: '半导体存储器',
        file: '大纲/数电/07-半导体存储器.md',
        topics: [{ key: 'judge', range: '45-50' }, { key: 'fill', range: '36-40' }],
        importance: 3,
        importanceReason: '存储器扩展计算题（字/位扩展算芯片数），判断6+填空5',
      },
      {
        id: '08', title: '脉冲波形的产生与整形',
        file: '大纲/数电/08-脉冲波形的产生与整形.md',
        topics: [{ key: 'judge', range: '51-54' }, { key: 'fill', range: '41-43' }, { key: 'short', range: '1-2' }],
        importance: 4,
        importanceReason: '555 定时器三种电路+综合题核心，简答1-2必考',
      },
      {
        id: '09', title: '数模与模数转换',
        file: '大纲/数电/09-数模与模数转换.md',
        topics: [{ key: 'judge', range: '55-60' }, { key: 'fill', range: '44-50' }],
        importance: 2,
        importanceReason: 'ADC/DAC 概念与分辨率计算为主，无综合大题',
      },
    ],
  },
  {
    id: 'modian',
    name: '模拟电子技术',
    short: '模电',
    dir: '大纲/模电',
    chapters: [
      {
        id: '01', title: '放大电路基础',
        file: '大纲/模电/01-放大电路基础.md',
        topics: [{ key: 'fill', range: '1-4' }, { key: 'calc', range: '1-3' }],
        importance: 2,
        importanceReason: '基础概念+简单输出电阻计算（计算1-3），无综合题',
      },
      {
        id: '02', title: '半导体基础与PN结',
        file: '大纲/模电/02-半导体基础与PN结.md',
        topics: [{ key: 'fill', range: '5-18' }, { key: 'calc', range: '二极管 1-5' }],
        importance: 2,
        importanceReason: '概念辨析为主+二极管电路分析（14道填空），无综合题',
      },
      {
        id: '03', title: '场效应管与双极性三极管',
        file: '大纲/模电/03-场效应管与双极性三极管.md',
        topics: [{ key: 'fill', range: '19-40' }, { key: 'calc', range: 'MOS/BJT/频响 1-4' }],
        importance: 5,
        importanceReason: '计算题最多（MOS放大4+BJT放大4+频率响应4共12道），填空22',
      },
      {
        id: '04', title: '模拟集成电路',
        file: '大纲/模电/04-模拟集成电路.md',
        topics: [{ key: 'fill', range: '41-47' }, { key: 'calc', range: '差分 1-4' }],
        importance: 3,
        importanceReason: '差分放大分析（计算4），填空7，中等权重',
      },
      {
        id: '05', title: '反馈放大电路',
        file: '大纲/模电/05-反馈放大电路.md',
        topics: [{ key: 'fill', range: '48-59' }, { key: 'short', range: '反馈判断 1-4' }],
        importance: 4,
        importanceReason: '反馈类型判断题重点（判断4），填空12',
      },
      {
        id: '06', title: '信号的运算与处理',
        file: '大纲/模电/06-信号的运算与处理.md',
        topics: [{ key: 'fill', range: '60-72' }, { key: 'calc', range: '比较器 1-2' }],
        importance: 5,
        importanceReason: '运放核心+综合设计题（反相加法器/AI应用），填空13+比较器2',
      },
      {
        id: '07', title: '波形发生与信号转换',
        file: '大纲/模电/07-波形发生与信号转换.md',
        topics: [{ key: 'fill', range: '73-78' }, { key: 'calc', range: '振荡 1-4' }],
        importance: 3,
        importanceReason: 'RC/LC 振荡电路分析（计算4），填空6',
      },
      {
        id: '08', title: '功率放大电路',
        file: '大纲/模电/08-功率放大电路.md',
        topics: [{ key: 'fill', range: '79-86' }, { key: 'calc', range: '功放 1-4' }],
        importance: 4,
        importanceReason: 'OCL 效率/管耗计算必考（计算4），填空8',
      },
      {
        id: '09', title: '直流稳压电源',
        file: '大纲/模电/09-直流稳压电源.md',
        topics: [{ key: 'fill', range: '87-95' }],
        importance: 2,
        importanceReason: '稳压电源概念为主（填空9），无计算/综合大题',
      },
      {
        id: '10', title: '综合应用与电路设计',
        file: '大纲/模电/10-综合应用与电路设计.md',
        topics: [{ key: 'comp', range: '95-100' }, { key: 'design', range: '1-4' }],
        importance: 5,
        importanceReason: '压轴综合设计大题（运放选型/加法器/AI安防/AI义肢），分值最高',
      },
    ],
  },
];

/* ---- 派生查询工具（纯函数，无副作用）---- */

export const TOTAL_CHAPTERS = SYLLABUS.reduce(
  (n, s) => n + s.chapters.length,
  0,
);

export function getSubject(subjectId: string): Subject | null {
  return SYLLABUS.find((s) => s.id === subjectId) ?? null;
}

export function getChapter(
  subjectId: string,
  chapterId: string,
): { subject: Subject; chapter: Chapter } | null {
  const subject = getSubject(subjectId);
  if (!subject) return null;
  const chapter = subject.chapters.find((c) => c.id === chapterId) ?? null;
  return chapter ? { subject, chapter } : null;
}

export function flattenChapters(): { subject: Subject; chapter: Chapter }[] {
  const list: { subject: Subject; chapter: Chapter }[] = [];
  for (const subject of SYLLABUS) {
    for (const chapter of subject.chapters) {
      list.push({ subject, chapter });
    }
  }
  return list;
}

export const DEFAULT_ROUTE = { subjectId: 'shudian', chapterId: '01' } as const;

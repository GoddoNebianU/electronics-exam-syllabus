/* ==========================================================================
 * types.ts — 数据模型类型（单一类型源）
 * ========================================================================== */

/** 题型语义键 */
export type TopicTypeKey =
  | 'judge'
  | 'fill'
  | 'short'
  | 'comp'
  | 'calc'
  | 'design';

/** 题型元信息 */
export interface TopicType {
  /** 中文标签 */
  label: string;
  /** 徽标语义键（对应 CSS --tag-* 变量） */
  type: TopicTypeKey;
}

/** 章节内某题型的分布 */
export interface TopicRef {
  key: TopicTypeKey;
  /** 题号范围，如 "1-8" */
  range: string;
}

/** 大纲章节 */
export interface Chapter {
  /** 章节序号 "01".."10"，用于路由 */
  id: string;
  /** 章节名（不含"第N章"前缀） */
  title: string;
  /** md 文件路径（相对 base，fetch 用） */
  file: string;
  /** 题型分布 */
  topics: TopicRef[];
  /** 重要度 1~3 星 */
  importance: 1 | 2 | 3;
}

/** 科目 */
export interface Subject {
  /** "shudian" | "modian" */
  id: string;
  /** 科目中文名 */
  name: string;
  /** 短称（顶栏 tab） */
  short: string;
  /** md 文件所在目录（相对 index） */
  dir: string;
  chapters: Chapter[];
}

/** 公式分类 */
export interface FormulaCategory {
  id: string;
  name: string;
  brief: string;
}

/** 公式条目 */
export interface Formula {
  /** 唯一 id */
  id: string;
  /** 所属分类 id */
  cat: string;
  /** 中文标题 */
  title: string;
  /** KaTeX 源码（JS 字符串已转义，即源码里是单反斜杠） */
  latex: string;
  /** 本式涉及的符号 token 数组（须与 SYMBOLS 字典 key 一致） */
  symbols: string[];
  /** 说明（可选） */
  note?: string;
}

/** 符号定义 */
export interface SymbolDef {
  /** 中文名 */
  name: string;
  /** 释义 */
  desc: string;
  /** 单位（无量纲记 '−'） */
  unit: string;
}

/** 符号字典：token → 定义 */
export type SymbolDict = Record<string, SymbolDef>;

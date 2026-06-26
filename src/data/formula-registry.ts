/* ==========================================================================
 * formula-registry.ts — 公式视图注册表（数据驱动）
 * 迁移自 legacy/js/formula-views.js 的注册思想。
 * 新增一个公式科目只需在 FORMULA_VIEWS 里加一项。
 * ========================================================================== */
import { FIELDS_CATEGORIES, FIELDS_FORMULAS, FIELDS_SYMBOLS, MODIAN_CATEGORIES, MODIAN_FORMULAS, MODIAN_SYMBOLS, SIGNALS_CATEGORIES, SIGNALS_FORMULAS, SIGNALS_SYMBOLS } from './content';
import type { FormulaCategory, Formula as FormulaT, SymbolDict } from './types';

/** 公式视图配置 */
export interface FormulaView {
  /** 唯一标识 */
  id: string;
  /** hash 路由前缀（不含 #），如 'fields' → '#/fields' */
  routeName: string;
  /** 科目主题（data-subject 值） */
  subject: 'fields' | 'modian' | 'signals';
  /** 工具栏主标题 */
  title: string;
  /** 工具栏副标题 */
  subtitle: string;
  /** 返回大纲的 hash */
  backHref: string;
  /** 顶栏入口按钮文案 */
  entryLabel: string;
  entryTitle: string;
  /** 数据集 */
  data: {
    categories: FormulaCategory[];
    formulas: FormulaT[];
    symbols: SymbolDict;
  };
}

export const FORMULA_VIEWS: FormulaView[] = [
  {
    id: 'fields',
    routeName: 'fields',
    subject: 'fields',
    title: '电磁场与电磁波',
    subtitle: `公式手册 · ${FIELDS_FORMULAS.length} 式 · ${Object.keys(FIELDS_SYMBOLS).length} 符号`,
    backHref: '#/shudian/01',
    entryLabel: '电磁场公式',
    entryTitle: '电磁场与电磁波 · 公式手册',
    data: {
      categories: FIELDS_CATEGORIES,
      formulas: FIELDS_FORMULAS,
      symbols: FIELDS_SYMBOLS,
    },
  },
  {
    id: 'modian-formula',
    routeName: 'modian-formulas',
    subject: 'modian',
    title: '模拟电子技术',
    subtitle: `公式手册 · ${MODIAN_FORMULAS.length} 式 · ${Object.keys(MODIAN_SYMBOLS).length} 符号`,
    backHref: '#/shudian/01',
    entryLabel: '模电公式',
    entryTitle: '模拟电子技术 · 公式手册',
    data: {
      categories: MODIAN_CATEGORIES,
      formulas: MODIAN_FORMULAS,
      symbols: MODIAN_SYMBOLS,
    },
  },
  {
    id: 'signals',
    routeName: 'signals',
    subject: 'signals',
    title: '信号与系统',
    subtitle: `公式手册 · ${SIGNALS_FORMULAS.length} 式 · ${Object.keys(SIGNALS_SYMBOLS).length} 符号`,
    backHref: '#/shudian/01',
    entryLabel: '信号公式',
    entryTitle: '信号与系统 · 公式手册',
    data: {
      categories: SIGNALS_CATEGORIES,
      formulas: SIGNALS_FORMULAS,
      symbols: SIGNALS_SYMBOLS,
    },
  },
];

/** 按 routeName 取公式视图 */
export function getFormulaView(routeName: string): FormulaView | null {
  return FORMULA_VIEWS.find((v) => v.routeName === routeName) ?? null;
}

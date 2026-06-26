/* ==========================================================================
 * content.ts — 知识内容加载层（content/ → 类型化导出）
 *
 * 职责：把 content/ 下的 JSON 数据（公式/符号/分类）加载、按分类顺序拼装、
 * 类型断言后，以消费端熟悉的同名导出（FIELDS_FORMULAS 等）暴露。
 *
 * 设计要点：
 *   - 公式按分类拆成单独 JSON 文件；用 import.meta.glob 自动发现，新增分类
 *     只需加一个 JSON 文件，无需改本文件（真正的数据驱动）。
 *   - 拼装顺序遵循 categories.json 的分类顺序，保证展示顺序稳定。
 *   - 类型由 ./types 的 schema 约束；JSON 经断言接入。
 * ========================================================================== */
import type { Formula, FormulaCategory, SymbolDict } from './types';
import fieldsCats from '../../content/fields/categories.json';
import fieldsSyms from '../../content/fields/symbols.json';
import modianCats from '../../content/modian/categories.json';
import modianSyms from '../../content/modian/symbols.json';
import signalsCats from '../../content/signals/categories.json';
import signalsSyms from '../../content/signals/symbols.json';

/** 自动发现各分类的公式文件（eager：构建期内联，dev/build 一致） */
const FIELDS_FORMULA_FILES = import.meta.glob('../../content/fields/formulas/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Formula[]>;

const MODIAN_FORMULA_FILES = import.meta.glob('../../content/modian/formulas/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Formula[]>;

const SIGNALS_FORMULA_FILES = import.meta.glob('../../content/signals/formulas/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Formula[]>;

/** 按 categories 顺序拼装公式列表；缺失文件给出告警 */
function assembleFormulas(
  cats: FormulaCategory[],
  files: Record<string, Formula[]>,
  label: string,
): Formula[] {
  const out: Formula[] = [];
  for (const c of cats) {
    const key = Object.keys(files).find((k) => k.endsWith(`/formulas/${c.id}.json`));
    if (key) {
      out.push(...files[key]);
    } else {
      console.warn(`[content:${label}] 缺少分类公式文件: content/${label}/formulas/${c.id}.json`);
    }
  }
  return out;
}

/* ---------------- 电磁场 ---------------- */
export const FIELDS_CATEGORIES = fieldsCats as FormulaCategory[];
export const FIELDS_SYMBOLS = fieldsSyms as unknown as SymbolDict;
export const FIELDS_FORMULAS = assembleFormulas(FIELDS_CATEGORIES, FIELDS_FORMULA_FILES, 'fields');

/* ---------------- 模电 ---------------- */
export const MODIAN_CATEGORIES = modianCats as FormulaCategory[];
export const MODIAN_SYMBOLS = modianSyms as unknown as SymbolDict;
export const MODIAN_FORMULAS = assembleFormulas(MODIAN_CATEGORIES, MODIAN_FORMULA_FILES, 'modian');

/* ---------------- 信号与系统 ---------------- */
export const SIGNALS_CATEGORIES = signalsCats as FormulaCategory[];
export const SIGNALS_SYMBOLS = signalsSyms as unknown as SymbolDict;
export const SIGNALS_FORMULAS = assembleFormulas(SIGNALS_CATEGORIES, SIGNALS_FORMULA_FILES, 'signals');

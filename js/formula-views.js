/* ==========================================================================
 * formula-views.js — 公式视图注册表（唯一注册点）
 *
 * 新增一个公式科目只需：
 *   1) 新建数据文件（导出 XXX_CATEGORIES / XXX_FORMULAS / XXX_SYMBOLS）
 *   2) 在下方数组里加一个 createFormulaView({...}) 调用
 * main.js / index.html 零改动（root 容器与入口按钮由工厂动态注入）。
 * ========================================================================== */

import { createFormulaView } from './formula-view.js';
import { FIELDS_CATEGORIES, FIELDS_FORMULAS, FIELDS_SYMBOLS } from './fields-data.js';
import { MODIAN_CATEGORIES, MODIAN_FORMULAS, MODIAN_SYMBOLS } from './modian-formulas-data.js';

export const formulaViews = [
  createFormulaView({
    id: 'fields',
    routeBase: '#/fields',
    data: { categories: FIELDS_CATEGORIES, formulas: FIELDS_FORMULAS, symbols: FIELDS_SYMBOLS },
    title: '电磁场与电磁波',
    subtitle: `公式手册 · ${FIELDS_FORMULAS.length} 式 · ${Object.keys(FIELDS_SYMBOLS).length} 符号`,
    subject: 'fields',
    appClass: 'app--fields',
    backHref: '#/shudian/01',
    entry: { icon: '📐', label: '电磁场公式', title: '电磁场与电磁波 · 公式手册' },
  }),
  createFormulaView({
    id: 'modian-formula',
    routeBase: '#/modian-formulas',
    data: { categories: MODIAN_CATEGORIES, formulas: MODIAN_FORMULAS, symbols: MODIAN_SYMBOLS },
    title: '模拟电子技术',
    subtitle: `公式手册 · ${MODIAN_FORMULAS.length} 式 · ${Object.keys(MODIAN_SYMBOLS).length} 符号`,
    subject: 'modian',
    appClass: 'app--modian-formulas',
    backHref: '#/shudian/01',
    entry: { icon: '📐', label: '模电公式', title: '模拟电子技术 · 公式手册' },
  }),
];

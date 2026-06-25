/* ==========================================================================
 * modian-formulas-data.js — 《模拟电子技术基础》(模电) 公式速查数据
 *
 * 结构：导出三个常量
 *   1) MODIAN_CATEGORIES : 9 大章分类（id / name / brief 简介）
 *   2) MODIAN_FORMULAS   : 公式列表，每条含 id(唯一) / cat(分类id) /
 *                          title(中文标题) / latex(KaTeX 源码,JS 已转义) /
 *                          symbols(本式涉及的符号 token 数组) / note(说明)
 *   3) MODIAN_SYMBOLS    : 符号定义字典，key 为符号 token，value 含
 *                          name(中文名) / desc(释义) / unit(单位)
 *
 * --------------------------------------------------------------------------
 * 【TOKEN 命名规则】（symbols 数组里的元素必须与 MODIAN_SYMBOLS 的 key 完全一致）
 *   - token 取「该符号在 latex 源码中的写法（去掉排版包装）」。
 *   - 结构/排版命令不计入 token，也不进字典：
 *       \frac \sqrt \mathrm \cdot \parallel \int \ln \lg \approx \left \right
 *     等。其中 \mathrm{} 仅作字母正体包装，如 CMRR 渲染为 \mathrm{CMRR}，
 *     但 token 仍记 'CMRR'；GBP 同理记 'GBP'。
 *   - 物理量符号（含希腊字母）作为独立 token：
 *       '\beta'(共射电流放大系数) '\alpha'(共基电流放大系数) '\eta'(效率)
 *       '\pi'(圆周率) '\varphi'(相角) '\Delta'(增量算子)。
 *   - 下标区分独立物理量：I_B/I_C/I_E/I_{BQ}/I_{CQ}/I_{EQ}/I_{CEO}/I_{CBO}/
 *     U_{BEQ}/U_{CEQ}/U_{BE}/V_{CC}/V_{TN}/U_{GS}/U_Z/U_2 等。
 *   - 重用记号（同一字母多义，desc 中以分号区分上下文）：
 *       R    = 通用电阻（积分/微分/滤波元件、镜像电流源电阻、限流电阻）
 *       F    = 反馈系数（反馈章）；方波发生器中作正反馈分压比 R2/(R1+R2)
 *       A    = 开环放大倍数；振荡条件中作环路增益的放大环节
 *       u_o  = 输出交流电压（放大/运放章）；U_o = 直流稳压输出（电源章）
 *       n    = 多级放大级数；振荡相位条件整数 n
 *   - 单位：无量纲记 '−'。
 * --------------------------------------------------------------------------
 * latex 渲染：项目使用 KaTeX。分数 \\frac{}{}、上下标 ^{}/_{}、希腊字母
 * \\beta\\pi\\eta\\alpha\\varphi\\omega、并联 \\parallel、根号 \\sqrt{}、
 * 积分 \\int、对数 \\ln/\\lg、约等 \\approx、无穷 \\infty、欧姆 \\Omega
 * 均被支持。JS 字符串中所有反斜杠已写成双反斜杠 '\\' 以避免 \\f 等转义 bug。
 * ========================================================================== */


import type { Formula } from './types';
import { MODIAN_FORMULAS_P1 } from './modian-formulas-p1';
import { MODIAN_FORMULAS_P2 } from './modian-formulas-p2';
import { MODIAN_FORMULAS_P3 } from './modian-formulas-p3';
import { MODIAN_FORMULAS_P4 } from './modian-formulas-p4';

export { MODIAN_CATEGORIES } from './modian-categories';
export { MODIAN_SYMBOLS } from './modian-symbols';

export const MODIAN_FORMULAS: Formula[] = [
  ...MODIAN_FORMULAS_P1,
  ...MODIAN_FORMULAS_P2,
  ...MODIAN_FORMULAS_P3,
  ...MODIAN_FORMULAS_P4,
];

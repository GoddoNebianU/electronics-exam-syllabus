/* ==========================================================================
 * fields-data.js — 《电磁场与电磁波》公式速查数据
 *
 * 结构：导出三个常量
 *   1) FIELDS_CATEGORIES : 8 大章分类（id / name / brief 简介）
 *   2) FIELDS_FORMULAS   : 公式列表，每条含 id(唯一) / cat(分类id) /
 *                          title(中文标题) / latex(KaTeX 源码,JS 已转义) /
 *                          symbols(本式涉及的符号 token 数组) / note(说明)
 *   3) FIELDS_SYMBOLS    : 符号定义字典，key 为符号 token，value 含
 *                          name(中文名) / desc(释义) / unit(单位)
 *
 * --------------------------------------------------------------------------
 * 【TOKEN 命名规则】（symbols 数组里的元素必须与 FIELDS_SYMBOLS 的 key 完全一致）
 *   - token 取「该符号在 latex 源码中的写法」；矢量粗体包装 \mathbf{} 不计入
 *     token（即电场写作 token 'E'，公式里渲染为 \mathbf{E}）。
 *   - 算子作为独立 token：'\nabla'(梯度∇) '\nabla\cdot'(散度) '\nabla\times'(旋度)
 *     '\nabla^2'(拉普拉斯) '\partial'(偏导) '\oint'(闭合积分) '\int'(积分)。
 *   - 物理上独立的有下标量保留下标，作为独立 token：
 *     '\varepsilon_0' '\varepsilon_r' '\mu_0' '\mu_r' '\eta_0' '\lambda_c'
 *     '\lambda_g' 'v_p' 'v_g' 'J_d' 'J_s' '\rho_s' 'R_r' 'Z_0' 'I_0' 'E_m'
 *     'W_e' 'W_m' 'w_e' 'w_m' 'A_e'。
 *   - 仅作「介质编号/方向标记」的下标(1、2、n 法向、t 切向、s 面)并入基符号，
 *     不另立 token（如边界条件里的 D_1n、E_2t 都引用基 token 'D'/'E'）。
 *   - 重用记号合并说明（同一字母多义，desc 中以分号区分上下文）：
 *       D  = 电位移矢量（静电场）；辐射章方向性系数亦记 D
 *       G  = 天线增益；传输线并联电导（电报方程）亦记 G
 *       R  = 传输线单位长串联电阻；R_r 为辐射电阻（独立 token）
 *       p  = 功率密度(J·E)；亦表电偶极矩 p=ql（矢量）
 *       F  = 力；矢量分析中泛指任意矢量场
 *       B/A= 磁感应强度 / 矢量磁位；矢量恒等式中亦作泛指矢量
 *       S  = 积分曲面(∮_S、∫_S)；坡印廷矢量单独记 '\mathbf{S}'
 *   - 单位：无量纲记 '−'。
 * --------------------------------------------------------------------------
 * latex 渲染：项目使用 KaTeX(auto-render)，矢量 \mathbf{}、单位向量 \hat{}、
 * 算子 \nabla / \cdot / \times / ^2、积分 \int / \oint、偏导 \partial、
 * 分数 \\frac{}{} 均被支持。JS 字符串中反斜杠已写成双反斜杠 '\\'。
 * ========================================================================== */


import type { Formula } from './types';
import { FIELDS_FORMULAS_P1 } from './fields-formulas-p1';
import { FIELDS_FORMULAS_P2 } from './fields-formulas-p2';
import { FIELDS_FORMULAS_P3 } from './fields-formulas-p3';
import { FIELDS_FORMULAS_P4 } from './fields-formulas-p4';
import { FIELDS_FORMULAS_P5 } from './fields-formulas-p5';

export { FIELDS_CATEGORIES } from './fields-categories';
export { FIELDS_SYMBOLS } from './fields-symbols';

export const FIELDS_FORMULAS: Formula[] = [
  ...FIELDS_FORMULAS_P1,
  ...FIELDS_FORMULAS_P2,
  ...FIELDS_FORMULAS_P3,
  ...FIELDS_FORMULAS_P4,
  ...FIELDS_FORMULAS_P5,
];

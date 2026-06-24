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

/* ---- 1. 分类（8 章，按教学顺序）---------------------------------------- */
import type { Formula, FormulaCategory, SymbolDict } from './types';

export const FIELDS_CATEGORIES: FormulaCategory[] = [
  { id: 'vector',       name: '矢量分析',   brief: '梯度/散度/旋度/定理/恒等式/坐标系' },
  { id: 'static-e',     name: '静电场',     brief: '库仑/高斯/电位/能量/边界/电容' },
  { id: 'steady-e',     name: '恒定电场',   brief: '电流密度/欧姆/焦耳/连续性/边界' },
  { id: 'static-m',     name: '恒定磁场',   brief: '毕萨/安培/磁位/能量/边界/电感' },
  { id: 'time-varying', name: '时变电磁场', brief: '法拉第/位移电流/麦克斯韦/坡印廷' },
  { id: 'plane-wave',   name: '平面电磁波', brief: '波方程/波阻抗/衰减/趋肤/极化/反射' },
  { id: 'waveguide',    name: '导行电磁波', brief: '传输线/波导/截止/相速群速/谐振' },
  { id: 'radiation',    name: '电磁波辐射', brief: '滞后位/偶极子/辐射电阻/天线参量' },
];

/* ---- 2. 公式列表 -------------------------------------------------------- */
export const FIELDS_FORMULAS: Formula[] = [

  /* ============== 第 1 章 矢量分析 vector ============== */
  { id:'v-grad-cart', cat:'vector', title:'标量场梯度（直角坐标）',
    latex:'\\nabla\\varphi=\\frac{\\partial\\varphi}{\\partial x}\\hat{x}+\\frac{\\partial\\varphi}{\\partial y}\\hat{y}+\\frac{\\partial\\varphi}{\\partial z}\\hat{z}',
    symbols:['\\nabla','\\varphi','\\partial','x','y','z','\\hat{x}','\\hat{y}','\\hat{z}'],
    note:'梯度是矢量，指向标量场变化率最大方向，模等于最大方向导数' },

  { id:'v-div-cart', cat:'vector', title:'矢量场散度（直角坐标定义）',
    latex:'\\nabla\\cdot\\mathbf{F}=\\frac{\\partial F_x}{\\partial x}+\\frac{\\partial F_y}{\\partial y}+\\frac{\\partial F_z}{\\partial z}',
    symbols:['\\nabla\\cdot','\\partial','x','y','z'],
    note:'散度为标量，度量场中一点通量源的强度；>0 源、<0 汇、=0 无源' },

  { id:'v-curl-cart', cat:'vector', title:'矢量场旋度（直角坐标定义）',
    latex:'\\nabla\\times\\mathbf{F}=\\begin{vmatrix}\\hat{x}&\\hat{y}&\\hat{z}\\\\\\frac{\\partial}{\\partial x}&\\frac{\\partial}{\\partial y}&\\frac{\\partial}{\\partial z}\\\\F_x&F_y&F_z\\end{vmatrix}',
    symbols:['\\nabla\\times','\\hat{x}','\\hat{y}','\\hat{z}','\\partial','x','y','z'],
    note:'旋度为矢量，度量场中一点涡旋源的强度；=0 无旋（保守场）' },

  { id:'v-lap-cart', cat:'vector', title:'拉普拉斯算子（标量，直角坐标）',
    latex:'\\nabla^2\\varphi=\\frac{\\partial^2\\varphi}{\\partial x^2}+\\frac{\\partial^2\\varphi}{\\partial y^2}+\\frac{\\partial^2\\varphi}{\\partial z^2}',
    symbols:['\\nabla^2','\\varphi','\\partial','x','y','z'],
    note:'拉普拉斯算子 ∇²=∇·∇，作用于标量场得标量' },

  { id:'v-gauss-div-thm', cat:'vector', title:'高斯散度定理',
    latex:'\\oint_{S}\\mathbf{F}\\cdot d\\mathbf{S}=\\int_{V}(\\nabla\\cdot\\mathbf{F})\\,dV',
    symbols:['\\oint','S','dS','\\int','V','\\nabla\\cdot','dV'],
    note:'体积分与面积分转换：闭合面通量等于其内散度的体积分' },

  { id:'v-stokes-thm', cat:'vector', title:'斯托克斯定理',
    latex:'\\oint_{l}\\mathbf{F}\\cdot d\\mathbf{l}=\\int_{S}(\\nabla\\times\\mathbf{F})\\cdot d\\mathbf{S}',
    symbols:['\\oint','S','dl','\\int','\\nabla\\times','dS'],
    note:'线积分与面积分转换：闭合环路环量等于其面上旋度的面积分' },

  { id:'v-id-divcurl0', cat:'vector', title:'恒等式：散度的旋度为零',
    latex:'\\nabla\\cdot(\\nabla\\times\\mathbf{A})=0',
    symbols:['\\nabla\\cdot','\\nabla\\times','A'],
    note:'旋度场无散（横场）；任何矢量旋度的散度恒为零' },

  { id:'v-id-curlgrad0', cat:'vector', title:'恒等式：旋度的梯度为零',
    latex:'\\nabla\\times(\\nabla\\varphi)=0',
    symbols:['\\nabla\\times','\\nabla','\\varphi'],
    note:'梯度场无旋（纵/保守场）；任何标量梯度的旋度恒为零' },

  { id:'v-id-divgrad-lap', cat:'vector', title:'恒等式：梯度的散度等于拉普拉斯',
    latex:'\\nabla\\cdot(\\nabla\\varphi)=\\nabla^2\\varphi',
    symbols:['\\nabla\\cdot','\\nabla','\\varphi','\\nabla^2'],
    note:'拉普拉斯算子的定义来源' },

  { id:'v-id-div-sv', cat:'vector', title:'恒等式：∇·(φA)',
    latex:'\\nabla\\cdot(\\varphi\\mathbf{A})=\\varphi\\,\\nabla\\cdot\\mathbf{A}+\\mathbf{A}\\cdot\\nabla\\varphi',
    symbols:['\\nabla\\cdot','\\varphi','A','\\nabla'],
    note:'标量乘矢量的散度 = 标量×散度 + 矢量·梯度（乘积法则）' },

  { id:'v-id-curl-sv', cat:'vector', title:'恒等式：∇×(φA)',
    latex:'\\nabla\\times(\\varphi\\mathbf{A})=\\varphi\\,\\nabla\\times\\mathbf{A}+\\nabla\\varphi\\times\\mathbf{A}',
    symbols:['\\nabla\\times','\\varphi','A','\\nabla'],
    note:'标量乘矢量的旋度 = 标量×旋度 + 梯度×矢量' },

  { id:'v-id-div-cross', cat:'vector', title:'恒等式：∇·(A×B)',
    latex:'\\nabla\\cdot(\\mathbf{A}\\times\\mathbf{B})=\\mathbf{B}\\cdot(\\nabla\\times\\mathbf{A})-\\mathbf{A}\\cdot(\\nabla\\times\\mathbf{B})',
    symbols:['\\nabla\\cdot','\\nabla\\times'],
    note:'叉乘矢量的散度展开（常用）' },

  { id:'v-id-grad-dot', cat:'vector', title:'恒等式：∇(A·B)',
    latex:'\\nabla(\\mathbf{A}\\cdot\\mathbf{B})=(\\mathbf{A}\\cdot\\nabla)\\mathbf{B}+(\\mathbf{B}\\cdot\\nabla)\\mathbf{A}+\\mathbf{A}\\times(\\nabla\\times\\mathbf{B})+\\mathbf{B}\\times(\\nabla\\times\\mathbf{A})',
    symbols:['\\nabla','\\nabla\\times'],
    note:'点积的梯度展开为四项之和（矢量恒等式中较复杂者）' },

  { id:'v-cyl-grad', cat:'vector', title:'梯度（圆柱坐标）',
    latex:'\\nabla\\varphi=\\hat{r}\\frac{\\partial\\varphi}{\\partial r}+\\hat{\\phi}\\frac{1}{r}\\frac{\\partial\\varphi}{\\partial\\phi}+\\hat{z}\\frac{\\partial\\varphi}{\\partial z}',
    symbols:['\\nabla','\\varphi','\\hat{r}','\\partial','r','\\hat{\\phi}','\\phi','\\hat{z}','z'],
    note:'圆柱坐标 (r,φ,z)，注意 φ 分量有 1/r 因子' },

  { id:'v-cyl-div', cat:'vector', title:'散度（圆柱坐标）',
    latex:'\\nabla\\cdot\\mathbf{F}=\\frac{1}{r}\\frac{\\partial}{\\partial r}(rF_r)+\\frac{1}{r}\\frac{\\partial F_{\\phi}}{\\partial\\phi}+\\frac{\\partial F_z}{\\partial z}',
    symbols:['\\nabla\\cdot','\\partial','r','\\phi','z'],
    note:'圆柱坐标散度，r 分量含 1/r·∂(rF_r)/∂r' },

  { id:'v-cyl-curl', cat:'vector', title:'旋度（圆柱坐标）',
    latex:'\\nabla\\times\\mathbf{F}=\\hat{r}\\!\\left(\\frac{1}{r}\\frac{\\partial F_z}{\\partial\\phi}-\\frac{\\partial F_{\\phi}}{\\partial z}\\right)+\\hat{\\phi}\\!\\left(\\frac{\\partial F_r}{\\partial z}-\\frac{\\partial F_z}{\\partial r}\\right)+\\hat{z}\\,\\frac{1}{r}\\!\\left(\\frac{\\partial}{\\partial r}(rF_{\\phi})-\\frac{\\partial F_r}{\\partial\\phi}\\right)',
    symbols:['\\nabla\\times','\\hat{r}','\\hat{\\phi}','\\hat{z}','\\partial','r','\\phi','z'],
    note:'圆柱坐标旋度三分量' },

  { id:'v-sph-grad', cat:'vector', title:'梯度（球坐标）',
    latex:'\\nabla\\varphi=\\hat{r}\\frac{\\partial\\varphi}{\\partial r}+\\hat{\\theta}\\frac{1}{r}\\frac{\\partial\\varphi}{\\partial\\theta}+\\hat{\\phi}\\frac{1}{r\\sin\\theta}\\frac{\\partial\\varphi}{\\partial\\phi}',
    symbols:['\\nabla','\\varphi','\\hat{r}','\\partial','r','\\hat{\\theta}','\\theta','\\hat{\\phi}','\\phi'],
    note:'球坐标 (r,θ,φ)，φ 分量含 1/(r·sinθ)' },

  { id:'v-sph-div', cat:'vector', title:'散度（球坐标）',
    latex:'\\nabla\\cdot\\mathbf{F}=\\frac{1}{r^2}\\frac{\\partial}{\\partial r}(r^2F_r)+\\frac{1}{r\\sin\\theta}\\frac{\\partial}{\\partial\\theta}(\\sin\\theta\\,F_{\\theta})+\\frac{1}{r\\sin\\theta}\\frac{\\partial F_{\\phi}}{\\partial\\phi}',
    symbols:['\\nabla\\cdot','\\partial','r','\\theta','\\phi'],
    note:'球坐标散度，r 分量含 1/r²·∂(r²F_r)/∂r' },

  { id:'v-sph-curl', cat:'vector', title:'旋度（球坐标，z 分量）',
    latex:'(\\nabla\\times\\mathbf{F})_r=\\frac{1}{r\\sin\\theta}\\!\\left[\\frac{\\partial}{\\partial\\theta}(\\sin\\theta\\,F_{\\phi})-\\frac{\\partial F_{\\theta}}{\\partial\\phi}\\right]',
    symbols:['\\nabla\\times','\\partial','r','\\theta','\\phi'],
    note:'球坐标旋度的 r 分量（θ、φ 分量结构类似，对称记忆）' },

  /* ============== 第 2 章 静电场 static-e ============== */
  { id:'se-coulomb', cat:'static-e', title:'库仑定律',
    latex:'\\mathbf{F}=\\frac{q_1 q_2}{4\\pi\\varepsilon_0 r^2}\\hat{r}',
    symbols:['F','\\varepsilon_0','r','\\hat{r}','q'],
    note:'真空中两点电荷间作用力，沿连线方向；同号斥、异号吸' },

  { id:'se-e-point', cat:'static-e', title:'电场强度（点电荷）',
    latex:'\\mathbf{E}=\\frac{q}{4\\pi\\varepsilon r^2}\\hat{r}',
    symbols:['E','q','\\varepsilon','r','\\hat{r}'],
    note:'点电荷在 r 处产生的电场；正电荷指向外，负电荷指向内' },

  { id:'se-d-const', cat:'static-e', title:'电位移与本构关系',
    latex:'\\mathbf{D}=\\varepsilon\\mathbf{E}=\\varepsilon_0\\varepsilon_r\\mathbf{E}',
    symbols:['D','\\varepsilon','E','\\varepsilon_0','\\varepsilon_r'],
    note:'D 只与自由电荷有关，E 还受极化影响；εᵣ 为相对介电常数' },

  { id:'se-gauss-int', cat:'static-e', title:'高斯定理（积分形式）',
    latex:'\\oint_{S}\\mathbf{D}\\cdot d\\mathbf{S}=Q=\\int_{V}\\rho\\,dV',
    symbols:['\\oint','S','D','dS','Q','\\int','V','\\rho','dV'],
    note:'穿过任一闭合面的电通量等于面内总自由电荷' },

  { id:'se-gauss-diff', cat:'static-e', title:'高斯定理（微分形式）',
    latex:'\\nabla\\cdot\\mathbf{D}=\\rho',
    symbols:['\\nabla\\cdot','D','\\rho'],
    note:'电位移散度等于该点自由电荷体密度（静电场基本方程之一）' },

  { id:'se-pot-def', cat:'static-e', title:'电位定义',
    latex:'\\mathbf{E}=-\\nabla\\varphi',
    symbols:['E','\\nabla','\\varphi'],
    note:'电场等于电位负梯度；静电场无旋，故可引入标量电位' },

  { id:'se-pot-point', cat:'static-e', title:'点电荷电位',
    latex:'\\varphi=\\frac{q}{4\\pi\\varepsilon r}',
    symbols:['\\varphi','q','\\varepsilon','r'],
    note:'取无穷远为电位参考点（φ(∞)=0）' },

  { id:'se-poisson', cat:'static-e', title:'泊松方程',
    latex:'\\nabla^2\\varphi=-\\frac{\\rho}{\\varepsilon}',
    symbols:['\\nabla^2','\\varphi','\\rho','\\varepsilon'],
    note:'有源区电位满足的微分方程' },

  { id:'se-laplace', cat:'static-e', title:'拉普拉斯方程',
    latex:'\\nabla^2\\varphi=0',
    symbols:['\\nabla^2','\\varphi'],
    note:'无源区(ρ=0)电位满足的方程；边值问题的核心' },

  { id:'se-dipole-p', cat:'static-e', title:'电偶极矩',
    latex:'\\mathbf{p}=q\\mathbf{l}',
    symbols:['p','q','l'],
    note:'电偶极子 p=ql，方向由 −q 指向 +q' },

  { id:'se-dipole-pot', cat:'static-e', title:'电偶极子电位',
    latex:'\\varphi=\\frac{p\\cos\\theta}{4\\pi\\varepsilon r^2}',
    symbols:['\\varphi','p','\\theta','\\varepsilon','r'],
    note:'远区电位按 1/r² 衰减，比点电荷(1/r)更快' },

  { id:'se-energy', cat:'static-e', title:'电场能量',
    latex:'W_e=\\frac{1}{2}\\int_{V}\\mathbf{D}\\cdot\\mathbf{E}\\,dV',
    symbols:['W_e','\\int','V','D','E','dV'],
    note:'静电场总储能，积分遍及场存在的全部区域' },

  { id:'se-energy-density', cat:'static-e', title:'电场能量密度',
    latex:'w_e=\\frac{1}{2}\\mathbf{D}\\cdot\\mathbf{E}=\\frac{1}{2}\\varepsilon E^2',
    symbols:['w_e','D','E','\\varepsilon'],
    note:'单位体积电场储能，W_e=∫w_e dV' },

  { id:'se-capacitance', cat:'static-e', title:'电容',
    latex:'C=\\frac{Q}{U}',
    symbols:['C','Q','U'],
    note:'电容仅与导体几何形状及介质有关，与电荷、电压无关' },

  { id:'se-bc-d', cat:'static-e', title:'边界条件：法向 D',
    latex:'D_{1n}-D_{2n}=\\rho_s\\quad(\\text{无面电荷则 }D_{1n}=D_{2n})',
    symbols:['D','\\rho_s','\\hat{n}'],
    note:'分界面两侧电位移法向分量之差等于面电荷密度' },

  { id:'se-bc-e', cat:'static-e', title:'边界条件：切向 E',
    latex:'E_{1t}=E_{2t}',
    symbols:['E'],
    note:'分界面两侧电场切向分量连续（静电场无旋的直接结果）' },

  /* ============== 第 3 章 恒定电场 steady-e ============== */
  { id:'st-current-density', cat:'steady-e', title:'电流密度',
    latex:'\\mathbf{J}=\\rho\\mathbf{v}',
    symbols:['J','\\rho','v'],
    note:'体电流密度 = 电荷密度 × 运动速度；方向为正电荷运动方向' },

  { id:'st-ohm', cat:'steady-e', title:'欧姆定律（微分形式）',
    latex:'\\mathbf{J}=\\sigma\\mathbf{E}',
    symbols:['J','\\sigma','E'],
    note:'导体中电流密度与电场成正比，σ 为电导率' },

  { id:'st-current', cat:'steady-e', title:'电流（积分关系）',
    latex:'I=\\int_{S}\\mathbf{J}\\cdot d\\mathbf{S}',
    symbols:['I','\\int','S','J','dS'],
    note:'穿过某截面的电流等于电流密度的通量' },

  { id:'st-joule-p', cat:'steady-e', title:'焦耳定律（功率密度）',
    latex:'p=\\mathbf{J}\\cdot\\mathbf{E}=\\sigma E^2',
    symbols:['p','J','E','\\sigma'],
    note:'单位体积损耗的焦耳热功率' },

  { id:'st-joule-pwr', cat:'steady-e', title:'焦耳总功率',
    latex:'P=\\int_{V}\\mathbf{J}\\cdot\\mathbf{E}\\,dV',
    symbols:['P','\\int','V','J','E','dV'],
    note:'导体区域总焦耳热损耗' },

  { id:'st-continuity', cat:'steady-e', title:'电流连续性方程',
    latex:'\\nabla\\cdot\\mathbf{J}=-\\frac{\\partial\\rho}{\\partial t}',
    symbols:['\\nabla\\cdot','J','\\partial','\\rho','t'],
    note:'电荷守恒定律的微分形式；恒定电流时 ∂ρ/∂t=0 即 ∇·J=0' },

  { id:'st-steady-eq1', cat:'steady-e', title:'恒定电场方程（电流连续）',
    latex:'\\oint_{S}\\mathbf{J}\\cdot d\\mathbf{S}=0',
    symbols:['\\oint','S','J','dS'],
    note:'恒定电流管内无电荷堆积，流入等于流出' },

  { id:'st-steady-eq2', cat:'steady-e', title:'恒定电场方程（保守）',
    latex:'\\oint_{l}\\mathbf{E}\\cdot d\\mathbf{l}=0',
    symbols:['\\oint','E','dl'],
    note:'恒定电场无旋（管外电源区域）' },

  { id:'st-bc-j', cat:'steady-e', title:'边界条件：法向电流',
    latex:'J_{1n}=J_{2n}\\;\\Leftrightarrow\\;\\sigma_1 E_{1n}=\\sigma_2 E_{2n}',
    symbols:['J','\\sigma','E','\\hat{n}'],
    note:'分界面两侧电流密度法向分量连续（无电荷堆积时）' },

  { id:'st-bc-e', cat:'steady-e', title:'边界条件：切向 E',
    latex:'E_{1t}=E_{2t}',
    symbols:['E'],
    note:'分界面两侧电场切向分量连续' },

  { id:'st-emf', cat:'steady-e', title:'电动势',
    latex:'\\mathcal{E}=\\oint_{l}\\mathbf{E}_{\\text{非}}\\cdot d\\mathbf{l}',
    symbols:['\\oint','E','dl'],
    note:'非保守（非静电）场沿闭合路径的线积分，维持恒定电流' },

  /* ============== 第 4 章 恒定磁场 static-m ============== */
  { id:'sm-flux-cont-int', cat:'static-m', title:'磁通连续性（积分形式）',
    latex:'\\oint_{S}\\mathbf{B}\\cdot d\\mathbf{S}=0',
    symbols:['\\oint','S','B','dS'],
    note:'穿过任一闭合面磁通为零——磁荷不存在，磁力线闭合' },

  { id:'sm-flux-cont-diff', cat:'static-m', title:'磁通连续性（微分形式）',
    latex:'\\nabla\\cdot\\mathbf{B}=0',
    symbols:['\\nabla\\cdot','B'],
    note:'磁感应强度无散（磁场基本方程之一）' },

  { id:'sm-biot-savart', cat:'static-m', title:'毕奥-萨伐尔定律',
    latex:'\\mathbf{B}=\\frac{\\mu I}{4\\pi}\\oint_{l}\\frac{d\\mathbf{l}\\times\\hat{r}}{r^2}',
    symbols:['B','\\mu','I','\\oint','l','dl','\\hat{r}','r'],
    note:'电流元产生磁场的积分式；方向由右手定则判定' },

  { id:'sm-b-const', cat:'static-m', title:'磁场强度与本构关系',
    latex:'\\mathbf{B}=\\mu\\mathbf{H}=\\mu_0\\mu_r\\mathbf{H}',
    symbols:['B','\\mu','H','\\mu_0','\\mu_r'],
    note:'B 与介质磁化有关，H 只与自由电流有关；μᵣ 为相对磁导率' },

  { id:'sm-ampere-int', cat:'static-m', title:'安培环路定律（积分形式）',
    latex:'\\oint_{l}\\mathbf{H}\\cdot d\\mathbf{l}=I=\\int_{S}\\mathbf{J}\\cdot d\\mathbf{S}',
    symbols:['\\oint','l','H','dl','I','\\int','S','J','dS'],
    note:'磁场强度沿闭合路径环量等于路径包围的总传导电流' },

  { id:'sm-ampere-diff', cat:'static-m', title:'安培环路定律（微分形式）',
    latex:'\\nabla\\times\\mathbf{H}=\\mathbf{J}',
    symbols:['\\nabla\\times','H','J'],
    note:'恒定磁场旋度等于传导电流密度（磁场基本方程之一）' },

  { id:'sm-vector-pot', cat:'static-m', title:'矢量磁位定义',
    latex:'\\mathbf{B}=\\nabla\\times\\mathbf{A}',
    symbols:['B','\\nabla\\times','A'],
    note:'因 ∇·B=0，B 可表为某矢量 A 的旋度；库仑规范 ∇·A=0' },

  { id:'sm-vector-pot-eq', cat:'static-m', title:'矢量磁位的泊松方程',
    latex:'\\nabla^2\\mathbf{A}=-\\mu\\mathbf{J}',
    symbols:['\\nabla^2','A','\\mu','J'],
    note:'库仑规范下矢量磁位满足的方程（类比静电泊松方程）' },

  { id:'sm-flux', cat:'static-m', title:'磁通量',
    latex:'\\Phi=\\int_{S}\\mathbf{B}\\cdot d\\mathbf{S}=\\oint_{l}\\mathbf{A}\\cdot d\\mathbf{l}',
    symbols:['\\Phi','\\int','S','B','dS','\\oint','l','A','dl'],
    note:'磁通等于 B 的面积分，亦等于矢量磁位的环路积分' },

  { id:'sm-lorentz', cat:'static-m', title:'洛伦兹力',
    latex:'\\mathbf{F}=q\\mathbf{v}\\times\\mathbf{B}',
    symbols:['F','q','v','B'],
    note:'运动电荷在磁场中所受力，方向由 v×B 判定' },

  { id:'sm-bc-b', cat:'static-m', title:'边界条件：法向 B',
    latex:'B_{1n}=B_{2n}',
    symbols:['B','\\hat{n}'],
    note:'分界面两侧磁感应法向分量连续（磁通连续的结果）' },

  { id:'sm-bc-h', cat:'static-m', title:'边界条件：切向 H',
    latex:'H_{1t}-H_{2t}=J_s\\quad(\\text{无面电流则 }H_{1t}=H_{2t})',
    symbols:['H','J_s'],
    note:'分界面两侧磁场切向分量之差等于面电流密度' },

  { id:'sm-self-ind', cat:'static-m', title:'自感',
    latex:'L=\\frac{\\Phi}{I}',
    symbols:['L','\\Phi','I'],
    note:'自感仅与线圈几何及磁介质有关；磁链 ψ=NΦ 时 L=ψ/I' },

  { id:'sm-mutual-ind', cat:'static-m', title:'互感',
    latex:'M=\\frac{\\Phi_{21}}{I_1}',
    symbols:['M','\\Phi','I'],
    note:'回路1电流在回路2产生的磁链与 I₁ 之比；恒有 M₁₂=M₂₁' },

  { id:'sm-energy', cat:'static-m', title:'磁场能量',
    latex:'W_m=\\frac{1}{2}\\int_{V}\\mathbf{B}\\cdot\\mathbf{H}\\,dV',
    symbols:['W_m','\\int','V','B','H','dV'],
    note:'恒定磁场总储能，积分遍及磁场存在的全部区域' },

  { id:'sm-energy-density', cat:'static-m', title:'磁场能量密度',
    latex:'w_m=\\frac{1}{2}\\mathbf{B}\\cdot\\mathbf{H}=\\frac{B^2}{2\\mu}',
    symbols:['w_m','B','H','\\mu'],
    note:'单位体积磁场储能，W_m=∫w_m dV' },

  { id:'sm-dipole-m', cat:'static-m', title:'磁偶极矩',
    latex:'\\mathbf{m}=I\\mathbf{S}',
    symbols:['m','I','S'],
    note:'小电流环的磁偶极矩 m=IS，方向由右手定则（环面法向）' },

  /* ============== 第 5 章 时变电磁场 time-varying ============== */
  { id:'tv-faraday-int', cat:'time-varying', title:'法拉第电磁感应定律（麦克斯韦方程·积分②）',
    latex:'\\oint_{l}\\mathbf{E}\\cdot d\\mathbf{l}=-\\frac{d\\Phi}{dt}',
    symbols:['\\oint','l','E','dl','\\Phi','t'],
    note:'变化的磁通在闭合回路感生电动势；负号为楞次定律方向。此即麦氏方程组积分形式第二条' },

  { id:'tv-displacement', cat:'time-varying', title:'位移电流密度',
    latex:'\\mathbf{J}_d=\\frac{\\partial\\mathbf{D}}{\\partial t}',
    symbols:['J_d','\\partial','D','t'],
    note:'麦克斯韦重要贡献：变化的电场等效一种电流' },

  { id:'tv-ampere-int', cat:'time-varying', title:'全电流定律（麦克斯韦方程·积分①）',
    latex:'\\oint_{l}\\mathbf{H}\\cdot d\\mathbf{l}=\\int_{S}\\!\\left(\\mathbf{J}+\\frac{\\partial\\mathbf{D}}{\\partial t}\\right)\\!\\cdot d\\mathbf{S}',
    symbols:['\\oint','l','H','dl','\\int','S','J','\\partial','D','t','dS'],
    note:'传导电流与位移电流共同构成磁场的涡旋源。此即麦氏方程组积分形式第一条' },

  { id:'tv-mx-d1', cat:'time-varying', title:'麦克斯韦方程组·微分①（全电流定律）',
    latex:'\\nabla\\times\\mathbf{H}=\\mathbf{J}+\\frac{\\partial\\mathbf{D}}{\\partial t}',
    symbols:['\\nabla\\times','H','J','\\partial','D','t'],
    note:'安培定律加入位移电流项后对时变场成立' },

  { id:'tv-mx-d2', cat:'time-varying', title:'麦克斯韦方程组·微分②（电磁感应）',
    latex:'\\nabla\\times\\mathbf{E}=-\\frac{\\partial\\mathbf{B}}{\\partial t}',
    symbols:['\\nabla\\times','E','\\partial','B','t'],
    note:'变化的磁场激发涡旋电场' },

  { id:'tv-mx-d3', cat:'time-varying', title:'麦克斯韦方程组·微分③（高斯定理）',
    latex:'\\nabla\\cdot\\mathbf{D}=\\rho',
    symbols:['\\nabla\\cdot','D','\\rho'],
    note:'电通量源于自由电荷' },

  { id:'tv-mx-d4', cat:'time-varying', title:'麦克斯韦方程组·微分④（磁通连续）',
    latex:'\\nabla\\cdot\\mathbf{B}=0',
    symbols:['\\nabla\\cdot','B'],
    note:'磁荷不存在，磁力线闭合' },

  { id:'tv-mx-i3', cat:'time-varying', title:'麦克斯韦方程组·积分③（高斯定理）',
    latex:'\\oint_{S}\\mathbf{D}\\cdot d\\mathbf{S}=\\int_{V}\\rho\\,dV',
    symbols:['\\oint','S','D','dS','\\int','V','\\rho','dV'],
    note:'闭合面电通量等于面内总自由电荷' },

  { id:'tv-mx-i4', cat:'time-varying', title:'麦克斯韦方程组·积分④（磁通连续）',
    latex:'\\oint_{S}\\mathbf{B}\\cdot d\\mathbf{S}=0',
    symbols:['\\oint','S','B','dS'],
    note:'穿过任一闭合面磁通恒为零' },

  { id:'tv-const', cat:'time-varying', title:'本构关系（介质特性）',
    latex:'\\mathbf{D}=\\varepsilon\\mathbf{E},\\quad\\mathbf{B}=\\mu\\mathbf{H},\\quad\\mathbf{J}=\\sigma\\mathbf{E}',
    symbols:['D','\\varepsilon','E','B','\\mu','H','J','\\sigma'],
    note:'联系场量的介质方程，使麦克斯韦方程组可解' },

  { id:'tv-poynting', cat:'time-varying', title:'坡印廷矢量（瞬时）',
    latex:'\\mathbf{S}=\\mathbf{E}\\times\\mathbf{H}',
    symbols:['\\mathbf{S}','E','H'],
    note:'单位时间通过单位面积的电磁能量（能流密度），方向即传播方向' },

  { id:'tv-poynting-thm', cat:'time-varying', title:'坡印廷定理（能量守恒）',
    latex:'-\\oint_{S}(\\mathbf{E}\\times\\mathbf{H})\\cdot d\\mathbf{S}=\\frac{\\partial}{\\partial t}\\!\\int_{V}(w_e+w_m)dV+\\int_{V}\\mathbf{J}\\cdot\\mathbf{E}\\,dV',
    symbols:['\\oint','S','E','H','dS','\\partial','t','\\int','V','w_e','w_m','dV','J'],
    note:'流入闭合面净能流 = 储能增加率 + 焦耳损耗（电磁能守恒）' },

  { id:'tv-poynting-avg', cat:'time-varying', title:'复坡印廷矢量（时间平均）',
    latex:'\\mathbf{S}_{av}=\\frac{1}{2}\\,\\mathrm{Re}\\!\\left(\\dot{\\mathbf{E}}\\times\\dot{\\mathbf{H}}^{*}\\right)',
    symbols:['\\mathbf{S}','\\mathrm{Re}','E','H'],
    note:'时谐场一个周期内平均能流密度，Ė、Ḣ 为复数振幅（有效值式不含 ½）' },

  { id:'tv-wave-eq', cat:'time-varying', title:'波动方程（无源区）',
    latex:'\\nabla^2\\mathbf{E}-\\mu\\varepsilon\\frac{\\partial^2\\mathbf{E}}{\\partial t^2}=0',
    symbols:['\\nabla^2','E','\\mu','\\varepsilon','\\partial','t'],
    note:'无源、均匀各向同性媒质中电场满足的齐次波动方程（H 同形）' },

  { id:'tv-phasor1', cat:'time-varying', title:'时谐场复数形式①（全电流）',
    latex:'\\nabla\\times\\dot{\\mathbf{H}}=\\dot{\\mathbf{J}}+j\\omega\\varepsilon\\dot{\\mathbf{E}}',
    symbols:['\\nabla\\times','H','J','j','\\omega','\\varepsilon','E'],
    note:'时谐场 ∂/∂t→jω，复振幅记号上加“·”' },

  { id:'tv-phasor2', cat:'time-varying', title:'时谐场复数形式②（法拉第）',
    latex:'\\nabla\\times\\dot{\\mathbf{E}}=-j\\omega\\mu\\dot{\\mathbf{H}}',
    symbols:['\\nabla\\times','E','j','\\omega','\\mu','H'],
    note:'时谐场复数形式的法拉第定律（无源时 J=0）' },

  /* ============== 第 6 章 平面电磁波 plane-wave ============== */
  { id:'pw-uniform', cat:'plane-wave', title:'均匀平面波（瞬时式）',
    latex:'\\mathbf{E}(z,t)=\\hat{x}\\,E_m\\cos(\\omega t-\\beta z)',
    symbols:['E','z','t','\\hat{x}','E_m','\\omega','\\beta'],
    note:'沿 +z 方向传播、x 向线偏振的均匀平面波电场' },

  { id:'pw-phase-const', cat:'plane-wave', title:'相位常数',
    latex:'\\beta=\\omega\\sqrt{\\mu\\varepsilon}',
    symbols:['\\beta','\\omega','\\mu','\\varepsilon'],
    note:'单位距离相位滞后量，又称波数(无耗)，单位 rad/m' },

  { id:'pw-wavelength', cat:'plane-wave', title:'波长',
    latex:'\\lambda=\\frac{2\\pi}{\\beta}',
    symbols:['\\lambda','\\beta'],
    note:'相位差 2π 的两相邻等相面间距' },

  { id:'pw-phase-vel', cat:'plane-wave', title:'相速',
    latex:'v_p=\\frac{\\omega}{\\beta}=\\frac{1}{\\sqrt{\\mu\\varepsilon}}',
    symbols:['v_p','\\omega','\\beta','\\mu','\\varepsilon'],
    note:'等相面推进速度；真空中 v_p=c=3×10⁸ m/s' },

  { id:'pw-speed-light', cat:'plane-wave', title:'真空中电磁波速度（光速）',
    latex:'c=\\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}}\\approx 3\\times10^{8}\\,\\mathrm{m/s}',
    symbols:['c','\\mu_0','\\varepsilon_0'],
    note:'麦克斯韦理论预言电磁波速等于光速，揭示光的电磁本质' },

  { id:'pw-impedance', cat:'plane-wave', title:'本征阻抗（波阻抗）',
    latex:'\\eta=\\sqrt{\\frac{\\mu}{\\varepsilon}}',
    symbols:['\\eta','\\mu','\\varepsilon'],
    note:'均匀平面波 E 与 H 振幅之比 |E|/|H|=η' },

  { id:'pw-impedance-vac', cat:'plane-wave', title:'真空本征阻抗',
    latex:'\\eta_0=\\sqrt{\\frac{\\mu_0}{\\varepsilon_0}}\\approx 120\\pi\\approx 377\\,\\Omega',
    symbols:['\\eta_0','\\mu_0','\\varepsilon_0'],
    note:'自由空间波阻抗 ≈ 377 Ω' },

  { id:'pw-eh-rel', cat:'plane-wave', title:'E 与 H 的关系',
    latex:'\\mathbf{H}=\\frac{1}{\\eta}\\hat{k}\\times\\mathbf{E}',
    symbols:['H','\\eta','E'],
    note:'E、H、传播方向 k̂ 三者两两正交，构成右手系' },

  { id:'pw-prop-const-lossy', cat:'plane-wave', title:'有耗媒质传播常数',
    latex:'\\gamma=\\alpha+j\\beta=\\sqrt{j\\omega\\mu(\\sigma+j\\omega\\varepsilon)}',
    symbols:['\\gamma','\\alpha','\\beta','j','\\omega','\\mu','\\sigma','\\varepsilon'],
    note:'γ=α+jβ，α 衰减、β 相移；电场按 e^(−αz) 衰减' },

  { id:'pw-good-conductor', cat:'plane-wave', title:'良导体参数',
    latex:'\\alpha=\\beta=\\sqrt{\\frac{\\omega\\mu\\sigma}{2}}',
    symbols:['\\alpha','\\beta','\\omega','\\mu','\\sigma'],
    note:'良导体(σ≫ωε)中 α=β，波强烈衰减且相速极慢' },

  { id:'pw-skin', cat:'plane-wave', title:'趋肤深度',
    latex:'\\delta=\\sqrt{\\frac{2}{\\omega\\mu\\sigma}}=\\frac{1}{\\alpha}',
    symbols:['\\delta','\\omega','\\mu','\\sigma','\\alpha'],
    note:'振幅衰减到 1/e 所经距离；频率越高趋肤越浅' },

  { id:'pw-reflect', cat:'plane-wave', title:'垂直入射反射系数',
    latex:'\\Gamma=\\frac{\\eta_2-\\eta_1}{\\eta_2+\\eta_1}',
    symbols:['\\Gamma','\\eta'],
    note:'界面处反射波与入射波电场之比；η₁=η₂ 时无反射(匹配)' },

  { id:'pw-transmit', cat:'plane-wave', title:'垂直入射透射系数',
    latex:'\\tau=\\frac{2\\eta_2}{\\eta_2+\\eta_1}=1+\\Gamma',
    symbols:['\\tau','\\eta','\\Gamma'],
    note:'界面处透射波与入射波电场之比；恒有 τ=1+Γ' },

  { id:'pw-vswr', cat:'plane-wave', title:'驻波比',
    latex:'\\mathrm{VSWR}=\\frac{1+|\\Gamma|}{1-|\\Gamma|}',
    symbols:['\\mathrm{VSWR}','\\Gamma'],
    note:'驻波最大值与最小值之比；全反射时 →∞，完全匹配时 =1' },

  { id:'pw-polarization', cat:'plane-wave', title:'极化判据（圆极化条件）',
    latex:'E_x=E_m,\\;E_y=jE_m\\;\\Rightarrow\\;\\text{圆极化}',
    symbols:['E','E_m','j'],
    note:'两正交分量等幅、相位差 ±90°→圆；不等幅→椭圆；同相→线' },

  /* ============== 第 7 章 导行电磁波 waveguide ============== */
  { id:'wg-telegrapher1', cat:'waveguide', title:'电报方程①（电压）',
    latex:'\\frac{\\partial U}{\\partial z}=-(R+j\\omega L)\\,I',
    symbols:['\\partial','U','z','R','j','\\omega','L','I'],
    note:'传输线单位长串联阻抗上的电压降（复数/相量形式）' },

  { id:'wg-telegrapher2', cat:'waveguide', title:'电报方程②（电流）',
    latex:'\\frac{\\partial I}{\\partial z}=-(G+j\\omega C)\\,U',
    symbols:['\\partial','I','z','G','j','\\omega','C','U'],
    note:'传输线单位长并联导纳上的电流分流（复数/相量形式）' },

  { id:'wg-z0', cat:'waveguide', title:'特性阻抗（一般）',
    latex:'Z_0=\\sqrt{\\frac{R+j\\omega L}{G+j\\omega C}}',
    symbols:['Z_0','R','j','\\omega','L','G','C'],
    note:'行波状态下沿线电压/电流之比，仅取决于分布参数' },

  { id:'wg-gamma', cat:'waveguide', title:'传输线传播常数（一般）',
    latex:'\\gamma=\\sqrt{(R+j\\omega L)(G+j\\omega C)}=\\alpha+j\\beta',
    symbols:['\\gamma','R','j','\\omega','L','G','C','\\alpha','\\beta'],
    note:'γ=α+jβ，α 衰减、β 相移' },

  { id:'wg-z0-lossless', cat:'waveguide', title:'无耗传输线',
    latex:'Z_0=\\sqrt{\\frac{L}{C}},\\quad\\gamma=j\\omega\\sqrt{LC}',
    symbols:['Z_0','L','C','\\gamma','j','\\omega'],
    note:'R=G=0 时 Z₀ 为实数、γ 纯虚（只相移不衰减）' },

  { id:'wg-cutoff-f', cat:'waveguide', title:'矩形波导截止频率',
    latex:'f_c=\\frac{1}{2\\sqrt{\\mu\\varepsilon}}\\sqrt{\\left(\\frac{m}{a}\\right)^{2}+\\left(\\frac{n}{b}\\right)^{2}}',
    symbols:['f_c','\\mu','\\varepsilon','m','n','a','b'],
    note:'TE/TM 模(m,n)的截止频率；a、b 为波导宽、窄边' },

  { id:'wg-cutoff-lambda', cat:'waveguide', title:'截止波长',
    latex:'\\lambda_c=\\frac{v}{f_c}=\\frac{2}{\\sqrt{(m/a)^{2}+(n/b)^{2}}}',
    symbols:['\\lambda_c','v_p','f_c','m','n','a','b'],
    note:'仅 f>f_c（λ<λ_c）的波才能在波导中传播（高通特性）' },

  { id:'wg-guide-lambda', cat:'waveguide', title:'波导波长',
    latex:'\\lambda_g=\\frac{\\lambda}{\\sqrt{1-(f_c/f)^{2}}}',
    symbols:['\\lambda_g','\\lambda','f_c','f'],
    note:'导行波沿轴向的波长，恒大于自由空间波长 λ' },

  { id:'wg-phase-vel', cat:'waveguide', title:'波导相速与群速',
    latex:'v_p=\\frac{v}{\\sqrt{1-(f_c/f)^{2}}},\\quad v_g=v\\sqrt{1-(f_c/f)^{2}},\\quad v_pv_g=v^{2}',
    symbols:['v_p','v_g','f_c','f'],
    note:'波导中相速 >c、群速 <c，二者乘积等于 v²（能量以群速传播）' },

  { id:'wg-resonator', cat:'waveguide', title:'矩形谐振腔谐振频率',
    latex:'f_{mnp}=\\frac{1}{2\\sqrt{\\mu\\varepsilon}}\\sqrt{\\left(\\frac{m}{a}\\right)^{2}+\\left(\\frac{n}{b}\\right)^{2}+\\left(\\frac{p}{d}\\right)^{2}}',
    symbols:['f','\\mu','\\varepsilon','m','n','a','b','d'],
    note:'腔体长宽高 a、b、d；m,n,p 为半波数，最低模常为 TE₁₀₁' },

  /* ============== 第 8 章 电磁波辐射 radiation ============== */
  { id:'rad-retarded', cat:'radiation', title:'滞后位（推迟位）概念',
    latex:'\\dot{\\mathbf{A}}(\\mathbf{r})=\\frac{\\mu}{4\\pi}\\int_{V}\\frac{\\dot{\\mathbf{J}}\\,e^{-jkr}}{r}\\,dV',
    symbols:['A','\\mu','\\int','V','J','r','k','j','dV'],
    note:'源对场的影响以有限光速传播，相位滞后 e^(−jkr)；r 为源到场点距离' },

  { id:'rad-dipole-far', cat:'radiation', title:'赫兹偶极子远区辐射场',
    latex:'\\dot{E}_{\\theta}=j\\eta\\frac{kI_0 l}{4\\pi r}\\sin\\theta\\,e^{-jkr},\\quad \\dot{H}_{\\phi}=\\frac{\\dot{E}_{\\theta}}{\\eta}',
    symbols:['E','\\eta','k','I_0','l','r','\\theta','j','H','\\phi'],
    note:'短偶极子(l≪λ)远区场：E_θ 与 H_φ 同相、互相垂直、含 sinθ 方向因子' },

  { id:'rad-power', cat:'radiation', title:'赫兹偶极子辐射功率',
    latex:'P=40\\pi^{2}\\!\\left(\\frac{I_0 l}{\\lambda}\\right)^{2}',
    symbols:['P','I_0','l','\\lambda'],
    note:'I₀ 为电流幅值（峰值）；由坡印廷矢量在远区球面积分得到' },

  { id:'rad-resistance', cat:'radiation', title:'赫兹偶极子辐射电阻',
    latex:'R_r=80\\pi^{2}\\!\\left(\\frac{l}{\\lambda}\\right)^{2}',
    symbols:['R_r','l','\\lambda'],
    note:'辐射电阻表征天线辐射能力；R_r=P/(½I₀²)，l≪λ 时很小' },

  { id:'rad-halfwave', cat:'radiation', title:'半波振子辐射电阻',
    latex:'R_r\\approx 73\\,\\Omega\\quad(2l=\\lambda/2)',
    symbols:['R_r','\\lambda','l'],
    note:'半波对称振子辐射电阻约 73 Ω（工程常用基准天线）' },

  { id:'rad-gain', cat:'radiation', title:'方向性与增益',
    latex:'D=\\frac{4\\pi}{\\Omega_A},\\quad G=\\eta_{a}D',
    symbols:['D','G'],
    note:'D 方向性系数(Ω_A 为波束立体角)，G 增益 = 效率 ηₐ × 方向性' },

  { id:'rad-effective-area', cat:'radiation', title:'有效面积与方向性关系',
    latex:'A_e=\\frac{\\lambda^{2}}{4\\pi}\\,D',
    symbols:['A_e','\\lambda','D'],
    note:'接收天线有效面积与方向性系数成反比关系（适用任意天线）' },
];

/* ---- 3. 符号定义字典 ---------------------------------------------------- */
export const FIELDS_SYMBOLS: SymbolDict = {
  /* —— 算子 —— */
  '\\nabla':         { name:'梯度算子 ∇',    desc:'哈密顿算子(nabla)，作用于标量场得梯度矢量', unit:'1/m' },
  '\\nabla\\cdot':   { name:'散度算子 ∇·',   desc:'作用于矢量场得标量，量度通量源强度', unit:'−' },
  '\\nabla\\times':  { name:'旋度算子 ∇×',   desc:'作用于矢量场得矢量，量度涡旋源强度', unit:'−' },
  '\\nabla^2':       { name:'拉普拉斯算子 ∇²', desc:'∇·∇，标量场二阶空间导数之和', unit:'1/m²' },
  '\\partial':       { name:'偏导 ∂',         desc:'多元函数对某变量求偏导数', unit:'−' },
  '\\oint':          { name:'闭合积分 ∮',     desc:'沿闭合曲线或闭合曲面的积分', unit:'−' },
  '\\int':           { name:'积分 ∫',         desc:'定/体/面积分符号', unit:'−' },

  /* —— 场量（矢量）—— */
  'E':               { name:'电场强度',       desc:'单位试探电荷所受电场力；矢量分析中亦泛指矢量场分量', unit:'V/m' },
  'D':               { name:'电位移矢量',     desc:'D=εE，与介质无关的辅助电场量；辐射章亦表方向性系数 D', unit:'C/m²' },
  'B':               { name:'磁感应强度',     desc:'即磁通密度，B=μH；矢量恒等式中亦泛指矢量', unit:'T (Wb/m²)' },
  'H':               { name:'磁场强度',       desc:'与介质无关的辅助磁场量，旋度源于自由电流', unit:'A/m' },
  'A':               { name:'矢量磁位',       desc:'B=∇×A；矢量恒等式中亦泛指矢量', unit:'Wb/m (T·m)' },
  'J':               { name:'体电流密度',     desc:'单位面积传导电流，J=σE', unit:'A/m²' },
  'J_d':             { name:'位移电流密度',   desc:'J_d=∂D/∂t，变化电场等效电流', unit:'A/m²' },
  'J_s':             { name:'面电流密度',     desc:'分界面单位宽度上的电流', unit:'A/m' },
  'F':               { name:'力',             desc:'电荷/电流所受电磁力；矢量分析中泛指矢量场', unit:'N' },
  'v':               { name:'速度',           desc:'电荷运动速度', unit:'m/s' },
  '\\mathbf{S}':     { name:'坡印廷矢量',     desc:'S=E×H，瞬时电磁能流密度', unit:'W/m²' },

  /* —— 标量位 / 通量 —— */
  '\\varphi':        { name:'电位 φ',         desc:'标量电位，E=−∇φ', unit:'V' },
  '\\Phi':           { name:'磁通量 Φ',       desc:'Φ=∫B·dS', unit:'Wb' },

  /* —— 电荷 / 电流标量 —— */
  'Q':               { name:'总自由电荷',     desc:'闭合面内自由电荷代数和', unit:'C' },
  'q':               { name:'点电荷',         desc:'试探电荷或源点电荷量', unit:'C' },
  'I':               { name:'电流',           desc:'传导电流（标量）', unit:'A' },
  'I_0':             { name:'电流幅值',       desc:'时谐电流的振幅(峰值)', unit:'A' },
  'E_m':             { name:'场振幅',         desc:'电场强度峰值', unit:'V/m' },

  /* —— 源密度 —— */
  '\\rho':           { name:'体电荷密度',     desc:'单位体积自由电荷', unit:'C/m³' },
  '\\rho_s':         { name:'面电荷密度',     desc:'分界面单位面积电荷', unit:'C/m²' },

  /* —— 介质参数 —— */
  '\\varepsilon':    { name:'介电常数',       desc:'ε=ε₀εᵣ，媒质电容率', unit:'F/m' },
  '\\varepsilon_0':  { name:'真空介电常数',   desc:'ε₀≈8.854×10⁻¹² F/m', unit:'F/m' },
  '\\varepsilon_r':  { name:'相对介电常数',   desc:'εᵣ=ε/ε₀，无量纲', unit:'−' },
  '\\mu':            { name:'磁导率',         desc:'μ=μ₀μᵣ，媒质磁导率', unit:'H/m' },
  '\\mu_0':          { name:'真空磁导率',     desc:'μ₀=4π×10⁻⁷ H/m', unit:'H/m' },
  '\\mu_r':          { name:'相对磁导率',     desc:'μᵣ=μ/μ₀，无量纲', unit:'−' },
  '\\sigma':         { name:'电导率',         desc:'σ 越大导电越好；良导体 σ≫ωε', unit:'S/m' },

  /* —— 能量 / 电路参量 —— */
  'p':               { name:'功率密度 / 偶极矩', desc:'焦耳功率密度 p=J·E；亦表电偶极矩 p=ql', unit:'W/m³ 或 C·m' },
  'P':               { name:'功率',           desc:'总(辐射/焦耳)功率', unit:'W' },
  'W_e':             { name:'电场能量',       desc:'静电场总储能', unit:'J' },
  'W_m':             { name:'磁场能量',       desc:'恒定磁场总储能', unit:'J' },
  'w_e':             { name:'电场能量密度',   desc:'w_e=½D·E', unit:'J/m³' },
  'w_m':             { name:'磁场能量密度',   desc:'w_m=½B·H', unit:'J/m³' },
  'C':               { name:'电容',           desc:'C=Q/U；传输线中为单位长电容', unit:'F (或 F/m)' },
  'L':               { name:'自感',           desc:'L=Φ/I；传输线中为单位长电感', unit:'H (或 H/m)' },
  'M':               { name:'互感',           desc:'两回路间磁耦合', unit:'H' },
  'm':               { name:'磁偶极矩 / 模式指数', desc:'电流环磁矩 m=IS；波导中为模式指数(m,n)', unit:'A·m² 或 −' },

  /* —— 波参量 —— */
  '\\beta':          { name:'相位常数',       desc:'单位距离相位滞后(β=ω√με)', unit:'rad/m' },
  '\\alpha':         { name:'衰减常数',       desc:'单位距离振幅衰减', unit:'Np/m' },
  '\\gamma':         { name:'传播常数',       desc:'γ=α+jβ', unit:'1/m' },
  'k':               { name:'波数',           desc:'k=ω√με=2π/λ（无耗即 β）', unit:'rad/m' },
  '\\eta':           { name:'本征阻抗',       desc:'媒质波阻抗 η=√(μ/ε)，|E|/|H|=η', unit:'Ω' },
  '\\eta_0':         { name:'真空波阻抗',     desc:'η₀=√(μ₀/ε₀)≈120π≈377 Ω', unit:'Ω' },
  '\\lambda':        { name:'波长',           desc:'λ=2π/β（自由空间波长）', unit:'m' },
  '\\lambda_c':      { name:'截止波长',       desc:'波导能传播的最大自由空间波长', unit:'m' },
  '\\lambda_g':      { name:'波导波长',       desc:'导行波沿轴向波长 λ_g=λ/√(1−(f_c/f)²)', unit:'m' },
  '\\omega':         { name:'角频率',         desc:'ω=2πf', unit:'rad/s' },
  'f':               { name:'频率',           desc:'时谐场振荡频率', unit:'Hz' },
  'f_c':             { name:'截止频率',       desc:'波导/谐振腔某模式能传播的最低频率', unit:'Hz' },
  'c':               { name:'光速',           desc:'真空中 c=1/√(μ₀ε₀)≈3×10⁸ m/s', unit:'m/s' },
  'v_p':             { name:'相速',           desc:'等相面推进速度', unit:'m/s' },
  'v_g':             { name:'群速',           desc:'波包/能量传播速度', unit:'m/s' },
  '\\delta':         { name:'趋肤深度',       desc:'δ=√(2/(ωμσ))，振幅衰减到 1/e 的距离', unit:'m' },
  '\\Gamma':         { name:'反射系数',       desc:'Γ=(η₂−η₁)/(η₂+η₁)，界面反射/入射电场比', unit:'−' },
  '\\tau':           { name:'透射系数',       desc:'τ=2η₂/(η₂+η₁)=1+Γ', unit:'−' },
  'Z_0':             { name:'特性阻抗',       desc:'传输线行波电压/电流比', unit:'Ω' },
  'U':               { name:'电压',           desc:'传输线沿线电压', unit:'V' },

  /* —— 天线参量 —— */
  'G':               { name:'增益 / 电导',    desc:'天线增益 G=ηₐD；传输线中为单位长并联电导', unit:'− 或 S/m' },
  'A_e':             { name:'有效面积',       desc:'接收天线等效吸波面积 A_e=λ²D/(4π)', unit:'m²' },
  'R_r':             { name:'辐射电阻',       desc:'R_r=P/(½I₀²)，表征辐射能力', unit:'Ω' },
  'R':               { name:'单位长电阻',     desc:'传输线单位长串联电阻', unit:'Ω/m' },

  /* —— 几何 / 坐标 —— */
  'S':               { name:'积分曲面',       desc:'闭合或开放积分面（∮_S、∫_S）', unit:'m²' },
  'dS':              { name:'有向面元',       desc:'dS（矢量），面积分微元', unit:'m²' },
  'V':               { name:'体积',           desc:'积分区域体积', unit:'m³' },
  'dV':              { name:'体元',           desc:'体积分微元', unit:'m³' },
  'l':               { name:'长度',           desc:'线段/偶极子长度', unit:'m' },
  'dl':              { name:'线元',           desc:'d𝐥（矢量），线积分微元', unit:'m' },
  'r':               { name:'距离 / 矢径',    desc:'源到场点距离或径向坐标', unit:'m' },
  '\\hat{r}':        { name:'径向单位向量',   desc:'指向 r 增大方向的单位矢', unit:'−' },
  'x':               { name:'x 坐标',         desc:'直角坐标分量', unit:'m' },
  'y':               { name:'y 坐标',         desc:'直角坐标分量', unit:'m' },
  'z':               { name:'z 坐标',         desc:'直角/柱坐标轴向分量', unit:'m' },
  '\\theta':         { name:'极角 θ',         desc:'球坐标极角(与 z 轴夹角)', unit:'rad' },
  '\\phi':           { name:'方位角 φ',       desc:'球/柱坐标方位角(注意：非电位)', unit:'rad' },
  't':               { name:'时间',           desc:'时间变量', unit:'s' },
  'a':               { name:'波导宽边',       desc:'矩形波导宽壁尺寸', unit:'m' },
  'b':               { name:'波导窄边',       desc:'矩形波导窄壁尺寸', unit:'m' },
  'd':               { name:'谐振腔长度',     desc:'矩形谐振腔第三维（轴向）尺寸', unit:'m' },
  'n':               { name:'模式指数 n',     desc:'波导/谐振腔模式指数(整数)', unit:'−' },
  '\\hat{n}':        { name:'法向单位向量',   desc:'分界面法线方向单位矢', unit:'−' },

  /* —— 单位向量 —— */
  '\\hat{x}':        { name:'x̂ 单位向量',     desc:'直角坐标 x 方向单位矢', unit:'−' },
  '\\hat{y}':        { name:'ŷ 单位向量',     desc:'直角坐标 y 方向单位矢', unit:'−' },
  '\\hat{z}':        { name:'ẑ 单位向量',     desc:'直角/柱坐标 z 方向单位矢', unit:'−' },
  '\\hat{\\theta}':  { name:'θ̂ 单位向量',     desc:'球坐标 θ 方向单位矢', unit:'−' },
  '\\hat{\\phi}':    { name:'φ̂ 单位向量',     desc:'球/柱坐标 φ 方向单位矢', unit:'−' },

  /* —— 复数 / 其他 —— */
  'j':               { name:'虚数单位',       desc:'j²=−1（工程记法）', unit:'−' },
  '\\mathrm{Re}':    { name:'取实部',         desc:'复数取实部运算', unit:'−' },
  '\\mathrm{VSWR}':  { name:'驻波比',         desc:'电压驻波比(VSWR)，反映匹配程度', unit:'−' },
};

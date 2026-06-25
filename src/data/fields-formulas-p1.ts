/* 公式分片 1：第 1 章 矢量分析 vector */
import type { Formula } from './types';

export const FIELDS_FORMULAS_P1: Formula[] = [

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
    note:'电位移散度等于该点自由电荷体密度（静电场基本方程之一）',
    derivation:[
      {text:'起点：高斯定理积分形式',latex:'\\oint_{S}\\mathbf{D}\\cdot d\\mathbf{S}=\\int_{V}\\rho\\,dV'},
      {text:'对左边闭合面积分应用高斯散度定理',latex:'\\oint_{S}\\mathbf{D}\\cdot d\\mathbf{S}=\\int_{V}(\\nabla\\cdot\\mathbf{D})\\,dV'},
      {text:'两式相等，被积函数必相等',latex:'\\nabla\\cdot\\mathbf{D}=\\rho'},
    ] },

  { id:'se-pot-def', cat:'static-e', title:'电位定义',
    latex:'\\mathbf{E}=-\\nabla\\varphi',
    symbols:['E','\\nabla','\\varphi'],
    note:'电场等于电位负梯度；静电场无旋，故可引入标量电位',
    derivation:[
      {text:'静电场沿任意闭合路径做功为零（保守场）',latex:'\\nabla\\times\\mathbf{E}=0'},
      {text:'矢量恒等式：标量梯度的旋度恒为零',latex:'\\nabla\\times(\\nabla\\varphi)=0'},
      {text:'故 $E$ 必可表为某标量的梯度，取负号使场指向电位降低方向',latex:'\\mathbf{E}=-\\nabla\\varphi'},
    ] },

  { id:'se-pot-point', cat:'static-e', title:'点电荷电位',
    latex:'\\varphi=\\frac{q}{4\\pi\\varepsilon r}',
    symbols:['\\varphi','q','\\varepsilon','r'],
    note:'取无穷远为电位参考点（φ(∞)=0）',
    derivation:[
      {text:'由电位定义（取无穷远 $\\varphi(\\infty)=0$）',latex:"\\varphi=-\\int_{\\infty}^{r}\\mathbf{E}\\cdot d\\mathbf{l}=\\int_{r}^{\\infty}\\mathbf{E}\\cdot d\\mathbf{l}"},
      {text:'代入点电荷电场 $E=\\frac{q}{4\\pi\\varepsilon r^2}$，沿径向积分',latex:"\\varphi=\\int_{r}^{\\infty}\\frac{q}{4\\pi\\varepsilon r'^{2}}\\,dr'"},
      {text:'计算定积分',latex:"\\varphi=\\frac{q}{4\\pi\\varepsilon}\\left[-\\frac{1}{r'}\\right]_{r}^{\\infty}=\\frac{q}{4\\pi\\varepsilon r}"},
    ] },

  { id:'se-poisson', cat:'static-e', title:'泊松方程',
    latex:'\\nabla^2\\varphi=-\\frac{\\rho}{\\varepsilon}',
    symbols:['\\nabla^2','\\varphi','\\rho','\\varepsilon'],
    note:'有源区电位满足的微分方程',
    derivation:[
      {text:'高斯定理微分形式与本构关系 $D=\\varepsilon E$ 联立',latex:'\\nabla\\cdot(\\varepsilon\\mathbf{E})=\\rho'},
      {text:'均匀介质 $\\varepsilon$ 为常数，提到散度外；代入 $E=-\\nabla\\varphi$',latex:'\\varepsilon\\,\\nabla\\cdot(-\\nabla\\varphi)=\\rho'},
      {text:'梯度的散度即拉普拉斯算子',latex:'\\nabla^2\\varphi=-\\frac{\\rho}{\\varepsilon}'},
    ] },

  { id:'se-laplace', cat:'static-e', title:'拉普拉斯方程',
    latex:'\\nabla^2\\varphi=0',
    symbols:['\\nabla^2','\\varphi'],
    note:'无源区(ρ=0)电位满足的方程；边值问题的核心',
    derivation:[
      {text:'泊松方程',latex:'\\nabla^2\\varphi=-\\frac{\\rho}{\\varepsilon}'},
      {text:'无源区域 $\\rho=0$',latex:'\\nabla^2\\varphi=0'},
    ] },

  { id:'se-dipole-p', cat:'static-e', title:'电偶极矩',
    latex:'\\mathbf{p}=q\\mathbf{l}',
    symbols:['p','q','l'],
    note:'电偶极子 p=ql，方向由 −q 指向 +q' },

  { id:'se-dipole-pot', cat:'static-e', title:'电偶极子电位',
    latex:'\\varphi=\\frac{p\\cos\\theta}{4\\pi\\varepsilon r^2}',
    symbols:['\\varphi','p','\\theta','\\varepsilon','r'],
    note:'远区电位按 1/r² 衰减，比点电荷(1/r)更快',
    derivation:[
      {text:'电偶极子由 $\\pm q$（相距 $l$）构成，远区 $P$ 点电位为两点电荷电位叠加',latex:'\\varphi=\\frac{q}{4\\pi\\varepsilon}\\!\\left(\\frac{1}{r_+}-\\frac{1}{r_-}\\right)'},
      {text:'远区近似（$r\\gg l$）：$r_+\\approx r-\\tfrac{l}{2}\\cos\\theta$，$r_-\\approx r+\\tfrac{l}{2}\\cos\\theta$',latex:'\\frac{1}{r_+}-\\frac{1}{r_-}\\approx\\frac{l\\cos\\theta}{r^2}'},
      {text:'代入电偶极矩 $p=ql$',latex:'\\varphi=\\frac{p\\cos\\theta}{4\\pi\\varepsilon r^2}'},
    ] },

  { id:'se-energy', cat:'static-e', title:'电场能量',
    latex:'W_e=\\frac{1}{2}\\int_{V}\\mathbf{D}\\cdot\\mathbf{E}\\,dV',
    symbols:['W_e','\\int','V','D','E','dV'],
    note:'静电场总储能，积分遍及场存在的全部区域' },

  { id:'se-energy-density', cat:'static-e', title:'电场能量密度',
    latex:'w_e=\\frac{1}{2}\\mathbf{D}\\cdot\\mathbf{E}=\\frac{1}{2}\\varepsilon E^2',
    symbols:['w_e','D','E','\\varepsilon'],
    note:'单位体积电场储能，W_e=∫w_e dV',
    derivation:[
      {text:'平行板电容器储能 $W=\\tfrac{1}{2}QU$，极板面积 $S$、间距 $d$',latex:'W=\\tfrac{1}{2}QU=\\tfrac{1}{2}(\\varepsilon E\\cdot S)(Ed)'},
      {text:'体积 $V=Sd$',latex:'W=\\tfrac{1}{2}\\varepsilon E^{2}\\cdot Sd'},
      {text:'除以体积得能量密度，并代入 $D=\\varepsilon E$',latex:'w_e=\\frac{W}{V}=\\tfrac{1}{2}\\varepsilon E^{2}=\\tfrac{1}{2}\\mathbf{D}\\cdot\\mathbf{E}'},
    ] },

  { id:'se-capacitance', cat:'static-e', title:'电容',
    latex:'C=\\frac{Q}{U}',
    symbols:['C','Q','U'],
    note:'电容仅与导体几何形状及介质有关，与电荷、电压无关' },

  { id:'se-bc-d', cat:'static-e', title:'边界条件：法向 D',
    latex:'D_{1n}-D_{2n}=\\rho_s\\quad(\\text{无面电荷则 }D_{1n}=D_{2n})',
    symbols:['D','\\rho_s','\\hat{n}'],
    note:'分界面两侧电位移法向分量之差等于面电荷密度',
    derivation:[
      {text:'在分界面取扁平柱形高斯面（pillbox），上下底面平行界面、面积 $S$，侧面高 $\\to 0$'},
      {text:'应用高斯定理 $\\oint\\mathbf{D}\\cdot d\\mathbf{S}=\\rho_s\\cdot S$，侧面通量趋于零',latex:'D_{1n}S-D_{2n}S=\\rho_s\\cdot S'},
      {text:'消去 $S$',latex:'D_{1n}-D_{2n}=\\rho_s'},
    ] },

  { id:'se-bc-e', cat:'static-e', title:'边界条件：切向 E',
    latex:'E_{1t}=E_{2t}',
    symbols:['E'],
    note:'分界面两侧电场切向分量连续（静电场无旋的直接结果）',
    derivation:[
      {text:'在分界面取窄矩形回路，上下边平行界面、长 $l$，侧边高 $\\to 0$'},
      {text:'静电场无旋 $\\oint\\mathbf{E}\\cdot d\\mathbf{l}=0$，侧边贡献趋于零',latex:'E_{1t}\\cdot l-E_{2t}\\cdot l=0'},
      {text:'电场切向分量连续',latex:'E_{1t}=E_{2t}'},
    ] },

];

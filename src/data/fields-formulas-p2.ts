/* 公式分片 2：第 3 章 恒定电场 steady-e */
import type { Formula } from './types';

export const FIELDS_FORMULAS_P2: Formula[] = [
  /* ============== 第 3 章 恒定电场 steady-e ============== */
  { id:'st-current-density', cat:'steady-e', title:'电流密度',
    latex:'\\mathbf{J}=\\rho\\mathbf{v}',
    symbols:['J','\\rho','v'],
    note:'体电流密度 = 电荷密度 × 运动速度；方向为正电荷运动方向' },

  { id:'st-ohm', cat:'steady-e', title:'欧姆定律（微分形式）',
    latex:'\\mathbf{J}=\\sigma\\mathbf{E}',
    symbols:['J','\\sigma','E'],
    note:'导体中电流密度与电场成正比，σ 为电导率',
    derivation:[
      {text:'一段均匀导体长 $l$、截面 $S$，电阻 $R=\\frac{l}{\\sigma S}$'},
      {text:'两端电压 $U=El$，电流 $I=JS$，代入欧姆定律 $U=IR$',latex:'El=\\frac{l}{\\sigma S}\\cdot JS'},
      {text:'消去 $l$、$S$',latex:'\\mathbf{J}=\\sigma\\mathbf{E}'},
    ] },

  { id:'st-current', cat:'steady-e', title:'电流（积分关系）',
    latex:'I=\\int_{S}\\mathbf{J}\\cdot d\\mathbf{S}',
    symbols:['I','\\int','S','J','dS'],
    note:'穿过某截面的电流等于电流密度的通量' },

  { id:'st-joule-p', cat:'steady-e', title:'焦耳定律（功率密度）',
    latex:'p=\\mathbf{J}\\cdot\\mathbf{E}=\\sigma E^2',
    symbols:['p','J','E','\\sigma'],
    note:'单位体积损耗的焦耳热功率',
    derivation:[
      {text:'一段导体体积 $V=Sl$，两端电压 $U$、电流 $I$，焦耳功率 $P=UI$'},
      {text:'功率密度 $p=P/V$，代入 $U=El$、$I=JS$',latex:'p=\\frac{UI}{Sl}=\\frac{(El)(JS)}{Sl}'},
      {text:'化简，并代入 $J=\\sigma E$',latex:'p=\\mathbf{J}\\cdot\\mathbf{E}=\\sigma E^{2}'},
    ] },

  { id:'st-joule-pwr', cat:'steady-e', title:'焦耳总功率',
    latex:'P=\\int_{V}\\mathbf{J}\\cdot\\mathbf{E}\\,dV',
    symbols:['P','\\int','V','J','E','dV'],
    note:'导体区域总焦耳热损耗' },

  { id:'st-continuity', cat:'steady-e', title:'电流连续性方程',
    latex:'\\nabla\\cdot\\mathbf{J}=-\\frac{\\partial\\rho}{\\partial t}',
    symbols:['\\nabla\\cdot','J','\\partial','\\rho','t'],
    note:'电荷守恒定律的微分形式；恒定电流时 ∂ρ/∂t=0 即 ∇·J=0',
    derivation:[
      {text:'电荷守恒：单位时间流出闭合面的电荷等于内部电荷减少率',latex:'\\oint_{S}\\mathbf{J}\\cdot d\\mathbf{S}=-\\frac{dQ}{dt}=-\\frac{d}{dt}\\int_{V}\\rho\\,dV'},
      {text:'左边用高斯散度定理',latex:'\\int_{V}(\\nabla\\cdot\\mathbf{J})\\,dV=-\\int_{V}\\frac{\\partial\\rho}{\\partial t}\\,dV'},
      {text:'对任意体积成立，被积函数相等',latex:'\\nabla\\cdot\\mathbf{J}=-\\frac{\\partial\\rho}{\\partial t}'},
    ] },

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
    note:'分界面两侧电流密度法向分量连续（无电荷堆积时）',
    derivation:[
      {text:'恒定电流时 $\\frac{\\partial\\rho}{\\partial t}=0$，连续性方程退化为 $\\nabla\\cdot\\mathbf{J}=0$ 即 $\\oint\\mathbf{J}\\cdot d\\mathbf{S}=0$'},
      {text:'分界面取 pillbox 高斯面',latex:'J_{1n}S-J_{2n}S=0'},
      {text:'电流密度法向分量连续',latex:'J_{1n}=J_{2n}'},
    ] },

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
    note:'磁感应强度无散（磁场基本方程之一）',
    derivation:[
      {text:'磁通连续性积分形式',latex:'\\oint_{S}\\mathbf{B}\\cdot d\\mathbf{S}=0'},
      {text:'左边用高斯散度定理',latex:'\\int_{V}(\\nabla\\cdot\\mathbf{B})\\,dV=0'},
      {text:'对任意体积成立',latex:'\\nabla\\cdot\\mathbf{B}=0'},
    ] },

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
    note:'恒定磁场旋度等于传导电流密度（磁场基本方程之一）',
    derivation:[
      {text:'安培环路定律积分形式',latex:'\\oint_{l}\\mathbf{H}\\cdot d\\mathbf{l}=\\int_{S}\\mathbf{J}\\cdot d\\mathbf{S}'},
      {text:'左边用斯托克斯定理',latex:'\\int_{S}(\\nabla\\times\\mathbf{H})\\cdot d\\mathbf{S}=\\int_{S}\\mathbf{J}\\cdot d\\mathbf{S}'},
      {text:'对任意曲面成立',latex:'\\nabla\\times\\mathbf{H}=\\mathbf{J}'},
    ] },

  { id:'sm-vector-pot', cat:'static-m', title:'矢量磁位定义',
    latex:'\\mathbf{B}=\\nabla\\times\\mathbf{A}',
    symbols:['B','\\nabla\\times','A'],
    note:'因 ∇·B=0，B 可表为某矢量 A 的旋度；库仑规范 ∇·A=0' },

  { id:'sm-vector-pot-eq', cat:'static-m', title:'矢量磁位的泊松方程',
    latex:'\\nabla^2\\mathbf{A}=-\\mu\\mathbf{J}',
    symbols:['\\nabla^2','A','\\mu','J'],
    note:'库仑规范下矢量磁位满足的方程（类比静电泊松方程）',
    derivation:[
      {text:'由 $\\mathbf{B}=\\nabla\\times\\mathbf{A}$ 及安培定律 $\\nabla\\times\\mathbf{H}=\\mathbf{J}$，本构 $\\mathbf{B}=\\mu\\mathbf{H}$',latex:'\\nabla\\times(\\nabla\\times\\mathbf{A})=\\mu\\mathbf{J}'},
      {text:'矢量恒等式 $\\nabla\\times(\\nabla\\times\\mathbf{A})=\\nabla(\\nabla\\cdot\\mathbf{A})-\\nabla^2\\mathbf{A}$，库仑规范 $\\nabla\\cdot\\mathbf{A}=0$',latex:'-\\nabla^2\\mathbf{A}=\\mu\\mathbf{J}'},
      {text:'整理',latex:'\\nabla^2\\mathbf{A}=-\\mu\\mathbf{J}'},
    ] },

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
    note:'分界面两侧磁感应法向分量连续（磁通连续的结果）',
    derivation:[
      {text:'磁通连续 $\\oint\\mathbf{B}\\cdot d\\mathbf{S}=0$'},
      {text:'分界面取 pillbox 高斯面',latex:'B_{1n}S-B_{2n}S=0'},
      {text:'磁感应法向分量连续',latex:'B_{1n}=B_{2n}'},
    ] },

  { id:'sm-bc-h', cat:'static-m', title:'边界条件：切向 H',
    latex:'H_{1t}-H_{2t}=J_s\\quad(\\text{无面电流则 }H_{1t}=H_{2t})',
    symbols:['H','J_s'],
    note:'分界面两侧磁场切向分量之差等于面电流密度',
    derivation:[
      {text:'安培环路定律 $\\oint\\mathbf{H}\\cdot d\\mathbf{l}=I$（包围的传导电流）'},
      {text:'分界面取矩形回路，上下边长 $l$ 平行界面',latex:'H_{1t}\\cdot l-H_{2t}\\cdot l=J_s\\cdot l'},
      {text:'磁场切向分量之差等于面电流密度',latex:'H_{1t}-H_{2t}=J_s'},
    ] },

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
    note:'单位体积磁场储能，W_m=∫w_m dV',
    derivation:[
      {text:'长直螺线管自感 $L=\\mu n^2 Sl$，电流 $I$ 时磁能 $W=\\tfrac{1}{2}LI^2$',latex:'W_m=\\tfrac{1}{2}\\mu n^{2}Sl\\cdot I^{2}'},
      {text:'体积 $V=Sl$，内部 $H=nI$',latex:'\\frac{W_m}{V}=\\tfrac{1}{2}\\mu n^{2}I^{2}'},
      {text:'代入 $B=\\mu H=\\mu nI$',latex:'w_m=\\tfrac{1}{2}\\mu H^{2}=\\frac{B^{2}}{2\\mu}=\\tfrac{1}{2}\\mathbf{B}\\cdot\\mathbf{H}'},
    ] },

  { id:'sm-dipole-m', cat:'static-m', title:'磁偶极矩',
    latex:'\\mathbf{m}=I\\mathbf{S}',
    symbols:['m','I','S'],
    note:'小电流环的磁偶极矩 m=IS，方向由右手定则（环面法向）' },

];

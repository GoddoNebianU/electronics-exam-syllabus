/* 公式分片 4：第 6 章 平面电磁波 plane-wave */
import type { Formula } from './types';

export const FIELDS_FORMULAS_P4: Formula[] = [
  /* ============== 第 6 章 平面电磁波 plane-wave ============== */
  { id:'pw-uniform', cat:'plane-wave', title:'均匀平面波（瞬时式）',
    latex:'\\mathbf{E}(z,t)=\\hat{x}\\,E_m\\cos(\\omega t-\\beta z)',
    symbols:['E','z','t','\\hat{x}','E_m','\\omega','\\beta'],
    note:'沿 +z 方向传播、x 向线偏振的均匀平面波电场' },

  { id:'pw-phase-const', cat:'plane-wave', title:'相位常数',
    latex:'\\beta=\\omega\\sqrt{\\mu\\varepsilon}',
    symbols:['\\beta','\\omega','\\mu','\\varepsilon'],
    note:'单位距离相位滞后量，又称波数(无耗)，单位 rad/m',
    derivation:[
      {text:'无源无耗波动方程 $\\nabla^2\\mathbf{E}-\\mu\\varepsilon\\frac{\\partial^2\\mathbf{E}}{\\partial t^2}=0$'},
      {text:'代入沿 $+z$ 传播的解 $E=E_m e^{j(\\omega t-\\beta z)}$'},
      {text:'解代入波动方程得色散关系',latex:'\\beta^2=\\omega^2\\mu\\varepsilon\\;\\Rightarrow\\;\\beta=\\omega\\sqrt{\\mu\\varepsilon}'},
    ] },

  { id:'pw-wavelength', cat:'plane-wave', title:'波长',
    latex:'\\lambda=\\frac{2\\pi}{\\beta}',
    symbols:['\\lambda','\\beta'],
    note:'相位差 2π 的两相邻等相面间距' },

  { id:'pw-phase-vel', cat:'plane-wave', title:'相速',
    latex:'v_p=\\frac{\\omega}{\\beta}=\\frac{1}{\\sqrt{\\mu\\varepsilon}}',
    symbols:['v_p','\\omega','\\beta','\\mu','\\varepsilon'],
    note:'等相面推进速度；真空中 v_p=c=3×10⁸ m/s',
    derivation:[
      {text:'等相面 $\\omega t-\\beta z=\\text{常数}$，对 $t$ 求导',latex:'\\omega-\\beta\\frac{dz}{dt}=0'},
      {text:'等相面速度',latex:'v_p=\\frac{dz}{dt}=\\frac{\\omega}{\\beta}'},
      {text:'代入 $\\beta=\\omega\\sqrt{\\mu\\varepsilon}$',latex:'v_p=\\frac{1}{\\sqrt{\\mu\\varepsilon}}'},
    ] },

  { id:'pw-speed-light', cat:'plane-wave', title:'真空中电磁波速度（光速）',
    latex:'c=\\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}}\\approx 3\\times10^{8}\\,\\mathrm{m/s}',
    symbols:['c','\\mu_0','\\varepsilon_0'],
    note:'麦克斯韦理论预言电磁波速等于光速，揭示光的电磁本质',
    derivation:[
      {text:'相速公式',latex:'c=\\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}}'},
      {text:'代入 $\\mu_0=4\\pi\\times10^{-7}$、$\\varepsilon_0\\approx 8.854\\times10^{-12}$'},
      {text:'数值计算',latex:'c\\approx 3\\times10^{8}\\,\\mathrm{m/s}'},
    ] },

  { id:'pw-impedance', cat:'plane-wave', title:'本征阻抗（波阻抗）',
    latex:'\\eta=\\sqrt{\\frac{\\mu}{\\varepsilon}}',
    symbols:['\\eta','\\mu','\\varepsilon'],
    note:'均匀平面波 E 与 H 振幅之比 |E|/|H|=η',
    derivation:[
      {text:'平面波 $\\tilde{E}=\\hat{x}E_0 e^{-j\\beta z}$ 代入 $\\nabla\\times\\tilde{E}=-j\\omega\\mu\\tilde{H}$'},
      {text:'由 $y$ 分量：$j\\beta E_0=-j\\omega\\mu H_y$',latex:'\\frac{|E|}{|H|}=\\frac{\\omega\\mu}{\\beta}'},
      {text:'代入 $\\beta=\\omega\\sqrt{\\mu\\varepsilon}$',latex:'\\eta=\\frac{|E|}{|H|}=\\sqrt{\\frac{\\mu}{\\varepsilon}}'},
    ] },

  { id:'pw-impedance-vac', cat:'plane-wave', title:'真空本征阻抗',
    latex:'\\eta_0=\\sqrt{\\frac{\\mu_0}{\\varepsilon_0}}\\approx 120\\pi\\approx 377\\,\\Omega',
    symbols:['\\eta_0','\\mu_0','\\varepsilon_0'],
    note:'自由空间波阻抗 ≈ 377 Ω',
    derivation:[
      {text:'波阻抗公式 $\\eta=\\sqrt{\\mu/\\varepsilon}$'},
      {text:'真空中 $\\mu=\\mu_0$、$\\varepsilon=\\varepsilon_0$',latex:'\\eta_0=\\sqrt{\\frac{\\mu_0}{\\varepsilon_0}}'},
      {text:'代入 $\\mu_0$、$\\varepsilon_0$ 数值',latex:'\\eta_0\\approx 120\\pi\\approx 377\\,\\Omega'},
    ] },

  { id:'pw-eh-rel', cat:'plane-wave', title:'E 与 H 的关系',
    latex:'\\mathbf{H}=\\frac{1}{\\eta}\\hat{k}\\times\\mathbf{E}',
    symbols:['H','\\eta','E'],
    note:'E、H、传播方向 k̂ 三者两两正交，构成右手系',
    derivation:[
      {text:'平面波 $\\tilde{E}=\\hat{x}E_0 e^{-j\\beta z}$，传播方向 $\\hat{k}=\\hat{z}$'},
      {text:'由 $\\nabla\\times\\tilde{E}=-j\\omega\\mu\\tilde{H}$ 得 $\\tilde{H}=\\hat{y}(E_0/\\eta)e^{-j\\beta z}$'},
      {text:'验证 $\\hat{y}=\\hat{z}\\times\\hat{x}=\\hat{k}\\times\\hat{x}$',latex:'\\mathbf{H}=\\frac{1}{\\eta}\\hat{k}\\times\\mathbf{E}'},
    ] },

  { id:'pw-prop-const-lossy', cat:'plane-wave', title:'有耗媒质传播常数',
    latex:'\\gamma=\\alpha+j\\beta=\\sqrt{j\\omega\\mu(\\sigma+j\\omega\\varepsilon)}',
    symbols:['\\gamma','\\alpha','\\beta','j','\\omega','\\mu','\\sigma','\\varepsilon'],
    note:'γ=α+jβ，α 衰减、β 相移；电场按 e^(−αz) 衰减',
    derivation:[
      {text:'有耗媒质复麦克斯韦方程 $\\nabla\\times\\tilde{E}=-j\\omega\\mu\\tilde{H}$，$\\nabla\\times\\tilde{H}=(\\sigma+j\\omega\\varepsilon)\\tilde{E}$'},
      {text:'消去 $\\tilde{H}$：$\\nabla\\times(\\nabla\\times\\tilde{E})=-j\\omega\\mu(\\sigma+j\\omega\\varepsilon)\\tilde{E}$，无源 $\\nabla\\cdot\\tilde{E}=0$ 故 $-\\nabla^2\\tilde{E}=-j\\omega\\mu(\\sigma+j\\omega\\varepsilon)\\tilde{E}$'},
      {text:'即 $\\nabla^2\\tilde{E}=j\\omega\\mu(\\sigma+j\\omega\\varepsilon)\\tilde{E}$，令解 $e^{-\\gamma z}$ 代入',latex:'\\gamma^2=j\\omega\\mu(\\sigma+j\\omega\\varepsilon)'},
      {text:'取平方根',latex:'\\gamma=\\alpha+j\\beta=\\sqrt{j\\omega\\mu(\\sigma+j\\omega\\varepsilon)}'},
    ] },

  { id:'pw-good-conductor', cat:'plane-wave', title:'良导体参数',
    latex:'\\alpha=\\beta=\\sqrt{\\frac{\\omega\\mu\\sigma}{2}}',
    symbols:['\\alpha','\\beta','\\omega','\\mu','\\sigma'],
    note:'良导体(σ≫ωε)中 α=β，波强烈衰减且相速极慢',
    derivation:[
      {text:'良导体条件 $\\sigma\\gg\\omega\\varepsilon$，传播常数简化 $\\gamma^2\\approx j\\omega\\mu\\sigma$'},
      {text:'因 $j=e^{j\\pi/2}$，$\\sqrt{j}=\\frac{1+j}{\\sqrt{2}}$',latex:'\\gamma=\\sqrt{\\omega\\mu\\sigma}\\cdot\\frac{1+j}{\\sqrt{2}}'},
      {text:'实部虚部相等',latex:'\\alpha=\\beta=\\sqrt{\\frac{\\omega\\mu\\sigma}{2}}'},
    ] },

  { id:'pw-skin', cat:'plane-wave', title:'趋肤深度',
    latex:'\\delta=\\sqrt{\\frac{2}{\\omega\\mu\\sigma}}=\\frac{1}{\\alpha}',
    symbols:['\\delta','\\omega','\\mu','\\sigma','\\alpha'],
    note:'振幅衰减到 1/e 所经距离；频率越高趋肤越浅',
    derivation:[
      {text:'良导体中衰减常数 $\\alpha=\\sqrt{\\omega\\mu\\sigma/2}$'},
      {text:'趋肤深度定义为振幅衰减到 $1/e$ 的距离 $\\delta=1/\\alpha$'},
      {text:'代入 $\\alpha$',latex:'\\delta=\\frac{1}{\\alpha}=\\sqrt{\\frac{2}{\\omega\\mu\\sigma}}'},
    ] },

  { id:'pw-reflect', cat:'plane-wave', title:'垂直入射反射系数',
    latex:'\\Gamma=\\frac{\\eta_2-\\eta_1}{\\eta_2+\\eta_1}',
    symbols:['\\Gamma','\\eta'],
    note:'界面处反射波与入射波电场之比；η₁=η₂ 时无反射(匹配)',
    derivation:[
      {text:'垂直入射界面 $z=0$，电场切向连续：$E_i+E_r=E_t$',latex:'1+\\Gamma=\\tau'},
      {text:'磁场切向连续（反射波 $H$ 反号）：$E_i/\\eta_1-E_r/\\eta_1=E_t/\\eta_2$',latex:'\\frac{1-\\Gamma}{\\eta_1}=\\frac{\\tau}{\\eta_2}'},
      {text:'消去 $\\tau$ 得',latex:'\\eta_2(1-\\Gamma)=\\eta_1(1+\\Gamma)'},
      {text:'解出反射系数',latex:'\\Gamma=\\frac{\\eta_2-\\eta_1}{\\eta_2+\\eta_1}'},
    ] },

  { id:'pw-transmit', cat:'plane-wave', title:'垂直入射透射系数',
    latex:'\\tau=\\frac{2\\eta_2}{\\eta_2+\\eta_1}=1+\\Gamma',
    symbols:['\\tau','\\eta','\\Gamma'],
    note:'界面处透射波与入射波电场之比；恒有 τ=1+Γ',
    derivation:[
      {text:'由界面电场连续 $E_i+E_r=E_t$',latex:'\\tau=1+\\Gamma'},
      {text:'代入 $\\Gamma=\\frac{\\eta_2-\\eta_1}{\\eta_2+\\eta_1}$',latex:'\\tau=1+\\frac{\\eta_2-\\eta_1}{\\eta_2+\\eta_1}'},
      {text:'通分',latex:'\\tau=\\frac{2\\eta_2}{\\eta_2+\\eta_1}'},
    ] },

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
    note:'行波状态下沿线电压/电流之比，仅取决于分布参数',
    derivation:[
      {text:'电报方程 $\\frac{\\partial U}{\\partial z}=-(R+j\\omega L)I$，对其求 $\\frac{\\partial}{\\partial z}$ 再代入第二式',latex:'\\frac{\\partial^2 U}{\\partial z^2}=(R+j\\omega L)(G+j\\omega C)\\,U=\\gamma^2 U'},
      {text:'行波解 $U=U^+e^{-\\gamma z}$（无反射），代回电报方程',latex:'-\\gamma U^+=-(R+j\\omega L)I'},
      {text:'得特性阻抗',latex:'Z_0=\\frac{U}{I}=\\frac{R+j\\omega L}{\\gamma}=\\sqrt{\\frac{R+j\\omega L}{G+j\\omega C}}'},
    ] },

  { id:'wg-gamma', cat:'waveguide', title:'传输线传播常数（一般）',
    latex:'\\gamma=\\sqrt{(R+j\\omega L)(G+j\\omega C)}=\\alpha+j\\beta',
    symbols:['\\gamma','R','j','\\omega','L','G','C','\\alpha','\\beta'],
    note:'γ=α+jβ，α 衰减、β 相移',
    derivation:[
      {text:'电报方程 $\\frac{\\partial U}{\\partial z}=-(R+j\\omega L)I$，$\\frac{\\partial I}{\\partial z}=-(G+j\\omega C)U$'},
      {text:'联立求导消去 $I$',latex:'\\frac{\\partial^2 U}{\\partial z^2}=(R+j\\omega L)(G+j\\omega C)\\,U'},
      {text:'令 $\\gamma^2=(R+j\\omega L)(G+j\\omega C)$',latex:'\\gamma=\\sqrt{(R+j\\omega L)(G+j\\omega C)}=\\alpha+j\\beta'},
    ] },

  { id:'wg-z0-lossless', cat:'waveguide', title:'无耗传输线',
    latex:'Z_0=\\sqrt{\\frac{L}{C}},\\quad\\gamma=j\\omega\\sqrt{LC}',
    symbols:['Z_0','L','C','\\gamma','j','\\omega'],
    note:'R=G=0 时 Z₀ 为实数、γ 纯虚（只相移不衰减）',
    derivation:[
      {text:'无耗线 $R=G=0$，代入特性阻抗',latex:'Z_0=\\sqrt{\\frac{j\\omega L}{j\\omega C}}=\\sqrt{\\frac{L}{C}}'},
      {text:'代入传播常数',latex:'\\gamma=\\sqrt{j\\omega L\\cdot j\\omega C}=\\sqrt{-\\omega^2 LC}=j\\omega\\sqrt{LC}'},
      {text:'$Z_0$ 为实数、$\\gamma$ 纯虚（$\\alpha=0$ 只相移不衰减）'},
    ] },

  { id:'wg-cutoff-f', cat:'waveguide', title:'矩形波导截止频率',
    latex:'f_c=\\frac{1}{2\\sqrt{\\mu\\varepsilon}}\\sqrt{\\left(\\frac{m}{a}\\right)^{2}+\\left(\\frac{n}{b}\\right)^{2}}',
    symbols:['f_c','\\mu','\\varepsilon','m','n','a','b'],
    note:'TE/TM 模(m,n)的截止频率；a、b 为波导宽、窄边',
    derivation:[
      {text:'波导中波数关系 $k^2=\\beta^2+k_c^2$，$k=\\omega\\sqrt{\\mu\\varepsilon}$；截止时 $\\beta=0$',latex:'\\omega_c\\sqrt{\\mu\\varepsilon}=k_c'},
      {text:'横向波数（由边界条件确定）',latex:'k_c=\\sqrt{\\left(\\frac{m\\pi}{a}\\right)^{2}+\\left(\\frac{n\\pi}{b}\\right)^{2}}'},
      {text:'解出截止频率',latex:'f_c=\\frac{1}{2\\sqrt{\\mu\\varepsilon}}\\sqrt{\\left(\\frac{m}{a}\\right)^{2}+\\left(\\frac{n}{b}\\right)^{2}}'},
    ] },

  { id:'wg-cutoff-lambda', cat:'waveguide', title:'截止波长',
    latex:'\\lambda_c=\\frac{v}{f_c}=\\frac{2}{\\sqrt{(m/a)^{2}+(n/b)^{2}}}',
    symbols:['\\lambda_c','v_p','f_c','m','n','a','b'],
    note:'仅 f>f_c（λ<λ_c）的波才能在波导中传播（高通特性）',
    derivation:[
      {text:'截止波长 $\\lambda_c=v/f_c$，$v=1/\\sqrt{\\mu\\varepsilon}$'},
      {text:'代入 $f_c$',latex:'\\lambda_c=\\frac{1/\\sqrt{\\mu\\varepsilon}}{f_c}'},
      {text:'化简',latex:'\\lambda_c=\\frac{2}{\\sqrt{(m/a)^{2}+(n/b)^{2}}}'},
    ] },

  { id:'wg-guide-lambda', cat:'waveguide', title:'波导波长',
    latex:'\\lambda_g=\\frac{\\lambda}{\\sqrt{1-(f_c/f)^{2}}}',
    symbols:['\\lambda_g','\\lambda','f_c','f'],
    note:'导行波沿轴向的波长，恒大于自由空间波长 λ',
    derivation:[
      {text:'波导轴向波数 $\\beta=\\sqrt{k^2-k_c^2}=k\\sqrt{1-(k_c/k)^2}$'},
      {text:'因 $k_c/k=f_c/f$',latex:'\\beta=k\\sqrt{1-(f_c/f)^{2}}'},
      {text:'$\\lambda_g=2\\pi/\\beta$，代入 $k=2\\pi/\\lambda$',latex:'\\lambda_g=\\frac{\\lambda}{\\sqrt{1-(f_c/f)^{2}}}'},
    ] },

  { id:'wg-phase-vel', cat:'waveguide', title:'波导相速与群速',
    latex:'v_p=\\frac{v}{\\sqrt{1-(f_c/f)^{2}}},\\quad v_g=v\\sqrt{1-(f_c/f)^{2}},\\quad v_pv_g=v^{2}',
    symbols:['v_p','v_g','f_c','f'],
    note:'波导中相速 >c、群速 <c，二者乘积等于 v²（能量以群速传播）',
    derivation:[
      {text:'波导轴向 $\\beta=k\\sqrt{1-(f_c/f)^2}$，相速 $v_p=\\omega/\\beta$',latex:'v_p=\\frac{\\omega}{k\\sqrt{1-(f_c/f)^{2}}}=\\frac{v}{\\sqrt{1-(f_c/f)^{2}}}>v'},
      {text:'群速 $v_g=d\\omega/d\\beta$（对 $\\beta=k\\sqrt{1-(f_c/f)^2}$ 求导）',latex:'v_g=v\\sqrt{1-(f_c/f)^{2}}<v'},
      {text:'二者乘积',latex:'v_p\\cdot v_g=v^{2}'},
    ] },

  { id:'wg-resonator', cat:'waveguide', title:'矩形谐振腔谐振频率',
    latex:'f_{mnp}=\\frac{1}{2\\sqrt{\\mu\\varepsilon}}\\sqrt{\\left(\\frac{m}{a}\\right)^{2}+\\left(\\frac{n}{b}\\right)^{2}+\\left(\\frac{p}{d}\\right)^{2}}',
    symbols:['f','\\mu','\\varepsilon','m','n','a','b','d'],
    note:'腔体长宽高 a、b、d；m,n,p 为半波数，最低模常为 TE₁₀₁' },

];

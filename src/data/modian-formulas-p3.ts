/* 公式分片 3：第 6 章 信号的运算与处理 op-amp ★ */
import type { Formula } from './types';

export const MODIAN_FORMULAS_P3: Formula[] = [
  /* ============== 第 6 章 信号的运算与处理 op-amp ★ ============== */
  { id:'op-inv-scale', cat:'op-amp', title:'反相比例运算',
    latex:'u_o=-\\frac{R_f}{R_1}u_i',
    symbols:['u_o','R_f','R_1','u_i'],
    note:'反相端输入，输出与输入反相，比例由外接电阻决定；同相端接地，反相端为"虚地"',
    derivation:[
      {text:'同相端接地，虚短 $\\to$ 反相端为虚地 $u_-=0$'},
      {text:'虚断：流入反相端电流为零，故流过 $R_1$ 的电流全部流过 $R_f$'},
      {text:'$i_1=u_i/R_1=(0-u_o)/R_f$'},
      {text:'整理',latex:'u_o=-\\frac{R_f}{R_1}u_i'},
    ] },

  { id:'op-noninv-scale', cat:'op-amp', title:'同相比例运算',
    latex:'u_o=\\left(1+\\frac{R_f}{R_1}\\right)u_i',
    symbols:['u_o','R_f','R_1','u_i'],
    note:'同相端输入，输出与输入同相，增益≥1；输入电阻高',
    derivation:[
      {text:'同相输入 $u_+=u_i$，虚短 $\\to u_-=u_+=u_i$'},
      {text:'虚断：反相端无电流流入，$R_1$ 与 $R_f$ 构成分压网络'},
      {text:'$u_-=u_o\\cdot R_1/(R_1+R_f)=u_i$'},
      {text:'整理',latex:'u_o=\\left(1+\\frac{R_f}{R_1}\\right)u_i'},
    ] },

  { id:'op-follower', cat:'op-amp', title:'电压跟随器',
    latex:'u_o=u_i',
    symbols:['u_o','u_i'],
    note:'同相比例 R_f=0、R_1 开路的特例，增益为 1；输入阻抗极高、输出阻抗极低，常作阻抗变换/缓冲隔离',
    derivation:[
      {text:'电压跟随器 = 同相比例运算中 $R_f=0$（输出直连反相端）'},
      {text:'代入同相比例公式 $u_o=(1+R_f/R_1)u_i$，$R_f=0$ 时',latex:'u_o=u_i'},
    ] },

  { id:'op-inv-sum', cat:'op-amp', title:'反相求和运算',
    latex:'u_o=-\\left(\\frac{R_f}{R_1}u_{i1}+\\frac{R_f}{R_2}u_{i2}\\right)',
    symbols:['u_o','R_f','R_1','u_{i1}','R_2','u_{i2}'],
    note:'多路信号在反相端汇合(虚地)实现加权求和；推广 m 路：u_o=−Σ(R_f/R_k)u_{ik}',
    derivation:[
      {text:'反相端虚地 $u_-=0$，虚断 $i_-=0$'},
      {text:'各路输入电流之和等于反馈电流',latex:'\\frac{u_{i1}}{R_1}+\\frac{u_{i2}}{R_2}=\\frac{0-u_o}{R_f}'},
      {text:'整理',latex:'u_o=-\\left(\\frac{R_f}{R_1}u_{i1}+\\frac{R_f}{R_2}u_{i2}\\right)'},
    ] },

  { id:'op-noninv-sum', cat:'op-amp', title:'同相求和运算（等权）',
    latex:'u_o=\\left(1+\\frac{R_f}{R_1}\\right)\\frac{u_{i1}+u_{i2}}{3}',
    symbols:['u_o','R_f','R_1','u_{i1}','u_{i2}'],
    note:'两路输入经相同电阻 R 接同相端、且同相端经 R 接地(三电阻相等)时的结果；推广 m 路分母为 m+1' },

  { id:'op-subtractor', cat:'op-amp', title:'减法(差动)运算',
    latex:'u_o=\\frac{R_f}{R_1}\\left(u_{i2}-u_{i1}\\right)\\quad(R_1=R_2)',
    symbols:['u_o','R_f','R_1','u_{i1}','u_{i2}'],
    note:'同相加 u_{i2}、反相加 u_{i1}，当 R_1=R_2 且反馈对称时输出正比于两输入之差',
    derivation:[
      {text:'利用叠加原理。$u_{i1}$ 单独作用（$u_{i2}=0$，同相端接地）$\\to$ 反相比例',latex:'u_{o1}=-\\frac{R_f}{R_1}u_{i1}'},
      {text:'$u_{i2}$ 单独作用（$u_{i1}=0$）$\\to$ 同相端分压后同相放大（$R_1=R_2$）',latex:'u_{o2}=\\frac{R_f}{R_1}u_{i2}'},
      {text:'叠加',latex:'u_o=u_{o1}+u_{o2}=\\frac{R_f}{R_1}(u_{i2}-u_{i1})'},
    ] },

  { id:'op-integrator', cat:'op-amp', title:'积分运算',
    latex:'u_o=-\\frac{1}{RC}\\int u_i\\,dt',
    symbols:['u_o','R','C','u_i','t'],
    note:'电容作反馈元件，输出是输入的积分(反相)；输入方波时输出三角波',
    derivation:[
      {text:'反相端虚地 $u_-=0$，虚断 $i_-=0$'},
      {text:'输入电流 $i=u_i/R$ 全部流入电容 $C$'},
      {text:'电容电流-电压关系 $i=C\\cdot d(u_--u_o)/dt=-C\\cdot du_o/dt$'},
      {text:'联立 $u_i/R=-C\\cdot du_o/dt$，积分得',latex:'u_o=-\\frac{1}{RC}\\int u_i\\,dt'},
    ] },

  { id:'op-differentiator', cat:'op-amp', title:'微分运算',
    latex:'u_o=-RC\\,\\frac{du_i}{dt}',
    symbols:['u_o','R','C','u_i','t'],
    note:'电容作输入元件，输出正比于输入的变化率(反相)；高频噪声易被放大，实用中需限幅',
    derivation:[
      {text:'电容作输入元件接反相端，反相端虚地 $u_-=0$'},
      {text:'电容电流 $i=C\\cdot du_i/dt$（输入电压全部加在电容上）'},
      {text:'虚断：$i$ 全部流过反馈电阻 $R$，$u_o=-iR$'},
      {text:'代入',latex:'u_o=-RC\\,\\frac{du_i}{dt}'},
    ] },

  { id:'op-lp-filter', cat:'op-amp', title:'一阶有源低通滤波器截止频率',
    latex:'f_H=\\frac{1}{2\\pi RC}',
    symbols:['f_H','R','C','\\pi'],
    note:'RC 低通网络加同相放大构成一阶有源低通；低于 f_H 的信号通过，高于 f_H 的被衰减(−20 dB/十倍频)',
    derivation:[
      {text:'RC 低通网络传输函数',latex:'H=\\frac{1}{1+j\\omega RC}'},
      {text:'截止频率定义 $|H|=1/\\sqrt{2}$（增益降 3 dB）'},
      {text:'$|H|^2=1/(1+(\\omega RC)^2)=1/2\\to\\omega RC=1$'},
      {text:'解出',latex:'f_H=\\frac{1}{2\\pi RC}'},
    ] },

  { id:'op-hp-filter', cat:'op-amp', title:'一阶有源高通滤波器截止频率',
    latex:'f_L=\\frac{1}{2\\pi RC}',
    symbols:['f_L','R','C','\\pi'],
    note:'高通网络加放大构成一阶有源高通；高于 f_L 的信号通过，直流和低频被阻挡',
    derivation:[
      {text:'RC 高通网络传输函数',latex:'H=\\frac{j\\omega RC}{1+j\\omega RC}'},
      {text:'截止频率定义 $|H|=1/\\sqrt{2}$（增益降 3 dB）'},
      {text:'$|H|^2=(\\omega RC)^2/(1+(\\omega RC)^2)=1/2\\to\\omega RC=1$'},
      {text:'解出',latex:'f_L=\\frac{1}{2\\pi RC}'},
    ] },

  { id:'op-notch', cat:'op-amp', title:'带阻(双 T 陷波)中心频率',
    latex:'f_0=\\frac{1}{2\\pi RC}',
    symbols:['f_0','R','C','\\pi'],
    note:'双 T 网络构成带阻滤波器，在 f_0 处衰减最大；常选 R、C 使 f_0=50 Hz 以滤除工频干扰' },

  /* ============== 第 7 章 波形发生电路 oscillator ============== */
  { id:'os-balance', cat:'oscillator', title:'正弦振荡平衡条件',
    latex:'|AF|=1\\;\\text{且}\\;\\sum\\varphi=2n\\pi',
    symbols:['A','F','\\varphi','n','\\pi'],
    note:'幅度平衡 |AF|=1、相位平衡 Σφ=2nπ(正反馈)，两者同时满足才能维持等幅振荡',
    derivation:[
      {text:'振荡器为正反馈闭环系统，环路增益 $AF(j\\omega)$'},
      {text:'维持等幅振荡要求信号经环路一周后幅度不变、相位同相'},
      {text:'幅度平衡 $|AF|=1$；相位平衡（正反馈）$\\sum\\varphi=\\angle A+\\angle F=2n\\pi$',latex:'|AF|=1\\;\\text{且}\\;\\sum\\varphi=2n\\pi'},
    ] },

  { id:'os-startup', cat:'oscillator', title:'起振条件',
    latex:'|AF|>1',
    symbols:['A','F'],
    note:'起振时环路增益须大于 1，振荡幅度不断增大，后由非线性元件(或稳幅环节)使 |AF| 自动趋近 1' },

  { id:'os-rc-bridge', cat:'oscillator', title:'RC 桥式(文氏)振荡频率',
    latex:'f_0=\\frac{1}{2\\pi RC}',
    symbols:['f_0','R','C','\\pi'],
    note:'RC 串并联选频网络相移为零、反馈系数 1/3，起振需放大器增益 ≥3；用于产生几十 Hz~几百 kHz 正弦波',
    derivation:[
      {text:'RC 串并联选频网络的反馈系数',latex:'F(j\\omega)=\\frac{1}{3+j\\!\\left(\\omega RC-\\frac{1}{\\omega RC}\\right)}'},
      {text:'当 $\\omega RC=1/(\\omega RC)$ 即 $\\omega=1/RC$ 时，$F$ 为实数且最大 $F=1/3$，相移为零'},
      {text:'此频率下振荡',latex:'f_0=\\frac{1}{2\\pi RC}'},
    ] },

  { id:'os-lc', cat:'oscillator', title:'LC 振荡频率',
    latex:'f_0=\\frac{1}{2\\pi\\sqrt{LC}}',
    symbols:['f_0','L','C','\\pi'],
    note:'LC 回路谐振频率；用于产生几十 kHz~几百 MHz 高频正弦波',
    derivation:[
      {text:'LC 并联谐振回路阻抗',latex:'Z=\\frac{j\\omega L}{1-\\omega^2 LC}'},
      {text:'谐振时阻抗为纯电阻，虚部为零',latex:'1-\\omega_0^2 LC=0'},
      {text:'解出谐振频率',latex:'f_0=\\frac{1}{2\\pi\\sqrt{LC}}'},
    ] },

  { id:'os-lc-3point', cat:'oscillator', title:'电容三点式(考毕兹)振荡频率',
    latex:'f_0=\\frac{1}{2\\pi\\sqrt{L\\dfrac{C_1 C_2}{C_1+C_2}}}',
    symbols:['f_0','L','C_1','C_2','\\pi'],
    note:'回路等效电容为 C_1∥C_2；改进型(克拉泼/西勒)在回路串/并小电容以提高频率稳定度',
    derivation:[
      {text:'电容三点式回路电容为 $C_1$ 与 $C_2$ 串联'},
      {text:'串联等效电容',latex:'C=\\frac{C_1 C_2}{C_1+C_2}'},
      {text:'代入 $LC$ 谐振频率公式',latex:'f_0=\\frac{1}{2\\pi\\sqrt{L\\dfrac{C_1 C_2}{C_1+C_2}}}'},
    ] },

  { id:'os-quartz', cat:'oscillator', title:'石英晶体串联谐振频率',
    latex:'f_s=\\frac{1}{2\\pi\\sqrt{LC}}',
    symbols:['f_0','L','C','\\pi'],
    note:'石英晶体等效为 L、C 串联支路，串联谐振于 f_s；并联谐振 f_p=f_s√(1+C/C_0) 略高于 f_s。晶振频率稳定度可达 10⁻⁶~10⁻¹⁰' },

  { id:'os-square-period', cat:'oscillator', title:'方波发生器周期',
    latex:'T=2RC\\ln\\frac{1+F}{1-F}',
    symbols:['T','R','C','F'],
    note:'比较器+RC+正反馈构成的多谐振荡器，F=R_2/(R_1+R_2) 为正反馈分压比；充放电对称时为方波',
    derivation:[
      {text:'比较器输出 $\\pm U_Z$，正反馈阈值电压 $\\pm F\\cdot U_Z$（$F=R_2/(R_1+R_2)$）'},
      {text:'电容从 $-FU_Z$ 充电趋向 $+U_Z$：$u_c(t)=U_Z-U_Z(1+F)e^{-t/(RC)}$'},
      {text:'令 $u_c$ 达到 $+FU_Z$ 求半周期',latex:'t_1=RC\\ln\\frac{1+F}{1-F}'},
      {text:'对称充放电，总周期',latex:'T=2t_1=2RC\\ln\\frac{1+F}{1-F}'},
    ] },

];

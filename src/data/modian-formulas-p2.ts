/* 公式分片 2：第 3 章 多级放大电路 multistage */
import type { Formula } from './types';

export const MODIAN_FORMULAS_P2: Formula[] = [
  /* ============== 第 3 章 多级放大电路 multistage ============== */
  { id:'ms-total-gain', cat:'multistage', title:'多级放大总电压增益',
    latex:'A_u=A_{u1}\\cdot A_{u2}\\cdots A_{un}',
    symbols:['A_u','A_{u1}','A_{u2}','A_{un}','n'],
    note:'各级电压增益相乘；注意后级输入电阻即前级负载，计算 A_{uk} 时须代入该负载' },

  { id:'ms-total-db', cat:'multistage', title:'多级增益（分贝相加）',
    latex:'20\\lg|A_u|=20\\lg|A_{u1}|+20\\lg|A_{u2}|+\\cdots',
    symbols:['A_u','A_{u1}','A_{u2}'],
    note:'增益取分贝后由乘变加，便于工程估算；A_u(dB)=20lg|A_u|',
    derivation:[
      {text:'多级总增益为各级增益之积',latex:'|A_u|=|A_{u1}|\\cdot|A_{u2}|\\cdots|A_{un}|'},
      {text:'取 20 倍对数（分贝）',latex:'20\\lg|A_u|=20\\lg(|A_{u1}|\\cdot|A_{u2}|\\cdots)'},
      {text:'利用对数性质 $\\lg(xy)=\\lg x+\\lg y$',latex:'20\\lg|A_u|=20\\lg|A_{u1}|+20\\lg|A_{u2}|+\\cdots'},
    ] },

  { id:'ms-ri-ro', cat:'multistage', title:'多级放大输入/输出电阻',
    latex:'R_i=R_{i1},\\quad R_o=R_{on}',
    symbols:['R_i','R_{i1}','R_o','R_{on}'],
    note:'输入电阻等于第一级输入电阻，输出电阻等于末级输出电阻(级间耦合电阻已归入相应级)' },

  { id:'ms-divider-bias', cat:'multistage', title:'分压式偏置：基极静态电位',
    latex:'U_{BQ}\\approx\\frac{R_{b2}}{R_{b1}+R_{b2}}V_{CC}',
    symbols:['U_{BQ}','R_{b2}','R_{b1}','V_{CC}'],
    note:'当基极电流 I_B 远小于分压支路电流时，基极电位由 R_{b1}、R_{b2} 分压近似固定，从而稳定 Q 点',
    derivation:[
      {text:'当 $I_B\\ll$ 分压支路电流时，$R_{b1}$、$R_{b2}$ 可视为纯分压网络'},
      {text:'由分压关系',latex:'U_{BQ}\\approx\\frac{R_{b2}}{R_{b1}+R_{b2}}V_{CC}'},
    ] },

  { id:'ms-divider-ie', cat:'multistage', title:'分压式偏置：发射极静态电流',
    latex:'I_{EQ}=\\frac{U_{BQ}-U_{BEQ}}{R_e}',
    symbols:['I_{EQ}','U_{BQ}','U_{BEQ}','R_e'],
    note:'R_e 引入直流负反馈使 I_EQ 受温度影响大大减小；近似 I_{CQ}≈I_{EQ}',
    derivation:[
      {text:'发射极回路 KVL',latex:'U_{BQ}=U_{BEQ}+I_{EQ}R_e'},
      {text:'解出发射极静态电流',latex:'I_{EQ}=\\frac{U_{BQ}-U_{BEQ}}{R_e}'},
    ] },

  { id:'ms-fh-n', cat:'multistage', title:'n 级相同放大级的上限频率',
    latex:'f_{Hn}\\approx f_H\\sqrt{2^{1/n}-1}',
    symbols:['f_{Hn}','f_H','n'],
    note:'多级级联后总带宽变窄(上限频率下降)；级数越多 f_{Hn} 越小',
    derivation:[
      {text:'单级归一化高频增益 $|A/A_m|=1/\\sqrt{1+(f/f_H)^2}$，$n$ 级相同级联取 $n$ 次方'},
      {text:'总幅频降为 $1/\\sqrt{2}$（$-3$ dB）处为总上限频率 $f_{Hn}$',latex:'\\left(\\frac{1}{\\sqrt{1+(f_{Hn}/f_H)^2}}\\right)^{\\!n}=\\frac{1}{\\sqrt{2}}'},
      {text:'解出',latex:'f_{Hn}=f_H\\sqrt{2^{1/n}-1}'},
    ] },

  { id:'ms-gbp', cat:'multistage', title:'增益带宽积（GBP）',
    latex:'\\mathrm{GBP}=|A_{um}|\\cdot f_H',
    symbols:['GBP','A_{um}','f_H'],
    note:'增益与带宽的乘积近似为常数；提高增益必以降低带宽为代价(单极点系统)' },

  /* ============== 第 4 章 集成运放与差分 integrated ============== */
  { id:'it-diff-signal', cat:'integrated', title:'差模输入信号',
    latex:'u_{id}=u_{i1}-u_{i2}',
    symbols:['u_{id}','u_{i1}','u_{i2}'],
    note:'两输入端电压之差，是差放要放大的有用信号' },

  { id:'it-common-signal', cat:'integrated', title:'共模输入信号',
    latex:'u_{ic}=\\frac{u_{i1}+u_{i2}}{2}',
    symbols:['u_{ic}','u_{i1}','u_{i2}'],
    note:'两输入端电压的平均值；多为温漂/干扰等共模噪声，需抑制' },

  { id:'it-input-decomp', cat:'integrated', title:'任意输入的差/共模分解',
    latex:'u_{i1}=u_{ic}+\\tfrac{1}{2}u_{id},\\quad u_{i2}=u_{ic}-\\tfrac{1}{2}u_{id}',
    symbols:['u_{i1}','u_{i2}','u_{ic}','u_{id}'],
    note:'任意两路输入恒可分解为共模与差模之和，便于分别分析',
    derivation:[
      {text:'定义差模 $u_{id}=u_{i1}-u_{i2}$，共模 $u_{ic}=(u_{i1}+u_{i2})/2$'},
      {text:'由 $u_{id}=u_{i1}-u_{i2}$ 得 $u_{i2}=u_{i1}-u_{id}$'},
      {text:'代入 $u_{ic}=(u_{i1}+u_{i1}-u_{id})/2=u_{i1}-u_{id}/2$，反解 $u_{i1}$',latex:'u_{i1}=u_{ic}+\\tfrac{1}{2}u_{id},\\quad u_{i2}=u_{ic}-\\tfrac{1}{2}u_{id}'},
    ] },

  { id:'it-ad-double', cat:'integrated', title:'差放双端输出差模放大倍数',
    latex:'A_d=-\\frac{\\beta R_c}{r_{be}}',
    symbols:['A_d','\\beta','R_c','r_{be}'],
    note:'双端输出(差动输出)差模增益与单管共射相同，输出取两集电极之差',
    derivation:[
      {text:'差模输入时两边对称：一侧 $+u_{id}/2$，另一侧 $-u_{id}/2$'},
      {text:'单管共射增益 $A_1=-\\beta R_c/r_{be}$，两管输出大小相等、符号相反'},
      {text:'双端输出 $u_{od}=u_{c1}-u_{c2}=A_1\\cdot(u_{id}/2)-A_1\\cdot(-u_{id}/2)=A_1\\cdot u_{id}$'},
      {text:'差模增益',latex:'A_d=\\frac{u_{od}}{u_{id}}=A_1=-\\frac{\\beta R_c}{r_{be}}'},
    ] },

  { id:'it-ad-single', cat:'integrated', title:'差放单端输出差模放大倍数',
    latex:'A_d=-\\frac{\\beta R_c}{2\\,r_{be}}',
    symbols:['A_d','\\beta','R_c','r_{be}'],
    note:'单端输出(从一个集电极对地)增益为双端的一半，有固定相位(同相或反相取决于输出端)',
    derivation:[
      {text:'单端输出仅取一个集电极对地，输出电压为双端的一半'},
      {text:'$u_{od}=u_{c1}=A_1\\cdot u_{id}/2$'},
      {text:'差模增益为双端的一半',latex:'A_d=\\frac{A_1}{2}=-\\frac{\\beta R_c}{2\\,r_{be}}'},
    ] },

  { id:'it-ac-double', cat:'integrated', title:'差放共模放大倍数',
    latex:'A_c\\approx 0\\;\\text{(双端)},\\quad A_c\\approx-\\frac{R_c}{2R_e}\\;\\text{(单端)}',
    symbols:['A_c','R_c','R_e'],
    note:'双端输出电路对称时共模增益趋于零；单端输出靠发射极电阻 R_e 的共模负反馈抑制，R_e 越大 A_c 越小' },

  { id:'it-cmrr', cat:'integrated', title:'共模抑制比（比值形式）',
    latex:'\\mathrm{CMRR}=\\left|\\frac{A_d}{A_c}\\right|',
    symbols:['CMRR','A_d','A_c'],
    note:'差模增益与共模增益之比的绝对值，越大抑制共模干扰能力越强；理想对称差放趋于无穷' },

  { id:'it-cmrr-db', cat:'integrated', title:'共模抑制比（分贝形式）',
    latex:'\\mathrm{CMRR}=20\\lg\\left|\\frac{A_d}{A_c}\\right|\\;(\\mathrm{dB})',
    symbols:['CMRR','A_d','A_c'],
    note:'工程上常用分贝表示，优质集成运放 CMRR 可达 100~140 dB' },

  { id:'it-virtual-short', cat:'integrated', title:'理想运放：虚短',
    latex:'u_+=u_-',
    symbols:['u_+','u_-'],
    note:'开环增益极大且工作于负反馈时，两输入端电位近似相等(虚短路)；是分析运放的两大依据之一' },

  { id:'it-virtual-open', cat:'integrated', title:'理想运放：虚断',
    latex:'i_+=i_-=0',
    symbols:['i_+','i_-'],
    note:'输入电阻极大，流入两输入端的电流近似为零(虚开路)' },

  { id:'it-mirror', cat:'integrated', title:'镜像电流源',
    latex:'I_{C2}=I_{REF}=\\frac{V_{CC}-U_{BE}}{R}',
    symbols:['I_{C2}','I_{REF}','V_{CC}','U_{BE}','R'],
    note:'两管参数对称时输出电流 I_{C2} 镜像参考电流 I_{REF}；广泛用作集成运放的偏置与有源负载',
    derivation:[
      {text:'两管参数对称且 $U_{BE}$ 相同 $\\to I_{C1}=I_{C2}$'},
      {text:'$\\beta\\gg 1$ 时基极电流可忽略，参考支路 $I_{REF}\\approx I_{C1}$'},
      {text:'由参考回路 KVL：$I_{REF}=(V_{CC}-U_{BE})/R$',latex:'I_{C2}=I_{REF}=\\frac{V_{CC}-U_{BE}}{R}'},
    ] },

  /* ============== 第 5 章 反馈放大电路 feedback ============== */
  { id:'fb-closed-loop', cat:'feedback', title:'闭环放大倍数',
    latex:'A_f=\\frac{A}{1+AF}',
    symbols:['A_f','A','F'],
    note:'负反馈的基本方程；1+AF 称为反馈深度，AF 称环路增益',
    derivation:[
      {text:'基本放大器输出 $x_o=A\\cdot x_d$（$x_d$ 为净输入），反馈网络 $x_f=F\\cdot x_o$'},
      {text:'比较环节（负反馈相减）$x_d=x_i-x_f=x_i-F\\cdot x_o$'},
      {text:'联立：$x_o=A(x_i-F\\cdot x_o)$，整理得',latex:'x_o(1+AF)=A\\cdot x_i'},
      {text:'闭环增益',latex:'A_f=\\frac{x_o}{x_i}=\\frac{A}{1+AF}'},
    ] },

  { id:'fb-feedback-depth', cat:'feedback', title:'反馈深度',
    latex:'D=1+AF',
    symbols:['A','F'],
    note:'反馈深度 D>1 为负反馈；D 越深负反馈作用越强，增益下降越多但性能改善越大' },

  { id:'fb-deep', cat:'feedback', title:'深度负反馈近似',
    latex:'A_f\\approx\\frac{1}{F}\\quad(AF\\gg 1)',
    symbols:['A_f','F','A'],
    note:'反馈很深时闭环增益几乎只取决于反馈网络 F，与放大器本身参数无关，增益稳定性极高',
    derivation:[
      {text:'闭环增益',latex:'A_f=\\frac{A}{1+AF}'},
      {text:'深度负反馈 $AF\\gg 1$，故 $1+AF\\approx AF$'},
      {text:'代入',latex:'A_f\\approx\\frac{A}{AF}=\\frac{1}{F}'},
    ] },

  { id:'fb-gain-stability', cat:'feedback', title:'闭环增益稳定性',
    latex:'\\frac{dA_f}{A_f}=\\frac{1}{1+AF}\\cdot\\frac{dA}{A}',
    symbols:['A_f','A','F'],
    note:'闭环增益相对变化量是开环的 1/(1+AF)，即负反馈使增益稳定性提高(1+AF)倍',
    derivation:[
      {text:'闭环增益 $A_f=A/(1+AF)$，对 $A$ 求导',latex:'\\frac{dA_f}{dA}=\\frac{(1+AF)-A\\cdot F}{(1+AF)^2}=\\frac{1}{(1+AF)^2}'},
      {text:'故 $dA_f=dA/(1+AF)^2$'},
      {text:'两边除以 $A_f=A/(1+AF)$',latex:'\\frac{dA_f}{A_f}=\\frac{1}{1+AF}\\cdot\\frac{dA}{A}'},
    ] },

  { id:'fb-fh-widen', cat:'feedback', title:'负反馈展宽上限频率',
    latex:'f_{Hf}=(1+AF)\\,f_H',
    symbols:['f_{Hf}','f_H','A','F'],
    note:'负反馈使上限频率提高到 (1+AF) 倍(频带展宽)，代价是中频增益下降同样倍数，GBP 近似不变',
    derivation:[
      {text:'开环高频增益 $A(j\\omega)=A_m/(1+jf/f_H)$'},
      {text:'加负反馈 $A_f=A/(1+AF)$，代入整理分母',latex:'(1+jf/f_H)+A_m F=(1+A_m F)\\!\\left(1+jf\\big/((1+A_m F)f_H)\\right)'},
      {text:'故闭环上限频率展宽',latex:'f_{Hf}=(1+AF)\\,f_H'},
    ] },

  { id:'fb-fl-narrow', cat:'feedback', title:'负反馈降低下限频率',
    latex:'f_{Lf}=\\frac{f_L}{1+AF}',
    symbols:['f_{Lf}','f_L','A','F'],
    note:'负反馈使下限频率降低到 1/(1+AF)，通频带整体向两端扩展',
    derivation:[
      {text:'开环低频增益含极点因子 $1/(1+f_L/jf)$'},
      {text:'加负反馈后类似高频分析，极点频率降为 $1/(1+AF)$'},
      {text:'下限频率降低',latex:'f_{Lf}=\\frac{f_L}{1+AF}'},
    ] },

  { id:'fb-ri-ro', cat:'feedback', title:'负反馈对输入/输出电阻的影响（电压串联）',
    latex:'R_{if}=(1+AF)R_i,\\quad R_{of}=\\frac{R_o}{1+AF}',
    symbols:['R_{if}','R_i','R_{of}','R_o','A','F'],
    note:'串联负反馈使输入电阻增到 (1+AF) 倍；电压负反馈使输出电阻降到 1/(1+AF)，稳定输出电压。并联/电流组态影响相反',
    derivation:[
      {text:'串联负反馈：输入端反馈电压与输入串联，净输入减小，等效输入电阻增大',latex:'R_{if}=(1+AF)R_i'},
      {text:'电压负反馈：稳定输出电压（减小负载变化对输出的影响），等效输出电阻减小',latex:'R_{of}=\\frac{R_o}{1+AF}'},
    ] },

  { id:'fb-oscillation', cat:'feedback', title:'负反馈放大器自激振荡条件',
    latex:'|AF|=1\\;\\text{且}\\;\\Delta\\varphi=\\pm(2n+1)\\pi',
    symbols:['A','F','\\Delta','\\varphi','n','\\pi'],
    note:'负反馈在高频/低频附加相移达 ±180° 时变为正反馈，若再满足幅度 |AF|=1 即自激；需用补偿电容消除',
    derivation:[
      {text:'负反馈低频时环路相移 $180^\\circ$（负反馈自身反相）'},
      {text:'高频/低频时放大器与反馈网络产生附加相移 $\\Delta\\varphi$'},
      {text:'当 $\\Delta\\varphi=\\pm(2n+1)\\pi=\\pm 180^\\circ$ 时，总相移 $360^\\circ$，负反馈变为正反馈'},
      {text:'若此时幅度 $|AF|=1$，维持等幅自激振荡',latex:'|AF|=1\\;\\text{且}\\;\\Delta\\varphi=\\pm(2n+1)\\pi'},
    ] },

];

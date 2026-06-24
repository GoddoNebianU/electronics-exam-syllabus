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

/* ---- 1. 分类（9 章，按教学顺序）---------------------------------------- */
import type { Formula, FormulaCategory, SymbolDict } from './types';

export const MODIAN_CATEGORIES: FormulaCategory[] = [
  { id: 'device',       name: '半导体器件',     brief: '二极管/稳压管/三极管/场效应管特性与参数' },
  { id: 'basic-amp',    name: '基本放大电路',   brief: '静态工作点/微变等效/三种组态动态指标' },
  { id: 'multistage',   name: '多级放大电路',   brief: '级联/耦合/分压偏置/频响带宽' },
  { id: 'integrated',   name: '集成运放与差分', brief: '差模共模/CMRR/虚短虚断/电流源' },
  { id: 'feedback',     name: '反馈放大电路',   brief: '闭环增益/反馈深度/组态/自激' },
  { id: 'op-amp',       name: '信号的运算与处理', brief: '比例/求和/积分微分/有源滤波/比较器' },
  { id: 'oscillator',   name: '波形发生电路',   brief: 'RC/LC/石英振荡/方波三角波' },
  { id: 'power-amp',    name: '功率放大电路',   brief: '甲/乙/甲乙类/OCL/OTL/效率管耗' },
  { id: 'power-supply', name: '直流稳压电源',   brief: '整流/滤波/稳压管/串联型/三端稳压' },
];

/* ---- 2. 公式列表 -------------------------------------------------------- */
export const MODIAN_FORMULAS: Formula[] = [

  /* ============== 第 1 章 半导体器件 device ============== */
  { id:'dv-diode-vi', cat:'device', title:'二极管伏安特性（肖克莱方程）',
    latex:'I=I_S\\left(e^{U/U_T}-1\\right)',
    symbols:['I','I_S','U','U_T'],
    note:'正向偏置 U>0 时电流随电压指数增长；U<0 反向时 I≈−I_S（反向饱和）。常温硅管导通电压约 0.6~0.7 V，锗管约 0.2~0.3 V' },

  { id:'dv-thermal-v', cat:'device', title:'热电压（温度当量）',
    latex:'U_T=\\frac{kT}{q}\\approx 26\\,\\mathrm{mV}\\;(T=300\\,\\mathrm{K})',
    symbols:['U_T'],
    note:'常温(T≈300 K)下 U_T≈26 mV，是 PN 结电流方程中的温度当量，k 为玻尔兹曼常数、q 为电子电量' },

  { id:'dv-zener-rz', cat:'device', title:'稳压管动态电阻',
    latex:'r_Z=\\frac{\\Delta U_Z}{\\Delta I_Z}',
    symbols:['r_Z','\\Delta','U_Z','I_Z'],
    note:'稳压管工作于反向击穿区，稳定电压为 U_Z；r_Z 越小稳压性能越好(通常为几~几十 Ω)' },

  { id:'dv-bjt-current', cat:'device', title:'三极管电流关系（含穿透电流）',
    latex:'I_C=\\beta I_B+I_{CEO}',
    symbols:['I_C','\\beta','I_B','I_{CEO}'],
    note:'集电极电流 = 放大的基极电流加穿透电流；忽略 I_{CEO} 时 I_C=βI_B' },

  { id:'dv-bjt-ie', cat:'device', title:'发射极电流',
    latex:'I_E=I_B+I_C=(1+\\beta)I_B',
    symbols:['I_E','I_B','I_C','\\beta'],
    note:'由基尔霍夫电流定律，发射极电流等于基极与集电极电流之和' },

  { id:'dv-bjt-beta-dc', cat:'device', title:'共射电流放大系数（直流/交流）',
    latex:'\\beta=\\frac{I_C}{I_B}=\\frac{\\Delta I_C}{\\Delta I_B}',
    symbols:['\\beta','I_C','I_B','\\Delta'],
    note:'直流 β=I_C/I_B；交流 β=ΔI_C/ΔI_B（小信号）。通常 β>>1(几十~几百)，两者数值相近常不加区分' },

  { id:'dv-bjt-alpha', cat:'device', title:'共基电流放大系数',
    latex:'\\alpha=\\frac{I_C}{I_E}=\\frac{\\beta}{1+\\beta}',
    symbols:['\\alpha','I_C','I_E','\\beta'],
    note:'α 略小于 1(约 0.95~0.995)，反映发射区注入载流子被集电极收集的比例',
    derivation:[
      {text:'共基电流放大系数定义 α=I_C/I_E'},
      {text:'由 KCL I_E=I_B+I_C，及 I_C=βI_B 得 I_E=I_B+βI_B=(1+β)I_B'},
      {text:'代入 α=I_C/I_E=βI_B/((1+β)I_B)',latex:'\\alpha=\\frac{\\beta}{1+\\beta}'},
    ] },

  { id:'dv-bjt-iceo', cat:'device', title:'穿透电流与集基反向饱和电流',
    latex:'I_{CEO}=(1+\\beta)I_{CBO}',
    symbols:['I_{CEO}','\\beta','I_{CBO}'],
    note:'基极开路时 c-e 间的穿透电流；I_{CBO} 为发射极开路时集电结反向饱和电流。硅管 I_{CEO} 很小(μA 级)',
    derivation:[
      {text:'I_{CBO} 为发射极开路时集电结反向饱和电流'},
      {text:'基极开路（I_B=0）时，I_{CBO} 相当于流入基极的电流，被三极管放大 β 倍'},
      {text:'故 c-e 间穿透电流为 I_{CBO} 本身加其放大结果',latex:'I_{CEO}=I_{CBO}+\\beta I_{CBO}=(1+\\beta)I_{CBO}'},
    ] },

  { id:'dv-fet-gm', cat:'device', title:'场效应管跨导（定义）',
    latex:'g_m=\\frac{\\Delta I_D}{\\Delta U_{GS}}',
    symbols:['g_m','\\Delta','I_D','U_{GS}'],
    note:'转移特性在 Q 点的斜率，反映栅源电压对漏极电流的控制能力，单位 mS(西门子)' },

  { id:'dv-mos-sat-id', cat:'device', title:'MOS 管饱和区漏极电流',
    latex:'I_D=K_n\\left(U_{GS}-V_{TN}\\right)^2',
    symbols:['I_D','K_n','U_{GS}','V_{TN}'],
    note:'增强型 NMOS 工作于饱和区(恒流区)的平方律关系，K_n 为跨导参数，V_{TN} 为开启电压；需 U_{GS}>V_{TN} 且 U_{DS}≥U_{GS}−V_{TN}' },

  { id:'dv-mos-gm', cat:'device', title:'MOS 管饱和区跨导',
    latex:'g_m=\\sqrt{2K_n I_{DQ}}',
    symbols:['g_m','K_n','I_{DQ}'],
    note:'由平方律关系导出，I_{DQ} 为静态漏极电流；跨导随工作电流增大而增大',
    derivation:[
      {text:'饱和区电流方程（K_n=μ_n C_ox W/L）',latex:'I_D=\\frac{K_n}{2}(U_{GS}-V_{TN})^2'},
      {text:'跨导定义 g_m=∂I_D/∂U_{GS}=K_n(U_{GS}-V_{TN})'},
      {text:'由电流方程解出 U_{GS}-V_{TN}=√(2I_D/K_n)，代入',latex:'g_m=K_n\\sqrt{\\frac{2I_D}{K_n}}=\\sqrt{2K_n I_D}'},
    ] },

  /* ============== 第 2 章 基本放大电路 basic-amp ★ ============== */
  { id:'ba-au-def', cat:'basic-amp', title:'电压放大倍数（定义）',
    latex:'A_u=\\frac{u_o}{u_i}',
    symbols:['A_u','u_o','u_i'],
    note:'输出电压与输入电压之比，又称电压增益；>1 放大，<1 衰减' },

  { id:'ba-ri-def', cat:'basic-amp', title:'输入电阻（定义）',
    latex:'R_i=\\frac{u_i}{i_i}',
    symbols:['R_i','u_i','i_i'],
    note:'从输入端看入的等效电阻；为减轻信号源负担、提高输入电压，一般希望 R_i 大' },

  { id:'ba-ro-def', cat:'basic-amp', title:'输出电阻（定义）',
    latex:'R_o=\\left.\\frac{u_o}{i_o}\\right|_{u_i=0}',
    symbols:['R_o','u_o','i_o'],
    note:'令输入短路、移去负载、输出端加电压求等效电阻(戴维南等效内阻)；越小带载能力越强' },

  { id:'ba-ce-q-ib', cat:'basic-amp', title:'共射固定偏置：基极静态电流',
    latex:'I_{BQ}=\\frac{V_{CC}-U_{BEQ}}{R_b}',
    symbols:['I_{BQ}','V_{CC}','U_{BEQ}','R_b'],
    note:'固定偏置(单电源)电路求 Q 点第一步；U_{BEQ} 硅管取 0.7 V、锗管取 0.3 V',
    derivation:[
      {text:'输入回路（基极回路）应用 KVL',latex:'V_{CC}=I_{BQ}R_b+U_{BEQ}'},
      {text:'解出基极静态电流',latex:'I_{BQ}=\\frac{V_{CC}-U_{BEQ}}{R_b}'},
    ] },

  { id:'ba-ce-q-ic', cat:'basic-amp', title:'共射固定偏置：集电极静态电流',
    latex:'I_{CQ}=\\beta I_{BQ}',
    symbols:['I_{CQ}','\\beta','I_{BQ}'],
    note:'由电流放大关系确定集电极静态电流(忽略 I_{CEO})' },

  { id:'ba-ce-q-uce', cat:'basic-amp', title:'共射固定偏置：管压降',
    latex:'U_{CEQ}=V_{CC}-I_{CQ}R_c',
    symbols:['U_{CEQ}','V_{CC}','I_{CQ}','R_c'],
    note:'由输出回路 KVL 确定；为获得最大不失真动态范围，Q 点应位于交流负载线中点附近',
    derivation:[
      {text:'输出回路（集电极回路）应用 KVL',latex:'V_{CC}=I_{CQ}R_c+U_{CEQ}'},
      {text:'解出管压降',latex:'U_{CEQ}=V_{CC}-I_{CQ}R_c'},
    ] },

  { id:'ba-rbe', cat:'basic-amp', title:'发射结等效电阻 r_be',
    "latex":"r_{be}=r_{bb'}+(1+\\beta)\\frac{U_T}{I_{EQ}}",
    symbols:["r_{be}","r_{bb'}",'\\beta','U_T','I_{EQ}'],
    note:'微变等效模型中 b-e 间输入电阻；常温下第二项≈26 mV/I_{EQ}(mA)→kΩ。r bb\' 为基区体电阻(低频约 200~300 Ω)',
    derivation:[
      {text:'r_{be} 由基区体电阻 r_{bb\'} 和发射结等效电阻 r_e 串联组成（r_e 折算到基极）'},
      {text:'发射结微分电阻 r_e=U_T/I_{EQ}（由 PN 结电流方程求导）'},
      {text:'折算到基极侧乘 (1+β)（因 I_E=(1+β)I_B）',latex:"r_{be}=r_{bb'}+(1+\\beta)\\frac{U_T}{I_{EQ}}"},
    ] },

  { id:'ba-ce-au', cat:'basic-amp', title:'共射电路动态电压放大倍数',
    latex:'A_u=-\\frac{\\beta\\left(R_c\\parallel R_L\\right)}{r_{be}}',
    symbols:['A_u','\\beta','R_c','R_L','r_{be}'],
    note:'负号表示输出与输入反相；接负载 R_L 后增益下降(因 R_c∥R_L 变小)',
    derivation:[
      {text:'微变等效电路输入回路：u_i=i_b r_{be}'},
      {text:'输出回路：受控电流源 βi_b 流过并联负载，输出电压取负',latex:'u_o=-\\beta i_b(R_c\\parallel R_L)'},
      {text:'电压增益',latex:'A_u=\\frac{u_o}{u_i}=-\\frac{\\beta(R_c\\parallel R_L)}{r_{be}}'},
    ] },

  { id:'ba-ce-ri', cat:'basic-amp', title:'共射电路输入电阻',
    latex:'R_i=R_b\\parallel r_{be}',
    symbols:['R_i','R_b','r_{be}'],
    note:'共射放大输入电阻主要由 r_be 决定(约 1~3 kΩ)，偏置电阻并联使总电阻略降',
    derivation:[
      {text:'从输入端看入，偏置电阻 R_b 与三极管输入电阻 r_{be} 并联'},
      {text:'输入电阻',latex:'R_i=R_b\\parallel r_{be}'},
    ] },

  { id:'ba-ce-ro', cat:'basic-amp', title:'共射电路输出电阻',
    latex:'R_o\\approx R_c',
    symbols:['R_o','R_c'],
    note:'共射放大输出电阻近似等于集电极电阻 R_c(忽略三极管输出电阻 r_ce)' },

  { id:'ba-cc-au', cat:'basic-amp', title:'共集电极(射极跟随器)电压放大倍数',
    latex:'A_u=\\frac{(1+\\beta)(R_e\\parallel R_L)}{r_{be}+(1+\\beta)(R_e\\parallel R_L)}\\approx 1',
    symbols:['A_u','\\beta','R_e','R_L','r_{be}'],
    note:'输出与输入同相，电压增益略小于 1(无电压放大)；常作输入级/输出级/缓冲级',
    derivation:[
      {text:'射随器微变等效：输入电压加在 r_{be} 与发射极负载上',latex:'u_i=i_b r_{be}+(1+\\beta)i_b(R_e\\parallel R_L)'},
      {text:'输出电压取自发射极',latex:'u_o=(1+\\beta)i_b(R_e\\parallel R_L)'},
      {text:'电压增益',latex:'A_u=\\frac{(1+\\beta)(R_e\\parallel R_L)}{r_{be}+(1+\\beta)(R_e\\parallel R_L)}\\approx 1'},
    ] },

  { id:'ba-cc-ri', cat:'basic-amp', title:'共集电极电路输入电阻',
    latex:'R_i=R_b\\parallel\\left[r_{be}+(1+\\beta)(R_e\\parallel R_L)\\right]',
    symbols:['R_i','R_b','r_{be}','\\beta','R_e','R_L'],
    note:'射随器输入电阻很高(受基极偏置电阻 R_b 并联所限)，适合作高阻输入级',
    derivation:[
      {text:'从基极看入的等效电阻 = r_{be} + 发射极负载折算到基极'},
      {text:'发射极电阻 (R_e∥R_L) 折算到基极需乘 (1+β)',latex:'R_i\'=r_{be}+(1+\\beta)(R_e\\parallel R_L)'},
      {text:'并联偏置电阻',latex:'R_i=R_b\\parallel R_i\''},
    ] },

  { id:'ba-cc-ro', cat:'basic-amp', title:'共集电极电路输出电阻',
    latex:'R_o\\approx\\frac{r_{be}+R_s}{1+\\beta}',
    symbols:['R_o','r_{be}','R_s','\\beta'],
    note:'射随器输出电阻很小(几十 Ω)，带载能力强；R_s 为信号源内阻',
    derivation:[
      {text:'求输出电阻：令 u_i=0（信号源短路到地，保留内阻 R_s）'},
      {text:'从发射极看入，基极回路总电阻 (r_{be}+R_s) 折算到发射极除以 (1+β)'},
      {text:'输出电阻',latex:'R_o\\approx\\frac{r_{be}+R_s}{1+\\beta}'},
    ] },

  { id:'ba-cb-au', cat:'basic-amp', title:'共基极电路电压放大倍数',
    latex:'A_u=\\frac{\\beta\\left(R_c\\parallel R_L\\right)}{r_{be}}',
    symbols:['A_u','\\beta','R_c','R_L','r_{be}'],
    note:'数值与共射相同但输出与输入同相(不反相)；频带宽，适合作高频/宽频带放大',
    derivation:[
      {text:'共基电路基极交流接地，输入加在发射极'},
      {text:'输入电压 u_i=i_b r_{be}，输出 u_o=βi_b(R_c∥R_L)（同相）'},
      {text:'电压增益',latex:'A_u=\\frac{\\beta(R_c\\parallel R_L)}{r_{be}}'},
    ] },

  { id:'ba-cb-ri', cat:'basic-amp', title:'共基极电路输入电阻',
    latex:'R_i\\approx\\frac{r_{be}}{1+\\beta}',
    symbols:['R_i','r_{be}','\\beta'],
    note:'共基极输入电阻很低(几十 Ω)，与共射/共集形成互补' },

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
      {text:'利用对数性质 lg(xy)=lg x+lg y',latex:'20\\lg|A_u|=20\\lg|A_{u1}|+20\\lg|A_{u2}|+\\cdots'},
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
      {text:'当 I_B≪分压支路电流时，R_{b1}、R_{b2} 可视为纯分压网络'},
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
      {text:'单级归一化高频增益 |A/A_m|=1/√(1+(f/f_H)²)，n 级相同级联取 n 次方'},
      {text:'总幅频降为 1/√2（−3 dB）处为总上限频率 f_{Hn}',latex:'\\left(\\frac{1}{\\sqrt{1+(f_{Hn}/f_H)^2}}\\right)^{\\!n}=\\frac{1}{\\sqrt{2}}'},
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
      {text:'定义差模 u_{id}=u_{i1}-u_{i2}，共模 u_{ic}=(u_{i1}+u_{i2})/2'},
      {text:'由 u_{id}=u_{i1}-u_{i2} 得 u_{i2}=u_{i1}-u_{id}'},
      {text:'代入 u_{ic}=(u_{i1}+u_{i1}-u_{id})/2=u_{i1}-u_{id}/2，反解 u_{i1}',latex:'u_{i1}=u_{ic}+\\tfrac{1}{2}u_{id},\\quad u_{i2}=u_{ic}-\\tfrac{1}{2}u_{id}'},
    ] },

  { id:'it-ad-double', cat:'integrated', title:'差放双端输出差模放大倍数',
    latex:'A_d=-\\frac{\\beta R_c}{r_{be}}',
    symbols:['A_d','\\beta','R_c','r_{be}'],
    note:'双端输出(差动输出)差模增益与单管共射相同，输出取两集电极之差',
    derivation:[
      {text:'差模输入时两边对称：一侧 +u_{id}/2，另一侧 −u_{id}/2'},
      {text:'单管共射增益 A_1=−βR_c/r_{be}，两管输出大小相等、符号相反'},
      {text:'双端输出 u_{od}=u_{c1}−u_{c2}=A_1·(u_{id}/2)−A_1·(−u_{id}/2)=A_1·u_{id}'},
      {text:'差模增益',latex:'A_d=\\frac{u_{od}}{u_{id}}=A_1=-\\frac{\\beta R_c}{r_{be}}'},
    ] },

  { id:'it-ad-single', cat:'integrated', title:'差放单端输出差模放大倍数',
    latex:'A_d=-\\frac{\\beta R_c}{2\\,r_{be}}',
    symbols:['A_d','\\beta','R_c','r_{be}'],
    note:'单端输出(从一个集电极对地)增益为双端的一半，有固定相位(同相或反相取决于输出端)',
    derivation:[
      {text:'单端输出仅取一个集电极对地，输出电压为双端的一半'},
      {text:'u_{od}=u_{c1}=A_1·u_{id}/2'},
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
      {text:'两管参数对称且 U_{BE} 相同 → I_{C1}=I_{C2}'},
      {text:'β≫1 时基极电流可忽略，参考支路 I_{REF}≈I_{C1}'},
      {text:'由参考回路 KVL：I_{REF}=(V_{CC}−U_{BE})/R',latex:'I_{C2}=I_{REF}=\\frac{V_{CC}-U_{BE}}{R}'},
    ] },

  /* ============== 第 5 章 反馈放大电路 feedback ============== */
  { id:'fb-closed-loop', cat:'feedback', title:'闭环放大倍数',
    latex:'A_f=\\frac{A}{1+AF}',
    symbols:['A_f','A','F'],
    note:'负反馈的基本方程；1+AF 称为反馈深度，AF 称环路增益',
    derivation:[
      {text:'基本放大器输出 x_o=A·x_d（x_d 为净输入），反馈网络 x_f=F·x_o'},
      {text:'比较环节（负反馈相减）x_d=x_i−x_f=x_i−F·x_o'},
      {text:'联立：x_o=A(x_i−F·x_o)，整理得',latex:'x_o(1+AF)=A\\cdot x_i'},
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
      {text:'深度负反馈 AF≫1，故 1+AF≈AF'},
      {text:'代入',latex:'A_f\\approx\\frac{A}{AF}=\\frac{1}{F}'},
    ] },

  { id:'fb-gain-stability', cat:'feedback', title:'闭环增益稳定性',
    latex:'\\frac{dA_f}{A_f}=\\frac{1}{1+AF}\\cdot\\frac{dA}{A}',
    symbols:['A_f','A','F'],
    note:'闭环增益相对变化量是开环的 1/(1+AF)，即负反馈使增益稳定性提高(1+AF)倍',
    derivation:[
      {text:'闭环增益 A_f=A/(1+AF)，对 A 求导',latex:'\\frac{dA_f}{dA}=\\frac{(1+AF)-A\\cdot F}{(1+AF)^2}=\\frac{1}{(1+AF)^2}'},
      {text:'故 dA_f=dA/(1+AF)²'},
      {text:'两边除以 A_f=A/(1+AF)',latex:'\\frac{dA_f}{A_f}=\\frac{1}{1+AF}\\cdot\\frac{dA}{A}'},
    ] },

  { id:'fb-fh-widen', cat:'feedback', title:'负反馈展宽上限频率',
    latex:'f_{Hf}=(1+AF)\\,f_H',
    symbols:['f_{Hf}','f_H','A','F'],
    note:'负反馈使上限频率提高到 (1+AF) 倍(频带展宽)，代价是中频增益下降同样倍数，GBP 近似不变',
    derivation:[
      {text:'开环高频增益 A(jω)=A_m/(1+jf/f_H)'},
      {text:'加负反馈 A_f=A/(1+AF)，代入整理分母',latex:'(1+jf/f_H)+A_m F=(1+A_m F)\\!\\left(1+jf\\big/((1+A_m F)f_H)\\right)'},
      {text:'故闭环上限频率展宽',latex:'f_{Hf}=(1+AF)\\,f_H'},
    ] },

  { id:'fb-fl-narrow', cat:'feedback', title:'负反馈降低下限频率',
    latex:'f_{Lf}=\\frac{f_L}{1+AF}',
    symbols:['f_{Lf}','f_L','A','F'],
    note:'负反馈使下限频率降低到 1/(1+AF)，通频带整体向两端扩展',
    derivation:[
      {text:'开环低频增益含极点因子 1/(1+f_L/jf)'},
      {text:'加负反馈后类似高频分析，极点频率降为 1/(1+AF)'},
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
      {text:'负反馈低频时环路相移 180°（负反馈自身反相）'},
      {text:'高频/低频时放大器与反馈网络产生附加相移 Δφ'},
      {text:'当 Δφ=±(2n+1)π=±180° 时，总相移 360°，负反馈变为正反馈'},
      {text:'若此时幅度 |AF|=1，维持等幅自激振荡',latex:'|AF|=1\\;\\text{且}\\;\\Delta\\varphi=\\pm(2n+1)\\pi'},
    ] },

  /* ============== 第 6 章 信号的运算与处理 op-amp ★ ============== */
  { id:'op-inv-scale', cat:'op-amp', title:'反相比例运算',
    latex:'u_o=-\\frac{R_f}{R_1}u_i',
    symbols:['u_o','R_f','R_1','u_i'],
    note:'反相端输入，输出与输入反相，比例由外接电阻决定；同相端接地，反相端为"虚地"',
    derivation:[
      {text:'同相端接地，虚短 → 反相端为虚地 u_-=0'},
      {text:'虚断：流入反相端电流为零，故流过 R_1 的电流全部流过 R_f'},
      {text:'i_1=u_i/R_1=(0−u_o)/R_f'},
      {text:'整理',latex:'u_o=-\\frac{R_f}{R_1}u_i'},
    ] },

  { id:'op-noninv-scale', cat:'op-amp', title:'同相比例运算',
    latex:'u_o=\\left(1+\\frac{R_f}{R_1}\\right)u_i',
    symbols:['u_o','R_f','R_1','u_i'],
    note:'同相端输入，输出与输入同相，增益≥1；输入电阻高',
    derivation:[
      {text:'同相输入 u_+=u_i，虚短 → u_-=u_+=u_i'},
      {text:'虚断：反相端无电流流入，R_1 与 R_f 构成分压网络'},
      {text:'u_-=u_o·R_1/(R_1+R_f)=u_i'},
      {text:'整理',latex:'u_o=\\left(1+\\frac{R_f}{R_1}\\right)u_i'},
    ] },

  { id:'op-follower', cat:'op-amp', title:'电压跟随器',
    latex:'u_o=u_i',
    symbols:['u_o','u_i'],
    note:'同相比例 R_f=0、R_1 开路的特例，增益为 1；输入阻抗极高、输出阻抗极低，常作阻抗变换/缓冲隔离',
    derivation:[
      {text:'电压跟随器 = 同相比例运算中 R_f=0（输出直连反相端）'},
      {text:'代入同相比例公式 u_o=(1+R_f/R_1)u_i，R_f=0 时',latex:'u_o=u_i'},
    ] },

  { id:'op-inv-sum', cat:'op-amp', title:'反相求和运算',
    latex:'u_o=-\\left(\\frac{R_f}{R_1}u_{i1}+\\frac{R_f}{R_2}u_{i2}\\right)',
    symbols:['u_o','R_f','R_1','u_{i1}','R_2','u_{i2}'],
    note:'多路信号在反相端汇合(虚地)实现加权求和；推广 m 路：u_o=−Σ(R_f/R_k)u_{ik}',
    derivation:[
      {text:'反相端虚地 u_-=0，虚断 i_-=0'},
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
      {text:'利用叠加原理。u_{i1} 单独作用（u_{i2}=0，同相端接地）→ 反相比例',latex:'u_{o1}=-\\frac{R_f}{R_1}u_{i1}'},
      {text:'u_{i2} 单独作用（u_{i1}=0）→ 同相端分压后同相放大（R_1=R_2）',latex:'u_{o2}=\\frac{R_f}{R_1}u_{i2}'},
      {text:'叠加',latex:'u_o=u_{o1}+u_{o2}=\\frac{R_f}{R_1}(u_{i2}-u_{i1})'},
    ] },

  { id:'op-integrator', cat:'op-amp', title:'积分运算',
    latex:'u_o=-\\frac{1}{RC}\\int u_i\\,dt',
    symbols:['u_o','R','C','u_i','t'],
    note:'电容作反馈元件，输出是输入的积分(反相)；输入方波时输出三角波',
    derivation:[
      {text:'反相端虚地 u_-=0，虚断 i_-=0'},
      {text:'输入电流 i=u_i/R 全部流入电容 C'},
      {text:'电容电流-电压关系 i=C·d(u_--u_o)/dt=−C·du_o/dt'},
      {text:'联立 u_i/R=−C·du_o/dt，积分得',latex:'u_o=-\\frac{1}{RC}\\int u_i\\,dt'},
    ] },

  { id:'op-differentiator', cat:'op-amp', title:'微分运算',
    latex:'u_o=-RC\\,\\frac{du_i}{dt}',
    symbols:['u_o','R','C','u_i','t'],
    note:'电容作输入元件，输出正比于输入的变化率(反相)；高频噪声易被放大，实用中需限幅',
    derivation:[
      {text:'电容作输入元件接反相端，反相端虚地 u_-=0'},
      {text:'电容电流 i=C·du_i/dt（输入电压全部加在电容上）'},
      {text:'虚断：i 全部流过反馈电阻 R，u_o=−iR'},
      {text:'代入',latex:'u_o=-RC\\,\\frac{du_i}{dt}'},
    ] },

  { id:'op-lp-filter', cat:'op-amp', title:'一阶有源低通滤波器截止频率',
    latex:'f_H=\\frac{1}{2\\pi RC}',
    symbols:['f_H','R','C','\\pi'],
    note:'RC 低通网络加同相放大构成一阶有源低通；低于 f_H 的信号通过，高于 f_H 的被衰减(−20 dB/十倍频)',
    derivation:[
      {text:'RC 低通网络传输函数',latex:'H=\\frac{1}{1+j\\omega RC}'},
      {text:'截止频率定义 |H|=1/√2（增益降 3 dB）'},
      {text:'|H|²=1/(1+(ωRC)²)=1/2 → ωRC=1'},
      {text:'解出',latex:'f_H=\\frac{1}{2\\pi RC}'},
    ] },

  { id:'op-hp-filter', cat:'op-amp', title:'一阶有源高通滤波器截止频率',
    latex:'f_L=\\frac{1}{2\\pi RC}',
    symbols:['f_L','R','C','\\pi'],
    note:'高通网络加放大构成一阶有源高通；高于 f_L 的信号通过，直流和低频被阻挡',
    derivation:[
      {text:'RC 高通网络传输函数',latex:'H=\\frac{j\\omega RC}{1+j\\omega RC}'},
      {text:'截止频率定义 |H|=1/√2（增益降 3 dB）'},
      {text:'|H|²=(ωRC)²/(1+(ωRC)²)=1/2 → ωRC=1'},
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
      {text:'振荡器为正反馈闭环系统，环路增益 AF(jω)'},
      {text:'维持等幅振荡要求信号经环路一周后幅度不变、相位同相'},
      {text:'幅度平衡 |AF|=1；相位平衡（正反馈）Σφ=∠A+∠F=2nπ',latex:'|AF|=1\\;\\text{且}\\;\\sum\\varphi=2n\\pi'},
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
      {text:'当 ωRC=1/(ωRC) 即 ω=1/RC 时，F 为实数且最大 F=1/3，相移为零'},
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
      {text:'电容三点式回路电容为 C_1 与 C_2 串联'},
      {text:'串联等效电容',latex:'C=\\frac{C_1 C_2}{C_1+C_2}'},
      {text:'代入 LC 谐振频率公式',latex:'f_0=\\frac{1}{2\\pi\\sqrt{L\\dfrac{C_1 C_2}{C_1+C_2}}}'},
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
      {text:'比较器输出 ±U_Z，正反馈阈值电压 ±F·U_Z（F=R_2/(R_1+R_2)）'},
      {text:'电容从 −FU_Z 充电趋向 +U_Z：u_c(t)=U_Z−U_Z(1+F)e^{−t/(RC)}'},
      {text:'令 u_c 达到 +FU_Z 求半周期',latex:'t_1=RC\\ln\\frac{1+F}{1-F}'},
      {text:'对称充放电，总周期',latex:'T=2t_1=2RC\\ln\\frac{1+F}{1-F}'},
    ] },

  /* ============== 第 8 章 功率放大电路 power-amp ★ ============== */
  { id:'pa-po-def', cat:'power-amp', title:'输出功率（定义）',
    latex:'P_o=\\frac{1}{2}U_{om}I_{om}=\\frac{U_{om}^2}{2R_L}',
    symbols:['P_o','U_{om}','I_{om}','R_L'],
    note:'输出电压/电流幅值确定的交流输出功率；U_om 最大为接近电源电压' },

  { id:'pa-ocl-pom', cat:'power-amp', title:'OCL 乙类互补功放最大输出功率',
    latex:'P_{om}=\\frac{V_{CC}^2}{2R_L}',
    symbols:['P_{om}','V_{CC}','R_L'],
    note:'双电源(U_om≈V_CC)互补对称电路理想最大输出功率；V_CC 越大、R_L 越小则 P_om 越大',
    derivation:[
      {text:'负载电压 u_o=U_{om}\\sin\\omega t，电流 i_o=(U_{om}/R_L)\\sin\\omega t'},
      {text:'一周期平均功率',latex:'P_o=\\frac{1}{T}\\int_0^T u_o i_o\\,dt=\\frac{U_{om}^2}{R_L}\\cdot\\frac{1}{T}\\int_0^T\\sin^2\\omega t\\,dt'},
      {text:'∫₀ᵀ sin²(ωt)dt=T/2，且 U_{om}≈V_{CC}',latex:'P_{om}=\\frac{V_{CC}^2}{2R_L}'},
    ] },

  { id:'pa-ocl-pv', cat:'power-amp', title:'OCL 最大输出时直流电源功率',
    latex:'P_V=\\frac{2V_{CC}^2}{\\pi R_L}',
    symbols:['P_V','V_{CC}','R_L','\\pi'],
    note:'两路电源提供的平均功率(输出最大时)；正负电源各承担一半',
    derivation:[
      {text:'每路电源提供半波电流，单路平均电流',latex:'I_{avg}=\\frac{1}{2\\pi}\\int_0^{\\pi}\\frac{V_{CC}}{R_L}\\sin\\theta\\,d\\theta=\\frac{V_{CC}}{\\pi R_L}'},
      {text:'两路电源总功率 P_V=2·V_{CC}·I_{avg}'},
      {text:'代入',latex:'P_V=\\frac{2V_{CC}^2}{\\pi R_L}'},
    ] },

  { id:'pa-ocl-eta', cat:'power-amp', title:'OCL 乙类最大效率',
    latex:'\\eta_{max}=\\frac{P_{om}}{P_V}=\\frac{\\pi}{4}\\approx 78.5\\%',
    symbols:['\\eta','P_{om}','P_V','\\pi'],
    note:'理想乙类互补功放最高效率 π/4≈78.5%，远高于甲类；实际受饱和压降影响约 60~70%',
    derivation:[
      {text:'最大输出时 P_{om}=V_{CC}²/(2R_L)，P_V=2V_{CC}²/(πR_L)'},
      {text:'效率 η=P_{om}/P_V',latex:'\\eta=\\frac{V_{CC}^2/(2R_L)}{2V_{CC}^2/(\\pi R_L)}=\\frac{\\pi}{4}\\approx 78.5\\%'},
    ] },

  { id:'pa-ocl-ptmax', cat:'power-amp', title:'单管最大管耗',
    latex:'P_T=\\frac{V_{CC}^2}{\\pi^2 R_L}\\approx 0.2\\,P_{om}',
    symbols:['P_T','V_{CC}','R_L','\\pi','P_{om}'],
    note:'每管最大耗散出现在 U_om=2V_CC/π 时(非最大输出时)，约为最大输出功率的 1/5；据此选散热器与功放管',
    derivation:[
      {text:'单管管耗 P_T=（电源供能 − 负载所得）/2，积分整理得',latex:'P_T=\\frac{1}{R_L}\\!\\left(\\frac{V_{CC}U_{om}}{\\pi}-\\frac{U_{om}^2}{4}\\right)'},
      {text:'对 U_{om} 求极值 dP_T/dU_{om}=0',latex:'\\frac{V_{CC}}{\\pi}-\\frac{U_{om}}{2}=0\\;\\Rightarrow\\;U_{om}=\\frac{2V_{CC}}{\\pi}'},
      {text:'代回得最大管耗',latex:'P_{Tmax}=\\frac{V_{CC}^2}{\\pi^2 R_L}'},
      {text:'与 P_{om}=V_{CC}²/(2R_L) 比较',latex:'\\frac{P_{Tmax}}{P_{om}}=\\frac{2}{\\pi^2}\\approx 0.2'},
    ] },

  { id:'pa-otl-pom', cat:'power-amp', title:'OTL 单电源功放最大输出功率',
    latex:'P_{om}=\\frac{V_{CC}^2}{8R_L}',
    symbols:['P_{om}','V_{CC}','R_L'],
    note:'单电源+输出电容(等效电源 V_CC/2)，最大输出功率为 OCL 的 1/4；输出端需接大耦合电容',
    derivation:[
      {text:'OTL 单电源 + 大耦合电容，等效电源电压 V_{CC}/2'},
      {text:'代入 OCL 最大输出功率公式（V_{CC}→V_{CC}/2）',latex:'P_{om}=\\frac{(V_{CC}/2)^2}{2R_L}'},
      {text:'化简',latex:'P_{om}=\\frac{V_{CC}^2}{8R_L}'},
    ] },

  { id:'pa-classa-eta', cat:'power-amp', title:'甲类放大最大效率（电阻负载）',
    latex:'\\eta_{max}=25\\%',
    symbols:['\\eta'],
    note:'甲类功放全周期导通，Q 点设在交流负载线中点，电阻负载时最高效率仅 25%(管耗大)',
    derivation:[
      {text:'甲类电阻负载，Q 点在交流负载线中点：I_{CQ}=V_{CC}/(2R_L)'},
      {text:'直流电源功率（与信号无关）',latex:'P_V=V_{CC}\\cdot I_{CQ}=\\frac{V_{CC}^2}{2R_L}'},
      {text:'最大交流输出 P_{om}=½·(V_{CC}/2)·I_{CQ}=V_{CC}²/(8R_L)'},
      {text:'最高效率',latex:'\\eta_{max}=\\frac{P_{om}}{P_V}=\\frac{1}{4}=25\\%'},
    ] },

  { id:'pa-classa-eta-tr', cat:'power-amp', title:'甲类放大最大效率（变压器耦合）',
    latex:'\\eta_{max}=50\\%',
    symbols:['\\eta'],
    note:'变压器耦合(理想)实现阻抗匹配、消除直流电阻损耗，甲类最高效率可达 50%',
    derivation:[
      {text:'变压器耦合消除直流电阻压降，输出电压幅值可达 U_{om}=V_{CC}（全摆幅）'},
      {text:'最大交流输出 P_{om}=½·V_{CC}·I_{CQ}'},
      {text:'直流功率 P_V=V_{CC}·I_{CQ}'},
      {text:'最高效率',latex:'\\eta_{max}=\\frac{P_{om}}{P_V}=\\frac{1}{2}=50\\%'},
    ] },

  /* ============== 第 9 章 直流稳压电源 power-supply ============== */
  { id:'ps-half-rect', cat:'power-supply', title:'半波整流输出直流电压',
    latex:'U_{o(AV)}\\approx 0.45\\,U_2',
    symbols:['U_{o(AV)}','U_2'],
    note:'U_2 为变压器次级电压有效值；半波整流只利用正(或负)半周，纹波大',
    derivation:[
      {text:'半波整流输出为正弦半波 u_o=√2 U_2 sin(ωt)（仅正半周）'},
      {text:'取一周期平均值',latex:'U_{o(AV)}=\\frac{1}{2\\pi}\\int_0^{\\pi}\\sqrt{2}\\,U_2\\sin\\theta\\,d\\theta'},
      {text:'计算定积分',latex:'U_{o(AV)}=\\frac{\\sqrt{2}\\,U_2}{2\\pi}[-\\cos\\theta]_0^{\\pi}=\\frac{\\sqrt{2}\\,U_2}{\\pi}'},
      {text:'数值',latex:'U_{o(AV)}\\approx 0.45\\,U_2'},
    ] },

  { id:'ps-full-rect', cat:'power-supply', title:'桥式(全波)整流输出直流电压',
    latex:'U_{o(AV)}\\approx 0.9\\,U_2',
    symbols:['U_{o(AV)}','U_2'],
    note:'桥式整流利用了整个周期，输出直流电压为半波的两倍；每只二极管承受反向峰值 √2·U_2',
    derivation:[
      {text:'全波整流输出为 |√2 U_2 sin(ωt)|，两半周都利用'},
      {text:'取一周期平均值（全波周期为 π）',latex:'U_{o(AV)}=\\frac{1}{\\pi}\\int_0^{\\pi}\\sqrt{2}\\,U_2\\sin\\theta\\,d\\theta'},
      {text:'计算定积分',latex:'U_{o(AV)}=\\frac{\\sqrt{2}\\,U_2}{\\pi}[-\\cos\\theta]_0^{\\pi}=\\frac{2\\sqrt{2}\\,U_2}{\\pi}'},
      {text:'数值',latex:'U_{o(AV)}\\approx 0.9\\,U_2'},
    ] },

  { id:'ps-cap-noload', cat:'power-supply', title:'电容滤波输出电压（空载）',
    latex:'U_o\\approx\\sqrt{2}\\,U_2\\approx 1.414\\,U_2',
    symbols:['U_o','U_2'],
    note:'空载时电容充电至峰值且无放电通路，输出等于交流峰值 √2·U_2',
    derivation:[
      {text:'空载时电容在电压峰值时刻充电至变压器次级电压峰值'},
      {text:'无放电通路（负载开路），输出保持峰值不变'},
      {text:'输出电压',latex:'U_o=\\sqrt{2}\\,U_2\\approx 1.414\\,U_2'},
    ] },

  { id:'ps-cap-load', cat:'power-supply', title:'电容滤波输出电压（带载估算）',
    latex:'U_o\\approx 1.2\\,U_2',
    symbols:['U_o','U_2'],
    note:'正常带载(RL·C 较大、放电较慢)时工程估算输出约 1.2 U_2，介于 0.9 U_2 与 √2 U_2 之间' },

  { id:'ps-zener-rmax', cat:'power-supply', title:'稳压管限流电阻上限',
    latex:'R_{\\max}=\\frac{U_{I\\min}-U_Z}{I_{Z\\min}+I_{L\\max}}',
    symbols:['R','U_I','U_Z','I_Z','I_L'],
    note:'为保证最小输入电压、最大负载电流下稳压管仍工作于稳压区(I_Z≥I_{Zmin})，R 不得超过此值' },

  { id:'ps-zener-rmin', cat:'power-supply', title:'稳压管限流电阻下限',
    latex:'R_{\\min}=\\frac{U_{I\\max}-U_Z}{I_{Z\\max}+I_{L\\min}}',
    symbols:['R','U_I','U_Z','I_Z','I_L'],
    note:'为保证最大输入电压、最小负载电流下稳压管不致损坏(I_Z≤I_{Zmax})，R 不得小于此值。R 须取在 R_min~R_max 之间' },

  { id:'ps-series-reg', cat:'power-supply', title:'串联型稳压输出电压',
    latex:'U_o=\\frac{R_1+R_2}{R_2}\\,U_Z',
    symbols:['U_o','R_1','R_2','U_Z'],
    note:'取样比决定输出：U_o=U_Z/取样比；调节 R_1/R_2(电位器)即可改变输出，输出恒大于 U_Z',
    derivation:[
      {text:'取样电路 R_1、R_2 对输出分压，反馈到比较放大器反相端'},
      {text:'运放虚短 U_-=U_+=U_Z，取样电压',latex:'U_-=U_o\\cdot\\frac{R_2}{R_1+R_2}=U_Z'},
      {text:'解出输出电压',latex:'U_o=\\frac{R_1+R_2}{R_2}\\,U_Z'},
    ] },

  { id:'ps-three-terminal', cat:'power-supply', title:'可调三端稳压器输出（LM317）',
    latex:'U_o=U_{REF}\\left(1+\\frac{R_2}{R_1}\\right)',
    symbols:['U_o','U_{REF}','R_2','R_1'],
    note:'LM317 基准 U_REF≈1.25 V 接于输出与调整端之间，调节 R_2 可得 1.25~37 V 连续可调输出',
    derivation:[
      {text:'LM317 内部基准 U_{REF}≈1.25 V 恒定接于输出端与调整端之间'},
      {text:'R_1 上电流为 U_{REF}/R_1，调整端电流 I_{ADJ}≈0（可忽略）'},
      {text:'R_2 上压降为 (U_{REF}/R_1)·R_2，输出电压为基准加 R_2 压降'},
      {text:'整理',latex:'U_o=U_{REF}\\left(1+\\frac{R_2}{R_1}\\right)'},
    ] },

];

/* ---- 3. 符号定义字典 ---------------------------------------------------- */
export const MODIAN_SYMBOLS: SymbolDict = {
  /* —— 希腊字母 / 算子 —— */
  '\\beta':        { name:'β 共射电流放大系数', desc:'直流 β=I_C/I_B，交流 β=ΔI_C/ΔI_B；方波发生器中亦作正反馈分压比', unit:'−' },
  '\\alpha':       { name:'α 共基电流放大系数', desc:'α=I_C/I_E=β/(1+β)，略小于 1', unit:'−' },
  '\\eta':         { name:'效率 η',            desc:'输出功率与电源功率之比', unit:'−' },
  '\\pi':          { name:'圆周率 π',          desc:'≈3.14159', unit:'−' },
  '\\varphi':      { name:'相角 φ',            desc:'信号的相位；反馈/振荡中用于相位条件', unit:'rad' },
  '\\Delta':       { name:'增量 Δ',            desc:'物理量的变化量(差分)', unit:'−' },

  /* —— 二极管 / 稳压管 —— */
  'I':             { name:'二极管电流',       desc:'PN 结(二极管)正向或反向电流', unit:'A' },
  'U':             { name:'二极管端电压',     desc:'PN 结(二极管)两端电压(正偏为正)', unit:'V' },
  'I_S':           { name:'反向饱和电流',     desc:'PN 结反向饱和电流，温度敏感', unit:'A' },
  'U_T':           { name:'热电压',           desc:'U_T=kT/q≈26 mV(常温)，温度当量', unit:'V' },
  'U_Z':           { name:'稳定电压',         desc:'稳压管工作于反向击穿区的稳定电压', unit:'V' },
  'I_Z':           { name:'稳压管工作电流',   desc:'流过稳压管的工作电流(I_Zmin~I_Zmax)', unit:'A' },
  'r_Z':           { name:'稳压管动态电阻',   desc:'稳压区电压微变与电流微变之比', unit:'Ω' },

  /* —— 三极管电流 —— */
  'I_B':           { name:'基极电流',         desc:'流入基极的电流', unit:'A' },
  'I_C':           { name:'集电极电流',       desc:'流入集电极的电流', unit:'A' },
  'I_E':           { name:'发射极电流',       desc:'流出发射极的电流', unit:'A' },
  'I_{CEO}':       { name:'穿透电流',         desc:'基极开路时 c-e 间电流，=(1+β)I_{CBO}', unit:'A' },
  'I_{CBO}':       { name:'集基反向饱和电流', desc:'发射极开路时集电结反向饱和电流', unit:'A' },

  /* —— 场效应管 —— */
  'g_m':           { name:'跨导',             desc:'ΔI_D/ΔU_{GS}，表征栅压对漏流的控制', unit:'S' },
  'I_D':           { name:'漏极电流',         desc:'场效应管漏极电流', unit:'A' },
  'I_{DQ}':        { name:'静态漏极电流',     desc:'场效应管静态工作点漏极电流', unit:'A' },
  'U_{GS}':        { name:'栅源电压',         desc:'场效应管栅极-源极电压', unit:'V' },
  'V_{TN}':        { name:'开启电压',         desc:'增强型 NMOS 导通临界栅源电压', unit:'V' },
  'K_n':           { name:'MOS 跨导参数',     desc:'与工艺/宽长比有关的常数', unit:'A/V²' },

  /* —— 静态工作点（Q 点）—— */
  'I_{BQ}':        { name:'基极静态电流',     desc:'Q 点基极电流', unit:'A' },
  'I_{CQ}':        { name:'集电极静态电流',   desc:'Q 点集电极电流', unit:'A' },
  'I_{EQ}':        { name:'发射极静态电流',   desc:'Q 点发射极电流', unit:'A' },
  'U_{BQ}':        { name:'基极静态电位',     desc:'分压偏置下基极对地的直流电位', unit:'V' },
  'U_{BEQ}':       { name:'静态发射结电压',   desc:'硅管约 0.7 V、锗管约 0.3 V', unit:'V' },
  'U_{CEQ}':       { name:'静态管压降',       desc:'Q 点集电极-发射极电压', unit:'V' },
  'V_{CC}':        { name:'集电极直流电源',   desc:'放大电路正电源电压(双电源中亦记 ±V_CC)', unit:'V' },

  /* —— 微变等效电阻 —— */
  'r_{be}':        { name:'发射结等效电阻',   desc:'b-e 间交流输入电阻=r_bb\'+(1+β)U_T/I_EQ', unit:'Ω' },
  "r_{bb'}":       { name:'基区体电阻',       desc:'低频小功率管约 200~300 Ω', unit:'Ω' },

  /* —— 交流信号 —— */
  'u_i':           { name:'输入电压',         desc:'放大/运放电路交流输入电压', unit:'V' },
  'u_o':           { name:'输出电压',         desc:'放大/运放电路交流输出电压', unit:'V' },
  'i_i':           { name:'输入电流',         desc:'输入端电流', unit:'A' },
  'i_o':           { name:'输出电流',         desc:'输出端电流', unit:'A' },

  /* —— 增益 —— */
  'A_u':           { name:'电压放大倍数',     desc:'输出与输入电压之比(电压增益)', unit:'−' },
  'A_{u1}':        { name:'第一级增益',       desc:'多级放大第一级电压增益', unit:'−' },
  'A_{u2}':        { name:'第二级增益',       desc:'多级放大第二级电压增益', unit:'−' },
  'A_{un}':        { name:'第 n 级增益',      desc:'多级放大第 n 级电压增益', unit:'−' },
  'A_{um}':        { name:'中频增益',         desc:'中频段电压增益', unit:'−' },
  'A_d':           { name:'差模放大倍数',     desc:'差放对差模信号的电压增益', unit:'−' },
  'A_c':           { name:'共模放大倍数',     desc:'差放对共模信号的电压增益', unit:'−' },

  /* —— 电阻 —— */
  'R_i':           { name:'输入电阻',         desc:'从输入端看入的等效电阻', unit:'Ω' },
  'R_o':           { name:'输出电阻',         desc:'戴维南等效输出内阻', unit:'Ω' },
  'R_{i1}':        { name:'第一级输入电阻',   desc:'多级放大第一级输入电阻', unit:'Ω' },
  'R_{on}':        { name:'末级输出电阻',     desc:'多级放大最后一级输出电阻', unit:'Ω' },
  'R_b':           { name:'基极偏置电阻',     desc:'接基极的偏置电阻', unit:'Ω' },
  'R_{b1}':        { name:'上偏置电阻',       desc:'分压偏置中接电源一侧电阻', unit:'Ω' },
  'R_{b2}':        { name:'下偏置电阻',       desc:'分压偏置中接地一侧电阻', unit:'Ω' },
  'R_c':           { name:'集电极电阻',       desc:'集电极负载电阻', unit:'Ω' },
  'R_e':           { name:'发射极电阻',       desc:'发射极电阻(常引入负反馈稳 Q)', unit:'Ω' },
  'R_L':           { name:'负载电阻',         desc:'放大电路外接负载', unit:'Ω' },
  'R_f':           { name:'反馈电阻',         desc:'运放反馈支路电阻', unit:'Ω' },
  'R_s':           { name:'信号源内阻',       desc:'信号源等效内阻', unit:'Ω' },
  'R_1':           { name:'电阻 R1',          desc:'通用编号电阻 1', unit:'Ω' },
  'R_2':           { name:'电阻 R2',          desc:'通用编号电阻 2', unit:'Ω' },
  'R':             { name:'电阻 R',           desc:'通用电阻(积分/微分/滤波/限流/选频元件)', unit:'Ω' },

  /* —— 差放 / 运放端口 —— */
  'u_{id}':        { name:'差模输入信号',     desc:'两输入端电压之差', unit:'V' },
  'u_{ic}':        { name:'共模输入信号',     desc:'两输入端电压平均值', unit:'V' },
  'u_{i1}':        { name:'输入电压 1',       desc:'差放/求和第一路输入', unit:'V' },
  'u_{i2}':        { name:'输入电压 2',       desc:'差放/求和第二路输入', unit:'V' },
  'CMRR':          { name:'共模抑制比',       desc:'|A_d/A_c|，越大抗共模干扰越强(渲染作 \\mathrm{CMRR})', unit:'−' },
  'u_+':           { name:'同相端电位',       desc:'运放同相(+)输入端电位', unit:'V' },
  'u_-':           { name:'反相端电位',       desc:'运放反相(−)输入端电位', unit:'V' },
  'i_+':           { name:'同相端电流',       desc:'流入同相端的电流(理想为 0)', unit:'A' },
  'i_-':           { name:'反相端电流',       desc:'流入反相端的电流(理想为 0)', unit:'A' },
  'I_{REF}':       { name:'基准电流',         desc:'电流源参考电流', unit:'A' },
  'I_{C2}':        { name:'镜像输出电流',     desc:'镜像电流源输出支路集电极电流', unit:'A' },
  'U_{BE}':        { name:'发射结导通电压',   desc:'约 0.6~0.7 V(硅)', unit:'V' },

  /* —— 反馈 —— */
  'A':             { name:'开环放大倍数',     desc:'无反馈(开环)增益；振荡条件中作环路放大环节', unit:'−' },
  'F':             { name:'反馈系数',         desc:'反馈网络传输比；方波发生器中为正反馈分压比', unit:'−' },
  'A_f':           { name:'闭环放大倍数',     desc:'加负反馈后的增益 A/(1+AF)', unit:'−' },
  'R_{if}':        { name:'闭环输入电阻',     desc:'加反馈后的输入电阻', unit:'Ω' },
  'R_{of}':        { name:'闭环输出电阻',     desc:'加反馈后的输出电阻', unit:'Ω' },

  /* —— 频率 —— */
  'f_H':           { name:'上限频率',         desc:'幅频曲线下降 3 dB 的上限截止频率', unit:'Hz' },
  'f_L':           { name:'下限频率',         desc:'幅频曲线下降 3 dB 的下限截止频率', unit:'Hz' },
  'f_{Hn}':        { name:'n 级上限频率',     desc:'n 级相同级联后的总上限频率', unit:'Hz' },
  'f_{Hf}':        { name:'闭环上限频率',     desc:'加负反馈后的上限频率', unit:'Hz' },
  'f_{Lf}':        { name:'闭环下限频率',     desc:'加负反馈后的下限频率', unit:'Hz' },
  'f_0':           { name:'中心/振荡频率',    desc:'振荡器或滤波器的中心频率', unit:'Hz' },
  'n':             { name:'级数 / 整数',      desc:'多级级数；振荡相位条件 2nπ 中的整数', unit:'−' },
  'GBP':           { name:'增益带宽积',       desc:'|A_um|·f_H(渲染作 \\mathrm{GBP})', unit:'Hz' },

  /* —— 运放元件 / 参考量 —— */
  'C':             { name:'电容',             desc:'通用电容(积分/微分/滤波/选频)', unit:'F' },
  'L':             { name:'电感',             desc:'通用电感(LC 回路/晶体等效)', unit:'H' },
  'C_1':           { name:'电容 C1',          desc:'电容三点式回路电容 1', unit:'F' },
  'C_2':           { name:'电容 C2',          desc:'电容三点式回路电容 2', unit:'F' },
  't':             { name:'时间',             desc:'积分/微分的时间变量', unit:'s' },
  'U_{REF}':       { name:'基准电压',         desc:'稳压器/比较器内部基准(LM317 约 1.25 V)', unit:'V' },
  'T':             { name:'周期',             desc:'方波/三角波周期', unit:'s' },

  /* —— 功率放大 —— */
  'P_o':           { name:'输出功率',         desc:'功放交流输出功率', unit:'W' },
  'U_{om}':        { name:'输出电压幅值',     desc:'负载上交流电压峰值', unit:'V' },
  'I_{om}':        { name:'输出电流幅值',     desc:'负载上交流电流峰值', unit:'A' },
  'P_{om}':        { name:'最大输出功率',     desc:'功放理想最大不失真输出功率', unit:'W' },
  'P_V':           { name:'电源功率',         desc:'直流电源提供的平均功率', unit:'W' },
  'P_T':           { name:'单管管耗',         desc:'每只功放管集电极耗散功率', unit:'W' },

  /* —— 直流电源 —— */
  'U_{o(AV)}':     { name:'整流输出平均值',   desc:'整流后输出直流(平均)电压', unit:'V' },
  'U_2':           { name:'变压器次级有效值', desc:'整流变压器次级电压有效值', unit:'V' },
  'U_o':           { name:'直流输出电压',     desc:'滤波/稳压后输出的直流电压(注意大写，区别于交流 u_o)', unit:'V' },
  'U_I':           { name:'稳压输入电压',     desc:'稳压电路输入(滤波后)电压', unit:'V' },
  'I_L':           { name:'负载电流',         desc:'稳压电源输出的负载电流', unit:'A' },
};

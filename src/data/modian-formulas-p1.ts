/* 公式分片 1：第 1 章 半导体器件 device */
import type { Formula } from './types';

export const MODIAN_FORMULAS_P1: Formula[] = [

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
      {text:'共基电流放大系数定义 $\\alpha=I_C/I_E$'},
      {text:'由 KCL $I_E=I_B+I_C$，及 $I_C=\\beta I_B$ 得 $I_E=I_B+\\beta I_B=(1+\\beta)I_B$'},
      {text:'代入 $\\alpha=I_C/I_E=\\beta I_B/((1+\\beta)I_B)$',latex:'\\alpha=\\frac{\\beta}{1+\\beta}'},
    ] },

  { id:'dv-bjt-iceo', cat:'device', title:'穿透电流与集基反向饱和电流',
    latex:'I_{CEO}=(1+\\beta)I_{CBO}',
    symbols:['I_{CEO}','\\beta','I_{CBO}'],
    note:'基极开路时 c-e 间的穿透电流；I_{CBO} 为发射极开路时集电结反向饱和电流。硅管 I_{CEO} 很小(μA 级)',
    derivation:[
      {text:'$I_{CBO}$ 为发射极开路时集电结反向饱和电流'},
      {text:'基极开路（$I_B=0$）时，$I_{CBO}$ 相当于流入基极的电流，被三极管放大 $\\beta$ 倍'},
      {text:'故 c-e 间穿透电流为 $I_{CBO}$ 本身加其放大结果',latex:'I_{CEO}=I_{CBO}+\\beta I_{CBO}=(1+\\beta)I_{CBO}'},
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
      {text:'饱和区电流方程（$K_n=\\mu_n C_{ox} W/L$）',latex:'I_D=\\frac{K_n}{2}(U_{GS}-V_{TN})^2'},
      {text:'跨导定义 $g_m=\\frac{\\partial I_D}{\\partial U_{GS}}=K_n(U_{GS}-V_{TN})$'},
      {text:'由电流方程解出 $U_{GS}-V_{TN}=\\sqrt{2I_D/K_n}$，代入',latex:'g_m=K_n\\sqrt{\\frac{2I_D}{K_n}}=\\sqrt{2K_n I_D}'},
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
      {text:'$r_{be}$ 由基区体电阻 $r_{bb\'}$ 和发射结等效电阻 $r_e$ 串联组成（$r_e$ 折算到基极）'},
      {text:'发射结微分电阻 $r_e=U_T/I_{EQ}$（由 PN 结电流方程求导）'},
      {text:'折算到基极侧乘 $(1+\\beta)$（因 $I_E=(1+\\beta)I_B$）',latex:"r_{be}=r_{bb'}+(1+\\beta)\\frac{U_T}{I_{EQ}}"},
    ] },

  { id:'ba-ce-au', cat:'basic-amp', title:'共射电路动态电压放大倍数',
    latex:'A_u=-\\frac{\\beta\\left(R_c\\parallel R_L\\right)}{r_{be}}',
    symbols:['A_u','\\beta','R_c','R_L','r_{be}'],
    note:'负号表示输出与输入反相；接负载 R_L 后增益下降(因 R_c∥R_L 变小)',
    derivation:[
      {text:'微变等效电路输入回路：$u_i=i_b r_{be}$'},
      {text:'输出回路：受控电流源 $\\beta i_b$ 流过并联负载，输出电压取负',latex:'u_o=-\\beta i_b(R_c\\parallel R_L)'},
      {text:'电压增益',latex:'A_u=\\frac{u_o}{u_i}=-\\frac{\\beta(R_c\\parallel R_L)}{r_{be}}'},
    ] },

  { id:'ba-ce-ri', cat:'basic-amp', title:'共射电路输入电阻',
    latex:'R_i=R_b\\parallel r_{be}',
    symbols:['R_i','R_b','r_{be}'],
    note:'共射放大输入电阻主要由 r_be 决定(约 1~3 kΩ)，偏置电阻并联使总电阻略降',
    derivation:[
      {text:'从输入端看入，偏置电阻 $R_b$ 与三极管输入电阻 $r_{be}$ 并联'},
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
      {text:'射随器微变等效：输入电压加在 $r_{be}$ 与发射极负载上',latex:'u_i=i_b r_{be}+(1+\\beta)i_b(R_e\\parallel R_L)'},
      {text:'输出电压取自发射极',latex:'u_o=(1+\\beta)i_b(R_e\\parallel R_L)'},
      {text:'电压增益',latex:'A_u=\\frac{(1+\\beta)(R_e\\parallel R_L)}{r_{be}+(1+\\beta)(R_e\\parallel R_L)}\\approx 1'},
    ] },

  { id:'ba-cc-ri', cat:'basic-amp', title:'共集电极电路输入电阻',
    latex:'R_i=R_b\\parallel\\left[r_{be}+(1+\\beta)(R_e\\parallel R_L)\\right]',
    symbols:['R_i','R_b','r_{be}','\\beta','R_e','R_L'],
    note:'射随器输入电阻很高(受基极偏置电阻 R_b 并联所限)，适合作高阻输入级',
    derivation:[
      {text:'从基极看入的等效电阻 = $r_{be}$ + 发射极负载折算到基极'},
      {text:'发射极电阻 $(R_e\\parallel R_L)$ 折算到基极需乘 $(1+\\beta)$',latex:'R_i\'=r_{be}+(1+\\beta)(R_e\\parallel R_L)'},
      {text:'并联偏置电阻',latex:'R_i=R_b\\parallel R_i\''},
    ] },

  { id:'ba-cc-ro', cat:'basic-amp', title:'共集电极电路输出电阻',
    latex:'R_o\\approx\\frac{r_{be}+R_s}{1+\\beta}',
    symbols:['R_o','r_{be}','R_s','\\beta'],
    note:'射随器输出电阻很小(几十 Ω)，带载能力强；R_s 为信号源内阻',
    derivation:[
      {text:'求输出电阻：令 $u_i=0$（信号源短路到地，保留内阻 $R_s$）'},
      {text:'从发射极看入，基极回路总电阻 $(r_{be}+R_s)$ 折算到发射极除以 $(1+\\beta)$'},
      {text:'输出电阻',latex:'R_o\\approx\\frac{r_{be}+R_s}{1+\\beta}'},
    ] },

  { id:'ba-cb-au', cat:'basic-amp', title:'共基极电路电压放大倍数',
    latex:'A_u=\\frac{\\beta\\left(R_c\\parallel R_L\\right)}{r_{be}}',
    symbols:['A_u','\\beta','R_c','R_L','r_{be}'],
    note:'数值与共射相同但输出与输入同相(不反相)；频带宽，适合作高频/宽频带放大',
    derivation:[
      {text:'共基电路基极交流接地，输入加在发射极'},
      {text:'输入电压 $u_i=i_b r_{be}$，输出 $u_o=\\beta i_b(R_c\\parallel R_L)$（同相）'},
      {text:'电压增益',latex:'A_u=\\frac{\\beta(R_c\\parallel R_L)}{r_{be}}'},
    ] },

  { id:'ba-cb-ri', cat:'basic-amp', title:'共基极电路输入电阻',
    latex:'R_i\\approx\\frac{r_{be}}{1+\\beta}',
    symbols:['R_i','r_{be}','\\beta'],
    note:'共基极输入电阻很低(几十 Ω)，与共射/共集形成互补' },

];

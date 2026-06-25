/* 符号定义字典 ------------------------------------------------------ */
import type { SymbolDict } from './types';

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

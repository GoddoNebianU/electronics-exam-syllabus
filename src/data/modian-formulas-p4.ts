/* 公式分片 4：第 8 章 功率放大电路 power-amp ★ */
import type { Formula } from './types';

export const MODIAN_FORMULAS_P4: Formula[] = [
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
      {text:'负载电压 $u_o=U_{om}\\sin\\omega t$，电流 $i_o=(U_{om}/R_L)\\sin\\omega t$'},
      {text:'一周期平均功率',latex:'P_o=\\frac{1}{T}\\int_0^T u_o i_o\\,dt=\\frac{U_{om}^2}{R_L}\\cdot\\frac{1}{T}\\int_0^T\\sin^2\\omega t\\,dt'},
      {text:'$\\int_0^T\\sin^2(\\omega t)\\,dt=T/2$，且 $U_{om}\\approx V_{CC}$',latex:'P_{om}=\\frac{V_{CC}^2}{2R_L}'},
    ] },

  { id:'pa-ocl-pv', cat:'power-amp', title:'OCL 最大输出时直流电源功率',
    latex:'P_V=\\frac{2V_{CC}^2}{\\pi R_L}',
    symbols:['P_V','V_{CC}','R_L','\\pi'],
    note:'两路电源提供的平均功率(输出最大时)；正负电源各承担一半',
    derivation:[
      {text:'每路电源提供半波电流，单路平均电流',latex:'I_{avg}=\\frac{1}{2\\pi}\\int_0^{\\pi}\\frac{V_{CC}}{R_L}\\sin\\theta\\,d\\theta=\\frac{V_{CC}}{\\pi R_L}'},
      {text:'两路电源总功率 $P_V=2\\cdot V_{CC}\\cdot I_{avg}$'},
      {text:'代入',latex:'P_V=\\frac{2V_{CC}^2}{\\pi R_L}'},
    ] },

  { id:'pa-ocl-eta', cat:'power-amp', title:'OCL 乙类最大效率',
    latex:'\\eta_{max}=\\frac{P_{om}}{P_V}=\\frac{\\pi}{4}\\approx 78.5\\%',
    symbols:['\\eta','P_{om}','P_V','\\pi'],
    note:'理想乙类互补功放最高效率 π/4≈78.5%，远高于甲类；实际受饱和压降影响约 60~70%',
    derivation:[
      {text:'最大输出时 $P_{om}=V_{CC}^2/(2R_L)$，$P_V=2V_{CC}^2/(\\pi R_L)$'},
      {text:'效率 $\\eta=P_{om}/P_V$',latex:'\\eta=\\frac{V_{CC}^2/(2R_L)}{2V_{CC}^2/(\\pi R_L)}=\\frac{\\pi}{4}\\approx 78.5\\%'},
    ] },

  { id:'pa-ocl-ptmax', cat:'power-amp', title:'单管最大管耗',
    latex:'P_T=\\frac{V_{CC}^2}{\\pi^2 R_L}\\approx 0.2\\,P_{om}',
    symbols:['P_T','V_{CC}','R_L','\\pi','P_{om}'],
    note:'每管最大耗散出现在 U_om=2V_CC/π 时(非最大输出时)，约为最大输出功率的 1/5；据此选散热器与功放管',
    derivation:[
      {text:'单管管耗 $P_T=\\frac{\\text{电源供能}-\\text{负载所得}}{2}$，积分整理得',latex:'P_T=\\frac{1}{R_L}\\!\\left(\\frac{V_{CC}U_{om}}{\\pi}-\\frac{U_{om}^2}{4}\\right)'},
      {text:'对 $U_{om}$ 求极值 $dP_T/dU_{om}=0$',latex:'\\frac{V_{CC}}{\\pi}-\\frac{U_{om}}{2}=0\\;\\Rightarrow\\;U_{om}=\\frac{2V_{CC}}{\\pi}'},
      {text:'代回得最大管耗',latex:'P_{Tmax}=\\frac{V_{CC}^2}{\\pi^2 R_L}'},
      {text:'与 $P_{om}=V_{CC}^2/(2R_L)$ 比较',latex:'\\frac{P_{Tmax}}{P_{om}}=\\frac{2}{\\pi^2}\\approx 0.2'},
    ] },

  { id:'pa-otl-pom', cat:'power-amp', title:'OTL 单电源功放最大输出功率',
    latex:'P_{om}=\\frac{V_{CC}^2}{8R_L}',
    symbols:['P_{om}','V_{CC}','R_L'],
    note:'单电源+输出电容(等效电源 V_CC/2)，最大输出功率为 OCL 的 1/4；输出端需接大耦合电容',
    derivation:[
      {text:'OTL 单电源 + 大耦合电容，等效电源电压 $V_{CC}/2$'},
      {text:'代入 OCL 最大输出功率公式（$V_{CC}\\to V_{CC}/2$）',latex:'P_{om}=\\frac{(V_{CC}/2)^2}{2R_L}'},
      {text:'化简',latex:'P_{om}=\\frac{V_{CC}^2}{8R_L}'},
    ] },

  { id:'pa-classa-eta', cat:'power-amp', title:'甲类放大最大效率（电阻负载）',
    latex:'\\eta_{max}=25\\%',
    symbols:['\\eta'],
    note:'甲类功放全周期导通，Q 点设在交流负载线中点，电阻负载时最高效率仅 25%(管耗大)',
    derivation:[
      {text:'甲类电阻负载，$Q$ 点在交流负载线中点：$I_{CQ}=V_{CC}/(2R_L)$'},
      {text:'直流电源功率（与信号无关）',latex:'P_V=V_{CC}\\cdot I_{CQ}=\\frac{V_{CC}^2}{2R_L}'},
      {text:'最大交流输出 $P_{om}=\\tfrac{1}{2}\\cdot(V_{CC}/2)\\cdot I_{CQ}=V_{CC}^2/(8R_L)$'},
      {text:'最高效率',latex:'\\eta_{max}=\\frac{P_{om}}{P_V}=\\frac{1}{4}=25\\%'},
    ] },

  { id:'pa-classa-eta-tr', cat:'power-amp', title:'甲类放大最大效率（变压器耦合）',
    latex:'\\eta_{max}=50\\%',
    symbols:['\\eta'],
    note:'变压器耦合(理想)实现阻抗匹配、消除直流电阻损耗，甲类最高效率可达 50%',
    derivation:[
      {text:'变压器耦合消除直流电阻压降，输出电压幅值可达 $U_{om}=V_{CC}$（全摆幅）'},
      {text:'最大交流输出 $P_{om}=\\tfrac{1}{2}\\cdot V_{CC}\\cdot I_{CQ}$'},
      {text:'直流功率 $P_V=V_{CC}\\cdot I_{CQ}$'},
      {text:'最高效率',latex:'\\eta_{max}=\\frac{P_{om}}{P_V}=\\frac{1}{2}=50\\%'},
    ] },

  /* ============== 第 9 章 直流稳压电源 power-supply ============== */
  { id:'ps-half-rect', cat:'power-supply', title:'半波整流输出直流电压',
    latex:'U_{o(AV)}\\approx 0.45\\,U_2',
    symbols:['U_{o(AV)}','U_2'],
    note:'U_2 为变压器次级电压有效值；半波整流只利用正(或负)半周，纹波大',
    derivation:[
      {text:'半波整流输出为正弦半波 $u_o=\\sqrt{2}\\,U_2\\sin(\\omega t)$（仅正半周）'},
      {text:'取一周期平均值',latex:'U_{o(AV)}=\\frac{1}{2\\pi}\\int_0^{\\pi}\\sqrt{2}\\,U_2\\sin\\theta\\,d\\theta'},
      {text:'计算定积分',latex:'U_{o(AV)}=\\frac{\\sqrt{2}\\,U_2}{2\\pi}[-\\cos\\theta]_0^{\\pi}=\\frac{\\sqrt{2}\\,U_2}{\\pi}'},
      {text:'数值',latex:'U_{o(AV)}\\approx 0.45\\,U_2'},
    ] },

  { id:'ps-full-rect', cat:'power-supply', title:'桥式(全波)整流输出直流电压',
    latex:'U_{o(AV)}\\approx 0.9\\,U_2',
    symbols:['U_{o(AV)}','U_2'],
    note:'桥式整流利用了整个周期，输出直流电压为半波的两倍；每只二极管承受反向峰值 √2·U_2',
    derivation:[
      {text:'全波整流输出为 $|\\sqrt{2}\\,U_2\\sin(\\omega t)|$，两半周都利用'},
      {text:'取一周期平均值（全波周期为 $\\pi$）',latex:'U_{o(AV)}=\\frac{1}{\\pi}\\int_0^{\\pi}\\sqrt{2}\\,U_2\\sin\\theta\\,d\\theta'},
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
      {text:'取样电路 $R_1$、$R_2$ 对输出分压，反馈到比较放大器反相端'},
      {text:'运放虚短 $U_-=U_+=U_Z$，取样电压',latex:'U_-=U_o\\cdot\\frac{R_2}{R_1+R_2}=U_Z'},
      {text:'解出输出电压',latex:'U_o=\\frac{R_1+R_2}{R_2}\\,U_Z'},
    ] },

  { id:'ps-three-terminal', cat:'power-supply', title:'可调三端稳压器输出（LM317）',
    latex:'U_o=U_{REF}\\left(1+\\frac{R_2}{R_1}\\right)',
    symbols:['U_o','U_{REF}','R_2','R_1'],
    note:'LM317 基准 U_REF≈1.25 V 接于输出与调整端之间，调节 R_2 可得 1.25~37 V 连续可调输出',
    derivation:[
      {text:'LM317 内部基准 $U_{REF}\\approx 1.25\\,\\mathrm{V}$ 恒定接于输出端与调整端之间'},
      {text:'$R_1$ 上电流为 $U_{REF}/R_1$，调整端电流 $I_{ADJ}\\approx 0$（可忽略）'},
      {text:'$R_2$ 上压降为 $(U_{REF}/R_1)\\cdot R_2$，输出电压为基准加 $R_2$ 压降'},
      {text:'整理',latex:'U_o=U_{REF}\\left(1+\\frac{R_2}{R_1}\\right)'},
    ] },

];

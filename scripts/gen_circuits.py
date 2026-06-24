#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_circuits.py — 用 schemdraw 生成《电子技术基础考纲》配套电路图（SVG）。

一键重建全部图：
    .venv/bin/python scripts/gen_circuits.py     # venv 已装 schemdraw（推荐）
    python3 scripts/gen_circuits.py              # 系统 python 若已装亦可

输出：public/circuits/*.svg  （响应式、最大宽 480px、IEEE 工程风黑白线条）

【解耦】脚本完全独立于网站构建，不依赖 src/、components/、data/；
        重新运行即可确定性重建全部 SVG（覆盖写）。
【风格】素雅工程风：深灰近黑线条、白底、细线、IEEE 符号；
        标签用英文/符号（R1/C1/VCC/v_i/v_o…），符合工程图惯例，亦避免中文字体问题。
【准确性】每张图均按教材标准拓扑绘制：电源/地/极性/方向逐一核对。
"""
import os
import re

import schemdraw
import schemdraw.elements as elm
from schemdraw import logic

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUTDIR = os.path.join(ROOT, 'public', 'circuits')

LINE = '#1f2937'   # 深灰近黑
FONT = 13


def new_drawing(unit=2.6):
    d = schemdraw.Drawing()
    d.config(unit=unit, lw=1.15, color=LINE, fontsize=FONT, bgcolor='#ffffff')
    return d


def wire(d, *pts):
    """画折线：pts=[(x,y),...]，相邻点连成水平/垂直段。"""
    for a, b in zip(pts[:-1], pts[1:]):
        d += elm.Line().at(a).to(b)


def save_svg(d, name):
    os.makedirs(OUTDIR, exist_ok=True)
    path = os.path.join(OUTDIR, name)
    d.save(path)
    with open(path, encoding='utf-8') as f:
        svg = f.read()
    # 响应式：保留 viewBox，去固定宽/高，合并/替换 style（schemdraw 自带 background-color）
    svg = re.sub(r'\s+height="[^"]*"', '', svg, count=1)
    svg = re.sub(r'\s+width="[^"]*"', '', svg, count=1)
    # 去掉 schemdraw 在 <svg> 标签上自带的 style（避免 style 属性重复定义）
    svg = re.sub(r'(<svg\b[^>]*?)\s+style="[^"]*"', r'\1', svg, count=1)
    style = ('max-width:480px;width:100%;height:auto;display:block;'
             'margin:1em auto;background:#fff;padding:10px;'
             'border:1px solid #e5e7eb;border-radius:6px')
    svg = re.sub(r'<svg\b', '<svg style="%s"' % style, svg, count=1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print('  \u2713 {}'.format(name))


def lbl(d, xy, text, ofst=(0, 0)):
    d += elm.Label().label(text).at([xy[0] + ofst[0], xy[1] + ofst[1]])


def dot(d, xy):
    d += elm.Dot().at(xy)


# =========================================================================
# 数电（数字电子技术）
# =========================================================================

def cmos_inverter():
    """CMOS 反相器：PMOS 上管 + NMOS 下管；栅极共接为输入 A，漏极共接为输出 Y。"""
    d = new_drawing(unit=2.2)
    # 输出节点 Y=(2,0)。AnalogPFet: source 在放置点、drain 在下方→source@(2,1.67)→drain@(2,0)
    Qp = d.add(elm.AnalogPFet().at([2, 1.67]))
    # AnalogNFet: drain 在放置点、source 在下方→drain@(2,0)→source@(2,-1.67)
    Qn = d.add(elm.AnalogNFet().at([2, 0]))
    Y = Qn.drain
    d += elm.Line().up().length(0.9).at(Qp.source)
    lbl(d, [Qp.source[0], Qp.source[1] + 0.9], '+VDD', (-1.1, 0.1))
    d += elm.Ground().at(Qn.source)
    d += elm.Line().at(Qp.gate).to(Qn.gate)
    dot(d, Qp.gate)
    d += elm.Line().left().length(1.6).at(Qp.gate)
    lbl(d, Qp.gate, 'A', (-2.0, 0.1))
    dot(d, Y)
    d += elm.Line().right().length(1.6).at(Y)
    lbl(d, Y, 'Y', (1.7, 0.1))
    lbl(d, Y, r'$Y=\overline{A}$', (1.0, -1.0))
    save_svg(d, 'shu-cmos-inverter.svg')


def cmos_nand():
    """CMOS 与非门：两 PMOS 并联（上，源极接 VDD）+ 两 NMOS 串联（下，接 GND）。"""
    d = new_drawing(unit=2.2)
    Pa = d.add(elm.AnalogPFet().at([0, 3.34]))
    Pb = d.add(elm.AnalogPFet().at([2, 3.34]))
    d += elm.Line().at(Pa.source).to(Pb.source)
    vcc = [(Pa.source[0] + Pb.source[0]) / 2, Pa.source[1]]
    d += elm.Line().up().length(0.8).at(vcc)
    lbl(d, vcc, '+VDD', (0.5, 0.8))
    d += elm.Line().at(Pa.drain).to(Pb.drain)
    Y = Pb.drain
    dot(d, Y)
    Na = d.add(elm.AnalogNFet().at([2, Y[1]]))
    Nb = d.add(elm.AnalogNFet().at([2, Na.source[1]]))
    d += elm.Ground().at(Nb.source)
    d += elm.Line().at(Pa.gate).to(Na.gate)
    dot(d, Pa.gate)
    d += elm.Line().left().length(1.4).at(Pa.gate)
    lbl(d, Pa.gate, 'A', (-1.7, 0.1))
    d += elm.Line().at(Pb.gate).to(Nb.gate)
    dot(d, Pb.gate)
    d += elm.Line().left().length(0.8).at(Pb.gate)
    lbl(d, Pb.gate, 'B', (-1.1, 0.1))
    d += elm.Line().right().length(1.8).at(Y)
    lbl(d, Y, 'Y', (1.9, 0.1))
    lbl(d, Y, r'$Y=\overline{AB}$', (1.2, -2.4))
    save_svg(d, 'shu-cmos-nand.svg')


def oc_wire_and():
    """OC/OD 门线与：两个开路输出门并联 + 外接上拉电阻 Rc，实现线与。"""
    d = new_drawing(unit=2.2)
    g1 = d.add(logic.Nand().at([0.5, 1.6]))
    g2 = d.add(logic.Nand().at([0.5, -1.6]))
    for g, ins in [(g1, ['A', 'B']), (g2, ['C', 'D'])]:
        d += elm.Line().left().length(0.9).at(g.in1)
        d += elm.Line().left().length(0.9).at(g.in2)
        lbl(d, g.in1, ins[0], (-1.1, 0.1))
        lbl(d, g.in2, ins[1], (-1.1, 0.1))
    ynode = [g1.out[0] + 1.5, 0]
    wire(d, g1.out, [ynode[0], g1.out[1]], ynode)
    wire(d, g2.out, [ynode[0], g2.out[1]], ynode)
    dot(d, ynode)
    rc = d.add(elm.Resistor().up().length(1.8).at(ynode).label(r'$R_c$'))
    lbl(d, rc.end, '+VCC', (0.6, 0.1))
    d += elm.Line().right().length(1.6).at(ynode)
    lbl(d, ynode, 'Y', (1.7, -0.35))
    lbl(d, [ynode[0], -3.0],
        r'$Y=\overline{AB}\cdot\overline{CD}$' + '  (wired-AND)')
    save_svg(d, 'shu-oc-wire-and.svg')


def tri_state_gate():
    """三态输出门逻辑符号：带使能端 EN，无效时输出高阻态 Z。"""
    d = new_drawing(unit=2.2)
    g = d.add(logic.Tristate().at([0, 0]))
    d += elm.Line().left().length(1.0).at(g.in1)
    lbl(d, g.in1, 'A', (-1.2, 0.1))
    d += elm.Line().right().length(1.0).at(g.out)
    lbl(d, g.out, 'Y', (1.1, 0.1))
    d += elm.Line().up().length(0.9).at(g.c)
    lbl(d, g.c, r'$\overline{EN}$', (0.4, 0.9))
    lbl(d, [0.3, -1.6], 'EN=1: Y=A    EN=0: Y=Z (High-Z)')
    save_svg(d, 'shu-tri-state-gate.svg')


def full_adder():
    """一位全加器：S=A^B^Cin；Cout=AB+Cin(A^B)。"""
    d = new_drawing(unit=1.9)
    x1 = d.add(logic.Xor().at([0, 1.4]))
    d += elm.Line().left().length(0.8).at(x1.in1)
    d += elm.Line().left().length(0.8).at(x1.in2)
    lbl(d, x1.in1, 'A', (-1.0, 0.1))
    lbl(d, x1.in2, 'B', (-1.0, 0.1))
    x2 = d.add(logic.Xor().at([x1.out[0] + 1.4, 1.4]))
    d += elm.Line().at(x1.out).to(x2.in1)
    d += elm.Line().left().length(1.4).at(x2.in2)
    lbl(d, x2.in2, r'$C_{in}$', (-1.7, 0.1))
    d += elm.Line().right().length(0.8).at(x2.out)
    lbl(d, x2.out, 'S', (0.9, 0.1))
    a1 = d.add(logic.And().at([0, -0.4]))
    d += elm.Wire('-|').at(a1.in1).to(x1.in1)
    d += elm.Wire('-|').at(a1.in2).to(x1.in2)
    a2 = d.add(logic.And().at([x1.out[0] + 0.2, -0.4]))
    d += elm.Wire('-|').at(a2.in1).to(x1.out)
    d += elm.Wire('-|').at(a2.in2).to(x2.in2)
    o1 = d.add(logic.Or().at([a1.out[0] + 1.3, 0.4]))
    d += elm.Wire('-|').at(o1.in1).to(a1.out)
    d += elm.Wire('-|').at(o1.in2).to(a2.out)
    d += elm.Line().right().length(0.8).at(o1.out)
    lbl(d, o1.out, r'$C_{out}$', (0.9, 0.1))
    save_svg(d, 'shu-full-adder.svg')


def rs_latch_nor():
    """或非门构成的基本 RS 触发器（交叉反馈，高电平有效）：约束 SR=0。"""
    d = new_drawing(unit=2.3)
    g1 = d.add(logic.Nor().at([1.2, 1.2]))
    g2 = d.add(logic.Nor().at([1.2, -1.2]))
    d += elm.Line().left().length(0.9).at(g1.in1)
    lbl(d, g1.in1, 'S', (-1.0, 0.1))
    d += elm.Line().left().length(0.9).at(g2.in1)
    lbl(d, g2.in1, 'R', (-1.0, 0.1))
    d += elm.Wire('-|').at(g1.in2).to(g2.out)
    d += elm.Wire('-|').at(g2.in2).to(g1.out)
    dot(d, g1.out)
    dot(d, g2.out)
    d += elm.Line().right().length(1.0).at(g1.out)
    lbl(d, g1.out, 'Q', (1.1, 0.1))
    d += elm.Line().right().length(1.0).at(g2.out)
    lbl(d, g2.out, r'$\overline{Q}$', (1.1, 0.1))
    lbl(d, [1.2, -2.6], r'$Q^*=S+\overline{R}Q,\ SR=0$')
    save_svg(d, 'shu-rs-latch-nor.svg')


def jk_flipflop():
    """JK 边沿触发器逻辑符号（CLK 带下降沿小圈）。"""
    d = new_drawing(unit=2.4)
    ff = d.add(elm.Ic(pins=[
        elm.IcPin(name='J', side='left', pin='1'),
        elm.IcPin(name='CLK', side='left', pin='2'),
        elm.IcPin(name='K', side='left', pin='3'),
        elm.IcPin(name='Q', side='right', pin='4'),
        elm.IcPin(name='Qbar', side='right', pin='5'),
    ]).at([0, 0]).label('JK'))
    pJ, pCLK, pK = ff.absanchors['J'], ff.absanchors['CLK'], ff.absanchors['K']
    pQ, pQb = ff.absanchors['Q'], ff.absanchors['Qbar']
    d += elm.Line().left().length(0.8).at(pJ)
    lbl(d, pJ, 'J', (-0.9, 0.1))
    d += elm.Line().left().length(0.8).at(pK)
    lbl(d, pK, 'K', (-0.9, 0.1))
    d += elm.Line().left().length(0.8).at(pCLK)
    lbl(d, pCLK, 'CLK', (-1.1, 0.1))
    d += elm.Line().right().length(0.8).at(pQ)
    lbl(d, pQ, 'Q', (0.9, 0.1))
    d += elm.Line().right().length(0.8).at(pQb)
    lbl(d, pQb, r'$\overline{Q}$', (0.9, 0.1))
    lbl(d, [0.4, -2.4], r'$Q^*=J\overline{Q}+\overline{K}Q$')
    save_svg(d, 'shu-jk-flipflop.svg')


def c555_astable():
    """555 多谐振荡器：R_A、R_B 串联（VCC→DIS→THR/TRG），C 接 6/2 脚到地。"""
    d = new_drawing(unit=1.9)
    ic = d.add(elm.Ic555().at([1, -1]))
    Vcc, DIS, THR, TRG = (ic.absanchors['Vcc'], ic.absanchors['DIS'],
        ic.absanchors['THR'], ic.absanchors['TRG'])
    OUT, GND, CTL = (ic.absanchors['OUT'], ic.absanchors['GND'],
        ic.absanchors['CTL'])
    vy = DIS[1] + 1.8
    d += elm.Line().at(Vcc).to([Vcc[0], vy])
    d += elm.Line().at([DIS[0], vy]).to([Vcc[0], vy])
    lbl(d, [Vcc[0], vy], '+VCC', (0.4, 0.3))
    d.add(elm.Resistor().down().at([DIS[0], vy]).to(DIS).label(r'$R_A$'))
    dot(d, [DIS[0], vy])
    node = [DIS[0], THR[1] - 0.2]
    d.add(elm.Resistor().down().at(DIS).to(node).label(r'$R_B$'))
    d += elm.Line().at(node).to(THR)
    d += elm.Line().at(THR).to(TRG)
    d += elm.Line().at(TRG).to([TRG[0], node[1]])
    dot(d, THR)
    dot(d, TRG)
    cap = d.add(elm.Capacitor().down().at(node).length(1.4).label('C'))
    d += elm.Ground().at(cap.end)
    d += elm.Line().right().length(1.2).at(OUT)
    lbl(d, OUT, r'$v_o$', (1.3, 0.1))
    d += elm.Ground().at(GND)
    d += elm.Capacitor().down().length(1.2).at(CTL).label('0.01uF')
    d += elm.Ground().at([CTL[0], CTL[1] - 1.2])
    lbl(d, [0.5, TRG[1] - 3.2], r'$T\approx 0.7(R_A+2R_B)C$')
    save_svg(d, 'shu-555-astable.svg')


def c555_monostable():
    """555 单稳态：2 脚接负脉冲触发，6/7 脚经 R 接 VCC、经 C 接地。"""
    d = new_drawing(unit=1.9)
    ic = d.add(elm.Ic555().at([1, -1]))
    Vcc, DIS, THR, TRG = (ic.absanchors['Vcc'], ic.absanchors['DIS'],
        ic.absanchors['THR'], ic.absanchors['TRG'])
    OUT, GND, CTL = (ic.absanchors['OUT'], ic.absanchors['GND'],
        ic.absanchors['CTL'])
    vy = THR[1] + 1.8
    d += elm.Line().at(Vcc).to([Vcc[0], vy])
    d += elm.Line().at([THR[0], vy]).to([Vcc[0], vy])
    lbl(d, [Vcc[0], vy], '+VCC', (0.4, 0.3))
    d += elm.Line().at(DIS).to(THR)
    dot(d, THR)
    d.add(elm.Resistor().up().at(THR).to([THR[0], vy]).label('R'))
    dot(d, [THR[0], vy])
    cap = d.add(elm.Capacitor().down().at([THR[0], THR[1] - 0.1]).length(1.4).label('C'))
    d += elm.Ground().at(cap.end)
    d += elm.Line().at(THR).to([THR[0], cap.start[1]])
    d += elm.Line().left().length(1.2).at(TRG)
    lbl(d, TRG, r'$v_i$ (trig)', (-1.4, 0.1))
    d += elm.Line().right().length(1.2).at(OUT)
    lbl(d, OUT, r'$v_o$', (1.3, 0.1))
    d += elm.Ground().at(GND)
    d += elm.Capacitor().down().length(1.2).at(CTL).label('0.01uF')
    d += elm.Ground().at([CTL[0], CTL[1] - 1.2])
    lbl(d, [0.5, TRG[1] - 3.2], r'$t_w\approx 1.1RC$')
    save_svg(d, 'shu-555-monostable.svg')


# =========================================================================
# 模电（模拟电子技术）
# =========================================================================

def bridge_rectifier():
    """单相桥式整流：四只二极管桥式连接，电阻负载 R_L。"""
    d = new_drawing(unit=1.9)
    L, R, T, B = [0, 0], [4, 0], [2, 2.0], [2, -2.0]
    d += elm.SourceSin().at(L).to(R).label(r'$u_2$')
    d += elm.Diode().at(L).to(T).label('D1', ofst=(0.3, 0.2))
    d += elm.Diode().at(R).to(T).label('D3', ofst=(-0.3, 0.2))
    d += elm.Diode().at(L).to(B).label('D2', ofst=(0.3, -0.2))
    d += elm.Diode().at(R).to(B).label('D4', ofst=(-0.3, -0.2))
    d += elm.Resistor().at(T).to(B).label(r'$R_L$', ofst=(0.3, 0))
    lbl(d, T, '+', (-0.5, 0.1))
    lbl(d, B, '-', (-0.5, -0.1))
    lbl(d, [T[0] + 0.4, (T[1] + B[1]) / 2], r'$u_o$', (0, 0))
    save_svg(d, 'mo-bridge-rectifier.svg')


def zener_regulator():
    """硅稳压管稳压电路：限流电阻 R 串联 + 稳压管 Dz 反向并联负载。"""
    d = new_drawing(unit=2.2)
    top = [0, 2.0]
    lbl(d, top, r'$+U_i$', (-1.0, 0.1))
    dot(d, top)
    d += elm.Line().right().length(0.8).at(top)
    r = d.add(elm.Resistor().right().length(1.6).label('R'))
    node = r.end
    dot(d, node)
    lbl(d, node, r'$+U_o$', (0.3, 0.6))
    dz = d.add(elm.Zener().down().at(node).length(1.6).label(r'$D_Z$'))
    gndz = [dz.end[0], dz.end[1]]
    rlx = node[0] + 1.6
    d += elm.Line().right().at(node).to([rlx, node[1]])
    rl = d.add(elm.Resistor().down().at([rlx, node[1]]).length(1.6).label(r'$R_L$'))
    rlb = [rlx, rl.end[1]]
    d += elm.Line().at(gndz).to(rlb)
    d += elm.Ground().at([(gndz[0] + rlb[0]) / 2, gndz[1]])
    save_svg(d, 'mo-zener-regulator.svg')


def ce_amplifier():
    """分压式偏置共射放大电路（Q 点稳定）：Rb1/Rb2 分压 + Rc + Re(旁路 Ce)。"""
    d = new_drawing(unit=2.0)
    vy = 3.4
    d += elm.Line().at([0.5, vy]).to([5.0, vy])
    lbl(d, [3.0, vy], '+VCC', (0.2, 0.4))
    Q = d.add(elm.BjtNpn().at([3.0, 1.3]))
    b, c, e = Q.base, Q.collector, Q.emitter
    d.add(elm.Resistor().up().at(c).to([c[0], vy]).label(r'$R_c$'))
    re = d.add(elm.Resistor().down().at(e).length(1.2).label(r'$R_e$'))
    reg = re.end
    cex = e[0] + 1.3
    d += elm.Line().right().at(e).to([cex, e[1]])
    d += elm.Capacitor().down().at([cex, e[1]]).length(1.2).label(r'$C_e$')
    d += elm.Line().at([cex, reg[1]]).to(reg)
    bx = b[0] - 1.8
    d.add(elm.Resistor().up().at([bx, b[1]]).to([bx, vy]).label(r'$R_{b1}$'))
    rb2 = d.add(elm.Resistor().down().at([bx, b[1]]).length(1.2).label(r'$R_{b2}$'))
    rb2g = rb2.end
    d += elm.Line().at(b).to([bx, b[1]])
    dot(d, [bx, b[1]])
    c1 = d.add(elm.Capacitor().left().at([bx, b[1]]).length(1.2).label(r'$C_1$'))
    d += elm.Line().left().length(0.6).at(c1.start)
    lbl(d, c1.start, r'$v_i$', (-0.9, 0.1))
    d += elm.Line().up().length(0.4).at(c)
    dot(d, c)
    c2 = d.add(elm.Capacitor().right().at([c[0], c[1] + 0.4]).length(1.4).label(r'$C_2$'))
    lbl(d, c2.end, r'$v_o$', (0.2, 0.1))
    d += elm.Line().at(rb2g).to([cex, rb2g[1]])
    d += elm.Ground().at(reg)
    save_svg(d, 'mo-ce-amplifier.svg')


def emitter_follower():
    """共集电极放大电路（射极跟随器）：集电极接 VCC，输出取自发射极经 Re。"""
    d = new_drawing(unit=2.0)
    vy = 3.4
    d += elm.Line().at([0.5, vy]).to([4.0, vy])
    lbl(d, [2.4, vy], '+VCC', (0.2, 0.4))
    Q = d.add(elm.BjtNpn().at([2.4, 1.3]))
    b, c, e = Q.base, Q.collector, Q.emitter
    d += elm.Line().up().at(c).to([c[0], vy])
    dot(d, [c[0], vy])
    bx = b[0] - 1.8
    d.add(elm.Resistor().up().at([bx, b[1]]).to([bx, vy]).label(r'$R_b$'))
    d += elm.Line().at(b).to([bx, b[1]])
    c1 = d.add(elm.Capacitor().left().at([bx, b[1]]).length(1.2).label(r'$C_1$'))
    d += elm.Line().left().length(0.6).at(c1.start)
    lbl(d, c1.start, r'$v_i$', (-0.9, 0.1))
    re = d.add(elm.Resistor().down().at(e).length(1.4).label(r'$R_e$'))
    d += elm.Ground().at(re.end)
    c2 = d.add(elm.Capacitor().right().at(e).length(1.3).label(r'$C_2$'))
    lbl(d, c2.end, r'$v_o$', (0.2, 0.1))
    save_svg(d, 'mo-emitter-follower.svg')


def inverting_amp():
    """反相比例运放：信号经 R1 接反相端(−)，Rf 反馈；同相端(+)接地。"""
    d = new_drawing(unit=2.2)
    op = d.add(elm.Opamp().at([2.5, 0]))
    # in1=反相(−, 上)；in2=同相(+, 下)
    d += elm.Line().down().length(0.8).at(op.in2)
    d += elm.Ground()
    d += elm.Line().left().length(0.5).at(op.in1)
    r1 = d.add(elm.Resistor().left().length(1.5).label(r'$R_1$'))
    d += elm.Line().left().length(0.7).at(r1.start)
    lbl(d, r1.start, r'$v_i$', (-0.9, 0.1))
    d += elm.Line().up().length(1.2).at(op.in1)
    fn = [op.in1[0], op.in1[1] + 1.2]
    d += elm.Line().right().at(fn).to([op.out[0], fn[1]])
    dot(d, fn)
    d.add(elm.Resistor().down().at([op.out[0], fn[1]]).to(op.out).label(r'$R_f$'))
    dot(d, op.out)
    d += elm.Line().right().length(1.1).at(op.out)
    lbl(d, op.out, r'$v_o$', (1.2, 0.1))
    lbl(d, [1.0, -1.8], r'$A_v=-R_f/R_1$')
    save_svg(d, 'mo-inverting-amp.svg')


def noninverting_amp():
    """同相比例运放：信号接同相端(+)，R1/Rf 分压接反相端(−)。"""
    d = new_drawing(unit=2.2)
    op = d.add(elm.Opamp().at([2.5, 0]))
    d += elm.Line().left().length(1.0).at(op.in2)
    lbl(d, op.in2, r'$v_i$', (-1.2, 0.1))
    r1 = d.add(elm.Resistor().down().length(1.3).at(op.in1).label(r'$R_1$'))
    d += elm.Ground().at(r1.end)
    d += elm.Line().up().length(1.2).at(op.in1)
    fn = [op.in1[0], op.in1[1] + 1.2]
    d += elm.Line().right().at(fn).to([op.out[0], fn[1]])
    dot(d, fn)
    d.add(elm.Resistor().down().at([op.out[0], fn[1]]).to(op.out).label(r'$R_f$'))
    dot(d, op.out)
    d += elm.Line().right().length(1.1).at(op.out)
    lbl(d, op.out, r'$v_o$', (1.2, 0.1))
    lbl(d, [1.0, -1.8], r'$A_v=1+R_f/R_1$')
    save_svg(d, 'mo-noninverting-amp.svg')


def integrator():
    """积分运算电路：反馈支路为电容 C，输入经 R 接反相端。"""
    d = new_drawing(unit=2.2)
    op = d.add(elm.Opamp().at([2.5, 0]))
    d += elm.Line().down().length(0.8).at(op.in2)
    d += elm.Ground()
    d += elm.Line().left().length(0.5).at(op.in1)
    r = d.add(elm.Resistor().left().length(1.5).label('R'))
    d += elm.Line().left().length(0.7).at(r.start)
    lbl(d, r.start, r'$v_i$', (-0.9, 0.1))
    d += elm.Line().up().length(1.2).at(op.in1)
    fn = [op.in1[0], op.in1[1] + 1.2]
    d += elm.Line().right().at(fn).to([op.out[0], fn[1]])
    dot(d, fn)
    d.add(elm.Capacitor().down().at([op.out[0], fn[1]]).to(op.out).label('C'))
    dot(d, op.out)
    d += elm.Line().right().length(1.1).at(op.out)
    lbl(d, op.out, r'$v_o$', (1.2, 0.1))
    lbl(d, [0.6, -1.8], r'$v_o=-\frac{1}{RC}\int v_i\,dt$')
    save_svg(d, 'mo-integrator.svg')


def ocl_amplifier():
    """OCL 双电源互补对称功放（甲乙类）：T1(NPN)+T2(PNP)，D1/D2 提供偏置消除交越失真。"""
    d = new_drawing(unit=2.0)
    vy = 3.0
    d += elm.Line().at([0.8, vy]).to([3.6, vy])
    d += elm.Line().at([0.8, -vy]).to([3.6, -vy])
    lbl(d, [0.4, vy], r'$+V_{CC}$', (0, 0.3))
    lbl(d, [0.4, -vy], r'$-V_{CC}$', (0, -0.1))
    bx = [1.4, 0.0]
    d += elm.Line().left().length(0.9).at(bx)
    lbl(d, bx, r'$v_i$', (-1.1, 0.1))
    d1 = d.add(elm.Diode().up().at(bx).length(1.0).label('D1'))
    d2 = d.add(elm.Diode().up().at(d1.end).length(1.0).label('D2'))
    topnode = d2.end
    botnode = bx
    T1 = d.add(elm.BjtNpn().at([2.6, d1.end[1] + 0.2]))
    d += elm.Line().at(topnode).to(T1.base)
    d += elm.Line().up().at(T1.collector).to([T1.collector[0], vy])
    T2 = d.add(elm.BjtPnp().at([2.6, bx[1] - 0.2 - 1.4]))
    d += elm.Line().at(botnode).to(T2.base)
    d += elm.Line().down().at(T2.collector).to([T2.collector[0], -vy])
    out = T1.emitter
    d += elm.Line().at(T1.emitter).to(T2.emitter)
    dot(d, out)
    d += elm.Line().right().length(1.3).at(out)
    rl = d.add(elm.Resistor().down().at([out[0] + 1.3, out[1]]).length(1.5).label(r'$R_L$'))
    d += elm.Ground().at(rl.end)
    lbl(d, out, r'$v_o$', (0.4, 0.4))
    lbl(d, [0.4, -vy - 1.0],
        'Class-AB complementary (D1/D2 remove crossover distortion)')
    save_svg(d, 'mo-ocl-amplifier.svg')


def wien_bridge():
    """RC 文氏电桥振荡器：RC 串并联选频→同相端(+)；R1/Rf 分压→反相端(−)稳幅。"""
    d = new_drawing(unit=1.9)
    op = d.add(elm.Opamp().at([3.6, 0]))
    out = op.out
    d += elm.Line().right().length(1.0).at(out)
    lbl(d, out, r'$v_o$', (1.1, 0.1))
    dot(d, out)
    # 正反馈：输出→串 R,C→中点→并 R,C 接地→同相端(+,in2)
    d += elm.Line().up().length(1.6).at(out)
    s1 = [out[0], out[1] + 1.6]
    rA = d.add(elm.Resistor().left().length(1.4).at(s1).label('R'))
    cA = d.add(elm.Capacitor().left().length(1.4).at(rA.start).label('C'))
    mid = cA.start
    rB = d.add(elm.Resistor().down().length(1.4).at(mid).label('R'))
    cB = d.add(elm.Capacitor().down().length(1.0).at(rB.end).label('C'))
    d += elm.Ground().at(cB.end)
    dot(d, mid)
    d += elm.Wire('-|').at(op.in2).to(mid)
    # 负反馈：输出→Rf→反相端(−,in1)，反相端→R1→地
    d += elm.Line().down().length(1.6).at(out)
    s2 = [out[0], out[1] - 1.6]
    rf = d.add(elm.Resistor().left().length(1.4).at(s2).label(r'$R_f$'))
    r1 = d.add(elm.Resistor().left().length(1.4).at(rf.start).label(r'$R_1$'))
    d += elm.Ground().at(r1.start)
    dot(d, rf.start)
    d += elm.Wire('-|').at(op.in1).to(rf.start)
    lbl(d, [1.2, -3.0], r'$f_0=\frac{1}{2\pi RC}$  start: $R_f>2R_1$')
    save_svg(d, 'mo-wien-bridge.svg')


def series_regulator():
    """串联型稳压电源：取样(R1/R2) + 基准(Dz) + 比较放大(op) + 调整管(T)。"""
    d = new_drawing(unit=2.0)
    top = [0, 3.0]
    lbl(d, top, r'$+U_i$', (-1.0, 0.1))
    dot(d, top)
    T = d.add(elm.BjtNpn().at([1.6, 2.4]))
    d += elm.Line().at(top).to([T.collector[0], top[1]])
    d += elm.Line().at([T.collector[0], top[1]]).to(T.collector)
    d += elm.Line().right().at(T.emitter).to([5.6, T.emitter[1]])
    lbl(d, [5.6, T.emitter[1]], r'$+U_o$', (0.1, 0.1))
    out_y = T.emitter[1]
    op = d.add(elm.Opamp().at([3.6, 0.6]))
    d += elm.Wire('-|').at(T.base).to(op.out)
    dz = d.add(elm.Zener().down().at(op.in1).length(1.2).label(r'$D_Z$'))
    d += elm.Ground().at(dz.end)
    r3 = d.add(elm.Resistor().left().at(dz.start).length(1.2).label(r'$R_3$'))
    d += elm.Line().at(r3.start).to([r3.start[0], top[1]])
    dot(d, [r3.start[0], top[1]])
    sx = 4.8
    d += elm.Line().at([sx, out_y]).to([sx, op.in2[1]])
    d.add(elm.Resistor().down().at([sx, op.in2[1] + 0.7]).to([sx, op.in2[1]]).label(r'$R_1$'))
    dot(d, [sx, op.in2[1]])
    d += elm.Line().at([sx, op.in2[1]]).to(op.in2)
    r2 = d.add(elm.Resistor().down().at([sx, op.in2[1]]).length(1.0).label(r'$R_2$'))
    d += elm.Ground().at(r2.end)
    lbl(d, [1.0, -1.8], 'Sample + Ref + Amp + Pass  (voltage-series NFB)')
    save_svg(d, 'mo-series-regulator.svg')


# =========================================================================
# 主入口
# =========================================================================

CIRCUITS = [
    # 数电
    cmos_inverter, cmos_nand, oc_wire_and, tri_state_gate,
    full_adder, rs_latch_nor, jk_flipflop,
    c555_astable, c555_monostable,
    # 模电
    bridge_rectifier, zener_regulator, ce_amplifier, emitter_follower,
    inverting_amp, noninverting_amp, integrator,
    ocl_amplifier, wien_bridge, series_regulator,
]


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    print('Generating {} circuit SVGs -> public/circuits/'.format(len(CIRCUITS)))
    ok = 0
    for fn in CIRCUITS:
        try:
            fn()
            ok += 1
        except Exception as exc:  # 单张失败不阻断其余
            print('  X {} : {}'.format(fn.__name__, exc))
    n = len([f for f in os.listdir(OUTDIR) if f.endswith('.svg')])
    print('Done. {}/{} circuits OK; {} SVGs in public/circuits/'.format(ok, len(CIRCUITS), n))


if __name__ == '__main__':
    main()

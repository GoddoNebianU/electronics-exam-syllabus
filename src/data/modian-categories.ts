/* 分类（按教学顺序）-------------------------------------------------- */
import type { FormulaCategory } from './types';

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

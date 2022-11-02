import {ConstantSet} from "@/const";
import {EvalFunction, MathNode} from "mathjs";

export interface FormulaDefinition {
  raw: string,
  node: MathNode,
  fn: EvalFunction,
  symbols: Set<string>
}

export interface MeasureList {
  name: string,
  theta: number,
  measures: number[]
}

interface ComputationStepResultDirectFull {
  type: 'direct_full',
  data: DirectComputation
}
interface ComputationStepResultIndirectDeltaMoving {
  type: 'indirect_delta',
  data: IndirectComputationDeltaMoving
}

export type ComputationStepResult = ComputationStepResultDirectFull | ComputationStepResultIndirectDeltaMoving

export type ComputationResult = ComputationStepResult[]

export interface IndirectComputationDeltaMoovingSymbolStack {
  partial_derivative: MathNode,
  fixed_derivative: number,
  full_theta: number,
  derivative_with_theta: number,
}

export interface IndirectComputationDeltaMoving {
  formula: FormulaDefinition,
  directComputations: DirectComputation[],
  avg_func: number,
  mean_scope: Record<string, number>
  symbol_computations: Record<string, IndirectComputationDeltaMoovingSymbolStack>,
  final_delta: number,

  final_delta_rounded: number,
  avg_func_rounded: number
}

export interface DirectComputation {
  source: MeasureList,
  N: number,
  arr_sorted: number[],
  constants: ConstantSet,
  R: number,
  R_pass: number,
  R_res_min: number,
  R_res_max: number,
  R_pass_min: boolean,
  R_pass_max: boolean,
  mean: number,
  Sx: number,
  Sx_mean: number,
  Sx_res_min: number,
  Sx_res_max: number,
  Sx_pass_min: boolean,
  Sx_pass_max: boolean,
  theta_by_Sx: number,
  theta_by_R: number,
  full_theta: number,
  theta_percent: number,
  full_theta_rounded: number,
  mean_rounded: number
}

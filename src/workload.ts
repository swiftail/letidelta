import {
  DirectComputation,
  FormulaDefinition,
  IndirectComputationDeltaMoovingSymbolStack,
  IndirectComputationDeltaMoving,
  MeasureList
} from "@/entities";
import {useStore} from "@/store";
import {constants} from "@/const";
import {abs, derivative, pow, round, sqrt, sum} from "mathjs";


function absDiff(data: [number, number]) {
  return abs(data[0] - data[1])
}

function getPair(arr: number[], start: number): [number, number] {
  // @ts-ignore
  return [arr.at(start), arr.at(start + 1)]
}

function roundResult(result: number): { number: number, digits: number } {
  const init = result
  if (result === 0) {
    return {number: 0, digits: 0}
  }
  if (result < 0) {
    const abs = -1 * result
    const absRes = roundResult(abs)
    return {number: absRes.number * -1, digits: absRes.digits}
  }

  let e = 0
  while (result >= 1) {
    result /= 10
    e++
  }
  const numbers = ('' + result).slice(2)

  let answer = '0.'
  let digits = 0
  let oneMore = false
  for (const number of numbers) {
    answer += number
    digits++
    if (oneMore) {
      break
    }
    if (number === '0') {
      continue
    }
    if (number === '1' || number === '2') {
      oneMore = true
      continue
    }
    break
  }
  const res = {number: round(Number(answer) * <number>pow(10, e), digits), digits: digits}
  console.info(init, res)
  return res
}

export function computeDirect(measureList: MeasureList): DirectComputation {
  const store = useStore()

  const round_to = store.getRoundTo
  const N = measureList.measures.length
  const constantList = constants[N]

  const arr_sorted = [...measureList.measures].sort((a, b) => a - b)
  const R = round(arr_sorted.at(-1)! - arr_sorted.at(0)!, round_to)

  const R_pass = round(constantList.U * R, round_to)
  const R_res_min = round(absDiff(getPair(arr_sorted, 0)), round_to)
  const R_res_max = round(absDiff(getPair(arr_sorted, -2)), round_to)

  const R_pass_min = R_res_min <= R_pass
  const R_pass_max = R_res_max <= R_pass

  const mean = round(sum(arr_sorted) / N, round_to)

  const Sx = <number>round(sqrt(sum(<number[]>(Array(N).fill(0) as number[]).map((it, idx) => pow(mean - arr_sorted[idx], 2))) / (N - 1)), round_to)
  const Sx_mean = round(Sx / <number>sqrt(N), round_to)

  const Sx_res_min = round(abs(mean - arr_sorted.at(0)!) / Sx, round_to)
  const Sx_res_max = round(abs(mean - arr_sorted.at(-1)!) / Sx, round_to)

  const Sx_pass_min = Sx_res_min < constantList.V
  const Sx_pass_max = Sx_res_max < constantList.V

  const theta_by_Sx = round(Sx_mean * constantList.t, round_to)
  const theta_by_R = round(constantList.B * R, round_to)

  const full_theta = round(<number>sqrt(theta_by_Sx ** 2 + measureList.theta ** 2), round_to)
  const theta_percent = round(full_theta / mean * 100, round_to)

  const full_theta_round_result = roundResult(full_theta)

  return {
    source: measureList,
    N, arr_sorted, R, R_pass, R_res_min, R_res_max, R_pass_min, R_pass_max,
    mean, Sx, Sx_mean, Sx_res_min, Sx_res_max, Sx_pass_min, Sx_pass_max, theta_by_Sx, theta_by_R,
    full_theta, theta_percent,
    constants: constantList,
    full_theta_rounded: full_theta_round_result.number,
    mean_rounded: round(mean, full_theta_round_result.digits)
  }
}

export function computeDeltaMoving(
  measureLists: MeasureList[],
  formula: FormulaDefinition
) {
  const store = useStore()
  const round_to = store.getRoundTo

  const directResults = measureLists.map(it => computeDirect(it))
  const avgFunc = round(formula.fn.evaluate(Object.fromEntries(
    directResults.map(res => {
      return [res.source.name, res.mean_rounded]
    })
  )), round_to)

  const symbols = [...formula.symbols]
  const directResultsBySymbol: Record<string, DirectComputation> = Object.fromEntries(directResults.map(res => [res.source.name, res]))
  const meanScope = Object.fromEntries(symbols.map(sym => [sym, directResultsBySymbol[sym].mean_rounded]))

  const symbolComputations: Record<string, IndirectComputationDeltaMoovingSymbolStack> = Object.fromEntries(symbols.map(symbol => {
    const ptrDer = derivative(formula.node, symbol)
    const fixedDer = round(ptrDer.compile().evaluate(meanScope), round_to)
    const fullTheta = directResultsBySymbol[symbol].full_theta_rounded
    const derivativeByTheta = round(fixedDer * fullTheta, round_to)
    return [symbol,<IndirectComputationDeltaMoovingSymbolStack>{
      derivative_with_theta: derivativeByTheta,
      full_theta: fullTheta,
      fixed_derivative: fixedDer,
      partial_derivative: ptrDer
    }]
  }))

  const fullFunctionDelta = round(<number>sqrt(sum(
    Object.values(symbolComputations).map(it => it.derivative_with_theta).map(it => <number>pow(it, 2))
  )), round_to)

  const finalDeltaRoundedF = roundResult(fullFunctionDelta)
  const finalDeltaRounded = finalDeltaRoundedF.number
  const avgFuncRounded = round(avgFunc, finalDeltaRoundedF.digits)

  return <IndirectComputationDeltaMoving>{
    formula,
    final_delta: fullFunctionDelta,
    avg_func: avgFunc,
    mean_scope: meanScope,
    directComputations: directResults,
    symbol_computations: symbolComputations,
    avg_func_rounded: avgFuncRounded,
    final_delta_rounded: finalDeltaRounded
  }
}

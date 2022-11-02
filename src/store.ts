import {defineStore} from 'pinia'
import {ComputationResult, ComputationStepResult, FormulaDefinition, MeasureList} from "@/entities";
import {computeDeltaMoving, computeDirect} from "@/workload";
import {range} from "@/util";
import {getFormulaDefinition} from "@/formula";

export type SamplingType = 'direct' | 'indirect'
export type IndirectType = 'deltaMoving' | 'sampling'


export const useStore = defineStore('store', {
  state() {
    const measuresDirect = localStorage.getItem('measures_direct') ? JSON.parse(localStorage.getItem('measures_direct')!) : [] as MeasureList[]
    const measuresIndirect = localStorage.getItem('measures_indirect') ? JSON.parse(localStorage.getItem('measures_indirect')!) : [] as MeasureList[]
    const samplingType = localStorage.getItem('samplingType') ? localStorage.getItem('samplingType') : 'direct' as SamplingType

    let formula = null
    let formulaLocked = false

    if (localStorage.getItem('formulaLocked')) {
      formula = getFormulaDefinition(localStorage.getItem('formulaLocked')!)
      formulaLocked = true
    }

    return {
      measuresDirect,
      measuresIndirect,
      samplingType,
      sampleSize: 5,
      roundTo: 3,
      measures: samplingType === 'direct' ? measuresDirect : measuresIndirect,
      inputErrors: [] as string[],

      loading: false as boolean,
      result: [] as ComputationResult,
      renderTex: true,

      formula,
      formulaLocked,
      indirectType: 'deltaMoving' as IndirectType
    }
  },
  actions: {
    compute() {
      this.loading = true

      const measuresCopy = JSON.parse(JSON.stringify(this.measures.map(it => {
        const slicedList = it.measures.slice(0, this.getSampleSize)
        return {
          name: it.name,
          theta: it.theta,
          measures: slicedList
        }
      })));

      if (this.samplingType === 'direct') {

        const directResult = computeDirect(measuresCopy[0])

        this.loading = false
        this.result = [
          {type: 'direct_full', data: directResult}
        ]
      } else {
        if (this.indirectType === 'deltaMoving') {
          const fullResult = computeDeltaMoving(measuresCopy, this.formula!)

          this.result = [
            ...(fullResult.directComputations.map(it => <ComputationStepResult>{type: 'direct_full', data: it})),
            {type: 'indirect_delta', data: fullResult}
          ]

          this.loading = false
        }
      }
    },
    unlockFormula() {
      this.formulaLocked = false
      localStorage.removeItem('formulaLocked')
    },
    lockFormula(formula: FormulaDefinition) {
      this.formula = formula
      this.formulaLocked = true
      const symbols = formula.symbols

      localStorage.setItem('formulaLocked', this.formula.raw)

      this.measures = [...symbols].map(symbol => {
        return <MeasureList>{
          name: symbol,
          theta: 0,
          measures: range(this.sampleSize).fill(0)
        }
      })
    },
    setRenderTex(value: boolean) {
      this.renderTex = value
    },
    setSamplingType(value: SamplingType) {
      this.samplingType = value
      this.measures = (value === 'direct') ? this.measuresDirect : this.measuresIndirect
    },
    setIndirectType(value: IndirectType) {
      this.indirectType = value
    },
    setSampleSize(value: number) {
      this.sampleSize = value
      this.ensureMeasures()
    },
    setRoundTo(value: number) {
      this.roundTo = value
    },
    setMeasure(sampling: number, index: number, measure: number) {
      this.measures[sampling].measures[index] = measure
      this.saveMeasures()
    },
    setTheta(sampling: number, theta: number) {
      this.measures[sampling].theta = theta
      this.saveMeasures()
    },
    // setMeasureName(sampling: number, name: string) {
    //   this.measures[sampling].name = name
    //   this.saveMeasures()
    // },
    saveMeasures() {
      if (this.samplingType === 'direct') {
        this.measuresDirect = this.measures
      } else {
        this.measuresIndirect = this.measures
      }
      localStorage.setItem('measures_' + this.samplingType, JSON.stringify(this.measures))
    },
    ensureMeasures() {
      while (this.measures.length < 1) {
        this.measures.push({name: 'x', measures: Array(this.sampleSize).fill(0), theta: 0})
      }
      this.measures.forEach(measure => {
        while (measure.measures.length < this.sampleSize) {
          measure.measures.push(0)
        }
      })
    },
    validateInput() {
      this.inputErrors = []
      const errors: string[] = []
      if (this.samplingType === 'direct') {
        const takenNames = new Set()
        this.measures.forEach((measure, index) => {
          if (measure.name.trim().length === 0) {
            errors.push(`Переменная #${index}: не указано имя`)
          } else {
            const normalName = measure.name.trim().toLowerCase()
            if (takenNames.has(normalName)) {
              errors.push(`Переменная #${index}: имя дублируется (${normalName})`)
            } else {
              takenNames.add(normalName)
            }
          }
        })
      }
      this.inputErrors = errors
      return errors.length === 0
    }
  },
  getters: {
    getSamplingType: state => state.samplingType,
    getIndirectType: state => state.indirectType,
    getSampleSize: state => state.sampleSize,
    getRoundTo: state => state.roundTo,
    getMeasureList: state => (sampling: number) => state.measures[sampling],
    getMeasureCount: state => state.measures.length,
    getErrorList: state => state.inputErrors,
    getRenderTex: state => state.renderTex,

    getLoading: state => state.loading,
    getResult: state => state.result,

    getFormulaLocked: state => state.formulaLocked
  }
})

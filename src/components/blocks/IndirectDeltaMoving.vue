<template>
  <v-expansion-panel variant="tonal">
    <v-expansion-panel-title>
      <span class="mr-2">Косвенная погрешность</span>
      <math-jax
        :formula=" `{f}=${dc.avg_func_rounded}\\pm ${dc.final_delta_rounded}`"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text style="overflow-x: auto">
      <p class="text-body-1">Функция:</p>
      <div>
        <math-jax :formula="`f=` + dc.formula.node.toTex()"/>
      </div>
      <p class="text-body-1">Средние значения аргументов:</p>
      <div>
        <math-jax :formula="(Object.entries(dc.mean_scope).map(e => `\\bar{${e[0]}}=${e[1]}`)).join(',')"/>
      </div>
      <p class="text-body-1">Среднее значение:</p>
      <div>
        <math-jax :formula="`\\bar{f}=` + dc.avg_func"/>
      </div>
      <p class="text-body-1">Частичные производные и коэффициенты по аргументам:</p>
      <ul>
        <li v-for="[symbol,data] in Object.entries(dc.symbol_computations)" class="ml-4">
          <p class="text-body-2">Для
            <math-jax :formula="symbol"/>
            :
          </p>
          <div>
            <math-jax :formula="`\\frac{\\partial f(${ [...dc.formula.symbols].join(',') })}{\\partial ${symbol}}
          =${data.partial_derivative.toTex()}`"/>
          </div>
          <div>
            <math-jax :formula="`a_{${symbol}}={${data.partial_derivative.toTex()}}\\biggr\\rvert_{${
            [...dc.formula.symbols].map(it => `\\bar{${it}}`).join(',')
           }}=${data.fixed_derivative}`"/>
          </div>
          <div>
            <math-jax :formula="`\\Delta\\bar{${symbol}}=${data.full_theta}`"/>
          </div>
          <div>
            <math-jax
              :formula="`a_{${symbol}}\\Delta\\bar{${symbol}}=${data.fixed_derivative}\\cdot ${data.full_theta}=${data.derivative_with_theta}`"/>
          </div>
        </li>
      </ul>
      <p class="text-body-1">Полная погрешность функции:</p>
      <div>
        <math-jax :formula="`\\Delta f=\\sqrt{${
          Object.entries(dc.symbol_computations).map(([symbol]) => `(a_{${symbol}}\\Delta\\bar{${symbol}})^2`).join('+')
        }}=\\sqrt{${
          Object.entries(dc.symbol_computations).map(([symbol, data]) => `(${ data.derivative_with_theta })^2`).join('+')
        }}=${dc.final_delta}`" />
      </div>
      <p class="text-body-1">Ответ (с округлением):</p>
      <div>
        <math-jax :formula="`f=\\bar{f}\\pm \\Delta f=${dc.avg_func_rounded}\\pm ${dc.final_delta_rounded}`"/>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import {IndirectComputationDeltaMoving} from "@/entities";
import {computed} from "vue";
import MathJax from "@/components/util/MathJax.vue";

const props = defineProps({
  result: Object
})

const dc = computed(() => props.result as IndirectComputationDeltaMoving)
</script>

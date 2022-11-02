<template>
  <v-expansion-panel variant="tonal">
    <v-expansion-panel-title>
      <span class="mr-2">Прямая погрешность</span>
      <math-jax
        :formula=" `{${dc.source.name}}=${dc.mean_rounded}\\pm ${dc.full_theta_rounded}`"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text style="overflow-x: auto">
      <p class="text-body-1">Исходная выборка:</p>
      <table>
        <tr>
          <th v-for="i in range(dc.N)">
            <math-jax
              :formula=" `{${dc.source.name}}_{${(i + 1)}}`"
            />
          </th>
        </tr>
        <tr>
          <td v-for="i in range(dc.N)">
            <math-jax
              :formula="`${dc.source.measures[i]}`"
            />
          </td>
        </tr>
      </table>
      <p class="text-body-1">Отсортированная выборка:</p>
      <table>
        <tr>
          <th v-for="i in range(dc.N)">
            <math-jax
              :formula="`{${ dc.source.name}}_{${i + 1}}`"
            />
          </th>
        </tr>
        <tr>
          <td v-for="i in range(dc.N)">
            <math-jax :formula="'' + dc.arr_sorted[i]"/>
          </td>
        </tr>
      </table>
      <p class="text-body-1">Константы:</p>
      <div>
        <math-jax
          :formula="`N=${dc.N},\\ \\ U_{PN}=${dc.constants.U},\\ \\ V_{PN}=${dc.constants.V},\\ \\ B_{PN}=${dc.constants.B},\\ \\ t_{PN}=${dc.constants.t}`"
        />
      </div>
      <p class="text-body-1">Размах:</p>
      <div>
        <math-jax
          :formula="`R={${dc.source.name}}_{\\text{max}}-{${dc.source.name}}_{\\text{min}}=${dc.arr_sorted.at(0)}-${dc.arr_sorted.at(-1)}=${dc.R}`"
        />
      </div>
      <p class="text-body-1">Промахи по размаху:</p>
      <div>
        <math-jax
          :formula="`R_{\\text{pass}}=R\\cdot U_{PN}=${dc.R}\\cdot ${dc.constants.U}=${dc.R_pass}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`R_{\\text{min}}< R_{\\text{pass}}=(${dc.arr_sorted.at(1)}-${dc.arr_sorted.at(0)})<${dc.R_pass}=${ dc.R_res_min }<${dc.R_pass}=\\text{${dc.R_pass_min}}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`R_{\\text{max}}< R_{\\text{pass}}=(${dc.arr_sorted.at(-1)}-${dc.arr_sorted.at(-2)})<${dc.R_pass}= ${ dc.R_res_max }<${dc.R_pass}=\\text{${dc.R_pass_max}}`"
        />
      </div>
      <p class="text-body-1 text-green" v-if="dc.R_pass_max && dc.R_pass_min">Промахов по размаху нет</p>
      <p class="text-body-1 text-red" v-else>Есть промахи по размаху</p>
      <p class="text-body-1">Среднее, СКО, СКОС:</p>
      <div>
        <math-jax
          :formula="`\\bar{${dc.source.name}}= \\frac{${
            dc.arr_sorted.join('+')
          }}{${dc.N}} =${dc.mean}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`S_{x}=\\sqrt{\\frac{${
            (dc.arr_sorted.map((val,i) => `(\\bar{${dc.source.name}}-{${dc.source.name}}_${i+1})^2`)).join('+')
          }}{N-1}}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`=\\sqrt{\\frac{${
            (dc.arr_sorted.map((val,i) => `(${dc.mean}-${dc.arr_sorted[i]})^2`)).join('+')
          }}{${dc.N-1}}}=${dc.Sx}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`\\bar{S_{x}}=\\frac{S_{x}}{\\sqrt{N}}=\\frac{${dc.Sx}}{\\sqrt{${dc.N}}}=${dc.Sx_mean}`"
        />
      </div>
      <p class="text-body-1">Промахи по СКО:</p>
      <div>
        <math-jax
          :formula="`{S_x}_{\\text{min}} < V_{PN}=\\frac{ |\\bar{${dc.source.name}} - {${dc.source.name}}_{\\text{min}}| }{S_x}< V_{PN}=
          \\frac{ |${dc.mean} - ${dc.arr_sorted.at(0)}| }{${dc.Sx}}< V_{PN}=${dc.Sx_res_min}<${dc.constants.V}=\\text{${dc.Sx_pass_min}}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`{S_x}_{\\text{max}} < V_{PN}=\\frac{ |\\bar{${dc.source.name}} - {${dc.source.name}}_{\\text{max}}| }{S_x}< V_{PN}=
          \\frac{ |${dc.mean} - ${dc.arr_sorted.at(-1)}| }{${dc.Sx}}< V_{PN}=${dc.Sx_res_max}<${dc.constants.V}=\\text{${dc.Sx_pass_max}}`"
        />
      </div>
      <p class="text-body-1 text-green" v-if="dc.Sx_pass_max && dc.Sx_pass_min">Промахов по СКО нет</p>
      <p class="text-body-1 text-red" v-else>Есть промахи по СКО</p>
      <p class="text-body-1">Относительная погрешность:</p>
      <div>
        <math-jax
          :formula="`\\Delta{${dc.source.name}}_{(R)}=R\\cdot B_{PN}=${dc.R}\\cdot ${dc.constants.B}=${dc.theta_by_R}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`\\Delta{${dc.source.name}}_{(\\bar{S_{x}})}=\\bar{S_x}\\cdot t_{PN}=${dc.Sx_mean}\\cdot ${dc.constants.t}=${dc.theta_by_Sx}`"
        />
      </div>
      <p class="text-body-1">Полная погрешность:</p>
      <div>
        <math-jax
          :formula="`\\Delta{\\bar{${dc.source.name}}}=\\sqrt{\\Delta ${dc.source.name}^2 + \\theta^2}=\\sqrt{${dc.theta_by_Sx}^2 + ${dc.source.theta}^2}=${dc.full_theta}`"
        />
      </div>
      <div>
        <math-jax
          :formula="`\\Delta{\\bar{${dc.source.name}}}(\\text{%})=\\frac{\\Delta{\\bar{${dc.source.name}}}}{\\bar{${dc.source.name}}}\\cdot 100=${dc.theta_percent}`"
        />
      </div>
      <p class="text-body-1">Ответ (с округлением):</p>
      <div>
        <math-jax
          :formula="`{${dc.source.name}}=\\bar{${dc.source.name}}\\pm \\Delta{\\bar{${dc.source.name}}}=${dc.mean_rounded}\\pm ${dc.full_theta_rounded}`"
        />
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import {DirectComputation} from "@/entities";
import {computed} from "vue";
import MathJax from "@/components/util/MathJax.vue";

import {range} from '@/util'

const props = defineProps({
  result: Object
})

const dc = computed(() => props.result as DirectComputation)
</script>

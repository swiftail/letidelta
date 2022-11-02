<template>
  <v-card variant="outlined">
    <v-card-title>
      Выборка
    </v-card-title>
    <v-card-text style="overflow-x: auto">
      <template v-if="store.getSamplingType === 'direct'">
        <!--        <sampling-header/>-->
        <variable-sampling :index="0"/>
      </template>
      <template v-if="store.getSamplingType === 'indirect'">
        <formula-input/>
        <template v-if="store.getFormulaLocked">
          <variable-sampling v-for="index in range(store.getMeasureCount)" :index="index"/>
        </template>
        <v-btn-toggle
          mandatory
          :model-value="store.getIndirectType"
          @update:modelValue="store.setIndirectType"
          color="primary"
          class="mt-4"
          group
        >
          <v-btn value="deltaMoving">
            Перенос Δ
          </v-btn>
          <v-btn value="indirect">
            Выборочный
          </v-btn>
        </v-btn-toggle>
      </template>
    </v-card-text>
    <v-card-text class="pt-0" v-if="store.getErrorList.length">
      <v-alert variant="tonal" type="error">
        <ul>
          <li v-for="error in store.getErrorList">
            {{ error }}
          </li>
        </ul>
      </v-alert>
    </v-card-text>
    <v-card-text class="pt-0">
      <v-btn size="large" variant="flat" color="primary" @click="compute" :disabled="store.getSamplingType === 'indirect' && !store.getFormulaLocked">Считаем</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import VariableSampling from "./VariableSampling.vue";
import FormulaInput from "@/components/FormulaInput.vue";
import {range} from '@/util'

const store = useStore()

const compute = () => {
  const validationResult = store.validateInput()
  if (validationResult) {
    store.compute()
  }
}

</script>

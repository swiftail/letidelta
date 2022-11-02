<template>
  <v-row>
    <v-col>
      <math-jax
        :formula="(isEmpty || isInvalidInput) ? `f=` : (`f(${ [...mathNode.symbols].join(',') })=` + mathNode.node.toTex())"></math-jax>
      <v-text-field
        :disabled="store.getFormulaLocked"
        label="Формула"
        :model-value="rawExp"
        @update:modelValue="setRawExp"
        :error="isInvalidInput"
        :error-messages="isInvalidInput ? ['Неверная формула'] : []"
        persistent-placeholder
        placeholder="Функции: sin, cos, tg, sqrt, ctg"
      />
      <v-btn variant="tonal" color="primary" :disabled="isEmpty || isInvalidInput || store.getFormulaLocked"
             v-if="!store.getFormulaLocked"
             size="large" @click="store.lockFormula(mathNode)">Сохранить формулу
      </v-btn>
      <v-btn variant="tonal" color="primary"
             v-else
             size="large" @click="store.unlockFormula()">Редактировать
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import MathJax from "@/components/util/MathJax.vue";
import {computed, ref} from "vue";
import {useStore} from "@/store";
import {getFormulaDefinition} from "@/formula";

const store = useStore()

const rawExp = ref(store.formula?.raw ?? '')

const setRawExp = (text: string) => rawExp.value = text

const mathNode = computed(() => {
  return getFormulaDefinition(rawExp.value)
})
const isEmpty = computed(() => rawExp.value.trim().length === 0)
const isInvalidInput = computed(() => !isEmpty.value && mathNode.value === null)

</script>

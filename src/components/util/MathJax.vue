<template>
  <div style="display:inline-block;">
    <v-progress-circular indeterminate size="small" v-if="loading"/>
    <div ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "@/store";

const store = useStore()

const props = defineProps(['formula'])

const formula = computed(() => props.formula)
const container = ref<HTMLInputElement | null>(null)
const loading = ref(false)

const renderFormula = () => {
  const data = formula.value
  MathJax.texReset();
  const options = MathJax.getMetricsFor(container.value);
  container.value.innerHTML = ''

  if (!store.getRenderTex) {
    container.value.innerText = data;
    loading.value = false
    return
  }

  loading.value = true
  MathJax.tex2svgPromise(data, options).then(function (node) {
    loading.value = false
    container.value.appendChild(node);
    MathJax.startup.document.clear();
    MathJax.startup.document.updateDocument();
  }).catch(function (err) {
    loading.value = false
    container.value.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
  })
}

onMounted(() => {
  renderFormula()
})

watch(formula, data => {
  if (container.value) {
    renderFormula()
  }
}, {
  immediate: true
})
</script>

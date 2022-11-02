<template>
  <v-card variant="outlined">
    <v-card-title>
      Результат
    </v-card-title>
    <v-card-text class="result" style="display: flex; flex-direction: column; row-gap: 1rem;">
      <template v-if="store.getLoading === false && store.getResult === null">
        Тут будет результат
      </template>
      <template v-if="store.getLoading">
        <v-progress-circular indeterminate/>
      </template>
      <template v-if="store.getResult">
        <v-expansion-panels>
          <template v-for="step in store.getResult">

            <direct-result-full v-if="step.type === 'direct_full'" :result="step.data"/>
            <indirect-delta-moving v-if="step.type === 'indirect_delta'" :result="step.data"/>

          </template>
        </v-expansion-panels>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import DirectResultFull from "@/components/blocks/DirectResultFull.vue";
import IndirectDeltaMoving from "@/components/blocks/IndirectDeltaMoving.vue";

const store = useStore()
</script>

<style>
.result table, .result th, .result td {
  border: 1px solid black;
  border-collapse: collapse;
}

.result th, .result td {
  padding: 0px 8px;
}

.result p {
  margin-bottom: 4px;
  margin-top: 4px;
}

mjx-container[jax="SVG"][display="true"] {
  display: block;
  text-align: center;
  margin: 0.5em 0 !important;
}
</style>

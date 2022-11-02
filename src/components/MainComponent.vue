<template>
  <v-container>
    <v-row>
      <v-col style="display: flex; flex-direction: column; row-gap: 1rem">
        <settings/>
        <sampling-type-selector/>
        <sampling-size-selector/>
        <sampling-input/>
        <result-view/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SamplingTypeSelector from "@/components/SamplingTypeSelector.vue";
import {useStore} from "@/store";
import SamplingInput from "@/components/SamplingInput.vue";
import SamplingSizeSelector from "@/components/SamplingSizeSelector.vue";
import Settings from "@/components/Settings.vue";
import ResultView from "@/components/ResultView.vue";

const store = useStore()
</script>

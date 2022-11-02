<template>
  <v-card variant="outlined">
    <v-card-title>
      Размер выборки
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <v-text-field
            hide-details
            variant="outlined"
            type="number"
            :model-value="store.getSampleSize"
            @update:modelValue="it => store.setSampleSize(clamp(Number(it), 5, 10))"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useStore} from "@/store";

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const store = useStore()
</script>

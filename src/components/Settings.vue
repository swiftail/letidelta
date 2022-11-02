<template>
  <v-card variant="outlined">
    <v-card-title>
      Настройки
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <v-text-field
            label="Округлять до"
            hide-details
            variant="outlined"
            type="number"
            :model-value="store.getRoundTo"
            @update:modelValue="it => store.setRoundTo(clamp(Number(it), 0, 10))"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-checkbox
          hide-details
          label="Рендер TeX"
          :model-value="store.getRenderTex"
          @update:modelValue="it => store.setRenderTex(it)"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useStore} from "@/store";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const store = useStore()
</script>

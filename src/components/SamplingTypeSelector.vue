<template>
  <v-card variant="outlined">
    <v-card-title>
      Тип выборки
    </v-card-title>
    <v-card-text>
      <v-btn-toggle
        mandatory
        :model-value="store.getSamplingType"
        @update:modelValue="store.setSamplingType"
        color="primary"
        group
      >
        <v-btn value="direct">
          Прямая
        </v-btn>
        <v-btn value="indirect">
          Косвенная
        </v-btn>
      </v-btn-toggle>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useStore} from "@/store";

const store = useStore()
</script>

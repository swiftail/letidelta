<template>
  <v-row class="flex-nowrap">
    <v-responsive width="100">
      <v-col>
        <span class="text-subtitle-1 font-weight-bold">Переменная</span>
      </v-col>
    </v-responsive>
    <v-responsive width="100" v-for="i in range">
      <v-col>
        <span class="text-subtitle-1 font-weight-bold">{{ i }}</span>
      </v-col>
    </v-responsive>
     <v-responsive width="100">
      <v-col>
        <span class="text-subtitle-1 font-weight-bold">θ</span>
      </v-col>
    </v-responsive>
  </v-row>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import {computed} from "vue";

const store = useStore()

const range = computed(() => {
  return new Array(store.getSampleSize).fill(0).map((_, idx) => idx + 1)
})
</script>

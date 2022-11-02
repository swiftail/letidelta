<template>
  <v-row class="flex-nowrap mt-1">
    <v-responsive width="100" content-class="overflow-visible" class="overflow-visible">
      <v-col>
        <v-text-field
          readonly
          hide-details
          variant="outlined"
          label="Имя"
          :model-value="measureList.name"
        />
      </v-col>
    </v-responsive>
    <v-responsive width="100" content-class="overflow-visible" v-for="i in range">
      <v-col>
        <v-text-field
          hide-details
          type="number"
          variant="outlined"
          :label="'' + i"
          :model-value="measureList.measures[i - 1]"
          @update:modelValue="it => store.setMeasure(props.index, i - 1, Number(it))"
        />
      </v-col>
    </v-responsive>
    <v-responsive width="100" content-class="overflow-visible">
      <v-col>
        <v-text-field
          hide-details
          type="number"
          variant="outlined"
          label="θ"
          :model-value="measureList.theta"
          @update:modelValue="it => store.setTheta(props.index, Number(it))"
        />
      </v-col>
    </v-responsive>
  </v-row>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import {computed} from "vue";

const store = useStore()

store.ensureMeasures()

const props = defineProps({
  index: Number
})

const measureList = computed(() => store.getMeasureList(props.index!))

const range = computed(() => {
  return new Array(store.getSampleSize).fill(0).map((_, idx) => idx + 1)
})
</script>

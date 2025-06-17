<script setup lang="ts">
import { computed } from 'vue'
import type { KnobProps, KnobEmits } from '@/types/components'

const props = withDefaults(defineProps<KnobProps>(), {
  modelValue: 0
})

const emit = defineEmits<KnobEmits>()

const _value = computed({
  get(): number {
    return props.modelValue
  },
  set(num: number): void {
    if (props.modelValue !== num) {
      emit('update:modelValue', num)
      emit('handleControlChange', props.params.cc, num)
    }
  }
})
</script>

<template>
  <div class="knob">
    <q-knob
      :min="params.min"
      :max="params.max"
      v-model="_value"
      show-value
      size="60px"
      :thickness="0.22"
      color="cyan-6"
      track-color="grey-3"
      class="q-ma-xs"
    />
    <div class="label-knob">{{ params.label }}</div>
  </div>
</template>

<style>
.knob {
  margin-bottom: 10px;
}
</style>

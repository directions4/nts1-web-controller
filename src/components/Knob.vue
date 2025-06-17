<script setup>
import { computed } from 'vue'

const props = defineProps({
  params: {
    type: Object,
    required: true,
    default: () => ({})
  },
  modelValue: {
    type: Number,
    required: true,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'handleControlChange'])

const _value = computed({
  get() {
    return props.modelValue
  },
  set(num) {
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
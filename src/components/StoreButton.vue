<script setup lang="ts">
import { computed } from 'vue'
import type { StoreButtonProps, StoreButtonEmits } from '@/types/components'

const props = withDefaults(defineProps<StoreButtonProps>(), {
  number: 1
})

const emit = defineEmits<StoreButtonEmits>()

const label = computed((): string => `Patch-${props.number + 1}`)

const load = (): void => {
  emit('load', props.number)
}

const save = (): void => {
  emit('save', props.number)
}
</script>

<template>
  <q-btn-dropdown split color="cyan-8" :label="label" @click="load" class="store-btn">
    <q-list>
      <q-item clickable v-close-popup @click="save">
        <q-item-section>
          <q-item-label>Save</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<style>
.store-btn {
  margin-right: 4px;
}
</style>

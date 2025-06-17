<template>
  <q-btn-dropdown
    split
    color="cyan-8"
    :label="label"
    @click="load"
    class="store-btn"
  >
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

<script setup>
import { computed } from 'vue'

const props = defineProps({
  number: {
    type: Number,
    required: true,
    default: 1
  }
})

const emit = defineEmits(['load', 'save'])

const label = computed(() => `Patch-${props.number + 1}`)

const load = () => {
  emit('load', props.number)
}

const save = () => {
  emit('save', props.number)
}
</script>

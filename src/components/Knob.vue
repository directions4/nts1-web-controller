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

<script>
export default {
  name: "Knob",
  props: {
    params: {
      type: Object,
      require: true,
      default: () => ({})
    },
    value: {
      type: Number,
      require: true,
      default: 0
    }
  },
  data() {
    return {};
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(num) {
        if (this.value !== num) {
          this.$emit("input", num);
          this.$emit("handleControlChange", this.params.cc, num);
        }
      }
    }
  }
};
</script>

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

<script>
export default {
  name: "StoreButton",
  props: {
    number: {
      type: Number,
      require: true,
      default: 1
    }
  },
  computed: {
    label: function() {
      return `Patch-${this.number + 1}`;
    }
  },
  methods: {
    load() {
      this.$emit("load", this.number);
    },
    save() {
      this.$emit("save", this.number);
    }
  }
};
</script>

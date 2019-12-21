<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <Main />
    </q-page-container>
  </q-layout>
</template>

<script>
import Main from "./components/Main.vue";

export default {
  name: "App",
  components: {
    Main
  }
};
</script>

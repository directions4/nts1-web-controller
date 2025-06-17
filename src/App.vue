<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <MainController />
    </q-page-container>
  </q-layout>
</template>

<script>
import MainController from './components/Main.vue'

export default {
  name: 'App',
  components: {
    MainController
  }
}
</script>

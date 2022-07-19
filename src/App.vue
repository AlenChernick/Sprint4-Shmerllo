<template>
  <section class="app-container">
    <app-header />
    <router-view />
  </section>
</template>

<script>
import appHeader from './components/app-header.vue'
export default {
  name: 'app',
  components: {
    appHeader,
  },
}
</script>

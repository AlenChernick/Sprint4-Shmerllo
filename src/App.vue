<template>
  <section class="app-container main-layout">
    <app-header />
    <router-view />
  </section>
</template>

<script>
import appHeader from './components/app-header.vue'
import { userService } from '../services/user-service.js'
export default {
  name: 'app',
  async created() {
    this.$store.dispatch({ type: 'loadBoards' })

},
  components: {
    appHeader,
  },
}
</script>

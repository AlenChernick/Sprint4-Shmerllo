<template>
  <section class="app-container">
    <app-header />
    <router-view />
  </section>
</template>

<script>
import appHeader from "./components/app-header.vue"
export default {
  name: "app",
  created() {
    this.$store.dispatch({type:'loadBoards'})
  },
  components: {
    appHeader,
  },
}
</script>

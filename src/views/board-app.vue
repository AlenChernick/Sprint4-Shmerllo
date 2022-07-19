<template lang="">
  <section class="board-app">
    <h2>This is boards</h2>
    <board-preview />
  </section>
</template>
<script>
import boardPreview from '../components/board-preview.vue'

export default {
  name: 'board-app',
  components: {
    boardPreview,
  },
}
</script>
<style lang=""></style>

<template lang="">
  <section class="board-app">
    <h2>This is boards</h2>
    <board-list :boards="getBoards" />
  </section>
</template>
<script>
import boardList from '../components/board-list.vue'

export default {
  name: 'board-app',
  components: {
    boardList,
  },
  computed: {
    getBoards() {
      return this.$store.getters.getBoards
    },
  },
}
</script>

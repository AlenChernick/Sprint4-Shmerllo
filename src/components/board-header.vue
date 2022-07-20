<template>
  <section class="board-header">
    <h3>{{ getCurrBoard.title }}</h3>
    <board-menu />
    <board-filter />
  </section>
</template>
<script>
import boardMenu from '../components/board-menu.vue'
import boardFilter from '../components/board-filter.vue'

export default {
  name: 'board-header',
  computed: {
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
  },
  components: {
    boardMenu,
    boardFilter,
  },
}
</script>

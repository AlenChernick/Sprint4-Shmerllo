<template lang="">
  <section class="board-app">
    <h3 class="workspace-logo"><font-awesome-icon class="workspace-icon" icon="fab fa-trello" />Workspace</h3>
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

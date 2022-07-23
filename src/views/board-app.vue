<template lang="">
  <section class="board-app">
    <div class="starred-boards">
      <span class="full-star-icon"></span>
      <h3> Starred</h3>
      <h5 v-if="!starredBoards.length">No starred boards yet...</h5>
    <board-list :boards="starredBoards" />
    </div>
    <h3 class="workspace-logo">
      <font-awesome-icon class="workspace-icon" icon="fab fa-trello" />Your workspaces</h3>
    <board-list :boards="nonStarredBoards" />
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
    starredBoards(){
      return this.$store.getters.getBoards.filter((board) => board.isFavorite)
    },
    nonStarredBoards(){
      return this.$store.getters.getBoards.filter((board) => !board.isFavorite)
    }
  },
}
</script>

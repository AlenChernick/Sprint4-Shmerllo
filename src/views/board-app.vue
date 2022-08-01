<template>
  <section class="board-app">
    <div class="boards-container">
      <div class="starred-boards">
        <div class="starred-boards-header">
          <span class="full-star-icon"></span>
          <h3>Starred workspaces</h3>
        </div>
        <div class="no-starred-boards-text" v-if="!starredBoards.length">No starred boards yet...</div>
        <board-list :staredBoard="true" :boards="starredBoards" />
      </div>
      <div class="work-space-logo-container ">
        <h3 class="workspace-logo"><font-awesome-icon class="workspace-icon" icon="fab fa-trello" /></h3>
        <div class="workspace-header">Your workspaces</div>
      </div>
      <board-list :staredBoard="false" :boards="nonStarredBoards" />
    </div>
  </section>
</template>
<script>
import boardList from "../components/board-list.vue"
export default {
  name: "board-app",
  components: {
    boardList,
  },
  computed: {
    getBoards() {
      return this.$store.getters.getBoards
    },
    starredBoards() {
      return this.$store.getters.getBoards.filter((board) => board.isFavorite)
    },
    nonStarredBoards() {
      return this.$store.getters.getBoards.filter((board) => !board.isFavorite)
    },
  },
}
</script>

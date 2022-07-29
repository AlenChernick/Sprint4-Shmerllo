<template>
  <section class="board-list">
    <board-preview v-if="boards" v-for="board in boards" :key="board._id" :board="board" />
    <div v-if="!staredBoard" @click="newBoardModal = !newBoardModal" class="add-new-board">
      <div>Create new board</div>
    </div>
  </section>
      <new-board-modal v-if="newBoardModal" @newBoard="addNewBoard" @abortNewBoardModal="newBoardModal=false"> </new-board-modal>
</template>
<script>
import boardPreview from "../components/board-preview.vue"
import newBoardModal from "../components/new-board-modal.vue"

export default {
  name: "board-list",
  props: {
    boards: {
      type: Object,
    },
    staredBoard: {
      type: Boolean,
    },
  },
  data() {
    return {
      newBoardModal: false,
    }
  },
  methods: {
    addNewBoard(properties) {
      this.newBoardModal = false
      this.$store.dispatch({ type: "newBoard", properties })
    },
  },
  components: {
    boardPreview,
    newBoardModal,
  },
}
</script>
<style lang=""></style>

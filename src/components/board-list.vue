<template>
  <section class="board-list">
    <board-preview v-if="boards" v-for="board in boards" :key="board._id" :board="board" />
    <div v-if="!staredBoard" @click="newBoardModal = !newBoardModal" class="add-new-board">
      <div> Create new board</div>
      <new-board-modal v-if="newBoardModal"> </new-board-modal>
    </div>
  </section>
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
  components: {
    boardPreview,
    newBoardModal,
  },
}
</script>
<style lang=""></style>

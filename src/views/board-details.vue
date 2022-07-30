<template>
  <section class="board-details full" v-if="board" :style="bgStyle">
    <board-header v-if="board._id" :board="board" :key="board._id" />
    <div class="board-list-container flex">
      <group-list v-if="board.groups" :groups="board.groups" :key="board.groups" />
    </div>
    <router-view />
  </section>
</template>

<script>
import boardHeader from '../components/board-header.vue'
import groupList from '../components/group-list.vue'
import { socketService, SOCKET_EMIT_SET_BOARD, SOCKET_EVENT_UPDATE_BOARD } from '../../services/socket.service'

export default {
  name: 'board-details',
  data() {
    return {}
  },
  async created() {
    try {
      const { boardId } = this.$route.params
      console.log(boardId)
      await this.$store.dispatch({
        type: 'loadCurrBoard',
        boardId,
      })
      socketService.emit(SOCKET_EMIT_SET_BOARD, boardId)
      socketService.on(SOCKET_EVENT_UPDATE_BOARD, this.onUpdateBoard)
    } catch (err) {
      console.log('Cannot load board', err)
      throw err
    }
  },

  methods: {
    // updateBoard(board) {
    //   const updatedBoard = JSON.stringify(JSON.parse(board))
    //   this.$store.dispatch({ type: 'saveBoard', board: updatedBoard })
    // },
    onUpdateBoard(board) {
      // const updatedBoard = JSON.stringify(JSON.parse(board))
      this.$store.commit({ type: 'setCurrBoard', currBoard: board })
    },
  },
  computed: {
    board() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
      // return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
    },
    bgStyle() {
      if (this.board && this.board.style?.bgColor)
        return { 'background-color': this.board.style.bgColor, 'background-size': 'cover' }
      if (this.board && this.board.style?.bgImgUrl) return { 'background-image': `url(${this.board.style.bgImgUrl})` }
    },
  },
  components: {
    boardHeader,
    groupList,
  },
  destroyed() {
    this.$store.commit({ type: 'setCurrBoard', currBoard: {} })
  },
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template lang="">
  <section v-if="board" class="board-details full">
    <board-header :board="board" />
    <!-- <h4>{{ board.title }}</h4>
    <h4>{{ board._id }}</h4> -->
    <group-list v-if="board.groups" :groups="board.groups" :key="board.groups" />
    <router-view />
  </section>
</template>

<script>
import boardHeader from '../components/board-header.vue'
import groupList from '../components/group-list.vue'
import { eventBus } from '../../services/eventBus.service.js'

export default {
  name: 'board-details',
  data() {
    return {
      board: {},
    }
  },
  async created() {
    try {
      const { boardId } = this.$route.params
      console.log(boardId)
      const currBoard = await this.$store.dispatch({
        type: 'getBoardById',
        boardId,
      })
      this.board = currBoard
    } catch (err) {
      console.log('Cannot load board', err)
      throw err
    }
  },
  methodes: {
    newTask(groupId) {
      console.log('newtask on Board', groupId)
    },
    updateBoard(board) {
      this.$store.dispatch({ type: 'saveBoard', board })
    },
  },
  components: {
    boardHeader,
    groupList,
  },
}
</script>
<style lang=""></style>

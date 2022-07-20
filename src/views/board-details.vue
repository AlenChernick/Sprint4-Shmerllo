<template lang="">
  <section class="board-details">
    <board-header />
    <h4>{{ board.title }}</h4>
    <h4>{{ board._id }}</h4>
    <group-list :groups="board.groups" />
  </section>
</template>

<script>
import boardHeader from '../components/board-header.vue'
import groupList from '../components/group-list.vue'

export default {
  name: 'board-details',
  data() {
    return {
      board: {},
    }
  },
  async created() {
    try {
      const { id } = this.$route.params
      console.log(id)
      const currBoard = await this.$store.dispatch({ type: 'getBoardById', boardId: id })
      console.log(currBoard)
      this.board = currBoard
    } catch (err) {
      console.log('Cannot load board', err)
      throw err
    }
  },
  components: {
    boardHeader,
    groupList,
  },
}
</script>
<style lang=""></style>

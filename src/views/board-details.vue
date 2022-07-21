<template lang="">
  <section v-if="board" class="board-details full">
    <board-header :title="board.title"
                  :isFavorite="board.isFavorite"
                  :members = "board.members"
                  :byMember = "board.byMember"/>
    <h4>{{ board.title }}</h4>
    <h4>{{ board._id }}</h4>
    <group-list :groups="board.groups"  />
    <router-view/>
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
      const { boardId } = this.$route.params
      console.log(boardId)
      const currBoard = await this.$store.dispatch({ type: 'getBoardById', boardId })
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

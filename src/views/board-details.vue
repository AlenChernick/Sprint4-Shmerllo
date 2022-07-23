<template lang="">
  <section class="board-details full" v-if="board" :style="bgStyle">
    <board-header :board="board" />
    <!-- <pre>{{board.style}}</pre> -->
    <group-list v-if="board.groups" :groups="board.groups" :key="board.groups" />
    <router-view />
    <!-- <pre style="color: black">{{ this.board.groups }}</pre> -->
  </section>
</template>

<script>
import boardHeader from '../components/board-header.vue'
import groupList from '../components/group-list.vue'

export default {
  name: 'board-details',
  data() {
    return {}
  },
  async created() {
    try {
      const { boardId } = this.$route.params
      await this.$store.dispatch({
        type: 'loadCurrBoard',
        boardId,
      })
    } catch (err) {
      console.log('Cannot load board', err)
      throw err
    }
  },

  methods: {
    newTask(groupId) {
      console.log('newtask on Board', groupId)
    },
    updateBoard(board) {
      this.$store.dispatch({ type: 'saveBoard', board })
    },
  },
  computed: {
    board() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
    },
    bgStyle() {
      if (this.board.style.bgColor) return { 'background-color': this.board.style.bgColor }
      if (this.board.style.bgImgUrl) return { 'background-image': `url(${this.board.style.bgImgUrl})` }
    },
  },
  components: {
    boardHeader,
    groupList,
  },
}
</script>
<style lang=""></style>

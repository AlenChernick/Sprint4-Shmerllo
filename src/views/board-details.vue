<template lang="" >
  <section v-if="board" class="board-details full"
       :style="{ 'background-color': board.style.bgColor, 'background-image': `url(${board.style.bgImgUrl})` }">
    <board-header :board="board" />
    <!-- <pre>{{board.style}}</pre> -->
    <group-list
      v-if="board.groups"
      :groups="board.groups"
      :key="board.groups"
    />
    <router-view />
    <!-- <pre style="color: black">{{ this.board.groups }}</pre> -->
  </section>
</template>

<script>
import boardHeader from "../components/board-header.vue"
import groupList from "../components/group-list.vue"

export default {
  name: "board-details",
  data() {
    return {
      // board:   {},
    }
  },
  async created() {
    try {
      const { boardId } = this.$route.params
      console.log(boardId)
      const currBoard = await this.$store.dispatch({
        type: "loadCurrBoard",
        boardId,
      })
      this.board = currBoard
    } catch (err) {
      console.log("Cannot load board", err)
      throw err
    }
  },

  methods: {
    newTask(groupId) {
      console.log("newtask on Board", groupId)
    },
    updateBoard(board) {
      this.$store.dispatch({ type: "saveBoard", board })
    },
   
  },
   computed: {
      board() {
        return JSON.parse((JSON.stringify (this.$store.getters.getCurrBoard)))
      },

    },
  components: {
    boardHeader,
    groupList,
  },
}
</script>
<style lang=""></style>

<template lang="">
  <section class="board-details full" v-if="board" :style="bgStyle">
    <board-header :board="board" />
    <div class="board-list-conteiner flex">
      <group-list
        v-if="board.groups"
        :groups="board.groups"
        :key="board.groups"
      />
    </div>
    <router-view />
  </section>
</template>

<script>
import boardHeader from "../components/board-header.vue"
import groupList from "../components/group-list.vue"

export default {
  name: "board-details",
  data() {
    return {
      // addGroupModal: false,
      // newGroupSubject: "",
    }
  },
  async created() {
    try {
      const { boardId } = this.$route.params
      await this.$store.dispatch({
        type: "loadCurrBoard",
        boardId,
      })
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
    // oneNewGroup(boardId) {
    //   if (!this.newGroupSubject) return
    //   this.addGroupModal = !this.addGroupModal
    //   this.$store.dispatch({ type: "saveGroup", boardId,subject:this.newGroupSubject })
    // },
  },
  computed: {
    board() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
    },
    bgStyle() {
      if (this.board && this.board.style.bgColor)
        return { "background-color": this.board.style.bgColor }
      if (this.board && this.board.style.bgImgUrl)
        return { "background-image": `url(${this.board.style.bgImgUrl})` }
    },
  },
  components: {
    boardHeader,
    groupList,
  },
}
</script>
<style lang=""></style>

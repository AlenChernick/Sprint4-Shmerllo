<template lang="">
  <section class="board-details full" v-if="board" :style="bgStyle">
    <board-header :board="board" />
    <div class="board-list-conteiner flex">
      <group-list
        v-if="board.groups"
        :groups="board.groups"
        :key="board.groups"
      />
      <div class="add-new-group-btn-warp">
        <div
          v-if="!addGroupModal"
          class="add-new-group-btn flex"
          @click="addGroupModal = !addGroupModal"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="task-adding-btn" />
          <div>Add another list</div>
        </div>
        <div v-else class="new-group-add-modal">
          <textarea
            cols="30"
            rows="1"
            class="new-task-area"
            placeholder="Enter list titile..."
            v-model="newGroupSubject"
          ></textarea>
          <div class="new-task-add-remove-conteiner flex">
            <el-button type="primary" @click="oneNewGroup(board._id)"
              >Add Group</el-button
            >
            <span
              class="cancel-add-group"
              @click="addGroupModal = !addGroupModal"
            ></span>
          </div>
        </div>
      </div>
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
      addGroupModal: false,
      newGroupSubject: "",
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
    oneNewGroup(boardId) {
      if (!this.newGroupSubject) return
      this.addGroupModal = !this.addGroupModal
      this.$store.dispatch({ type: "saveGroup", boardId,subject:this.newGroupSubject })
    },
  },
  computed: {
    board() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
    },
    bgStyle() {
      if (this.board.style.bgColor)
        return { "background-color": this.board.style.bgColor }
      if (this.board.style.bgImgUrl)
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

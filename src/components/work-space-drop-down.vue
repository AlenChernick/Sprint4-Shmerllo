<template lang="">
  <el-dropdown v-if="boards">
    <span class="el-dropdown-link">
      <div class="work-space-header flex">
        <span>Workspaces</span>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </div>
    </span>
    <template #dropdown class="work-space-drop">
      <div class="drop-down-inner-header flex">
        <span> Workspaces</span>
      </div>
      <div class="seperator"></div>
      <el-dropdown-menu v-for="(board, idx) in boards" :key="board._id" class="work-spaces-items flex">
        <el-dropdown-item @click="goToWorkPlase(board)"
          ><div class="workspace-owner">{{ userFirstLetter(board.byMember.fullname) }}</div>
          "{{ board.title }}" - <span> &nbsp; {{ board.byMember.fullname }}'s Workspace </span></el-dropdown-item
        >
        <div v-if="boards.length !== idx + 1" class="seperator"></div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script>
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  data() {
    return {}
  },
  methods: {
    goToWorkPlase(board) {
      const currBoard = this.$store.dispatch({ type: 'loadCurrBoard', boardId: board._id })
      this.$router.push(`/board/${currBoard._id}`)
    },
    userFirstLetter(memberFullName) {
      return memberFullName.charAt(0).toUpperCase()
    },
  },
  computed: {
    boards() {
      return this.$store.getters.getBoards
    },
  },
  components: {
    ArrowDown,
  },
}
</script>

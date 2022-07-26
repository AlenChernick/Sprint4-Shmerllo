<template>
  <section class="actions-modal-container add-checklist">
    <div class="checklist-modal">
      <h4>Add checklist</h4>
      <span @click.stop="closeModal" class="close-icon"></span>
      <div class="modal-options">
        <div class="checklist-input-header">Title</div>
        <input
          autofocus
          spellcheck="false"
          type="text"
          v-model="checkList.checkListTitle"
          @keyup.enter="addCheckList"
        />
        <el-button class="confirm-btn" @click.stop="closeModal" type="primary" @click="addCheckList">Add</el-button>
      </div>
    </div>
  </section>
</template>
<script>
import { utilService } from '../../services/util-service'
export default {
  name: 'add-checklist',
  data() {
    return {
      checkList: {
        id: utilService.makeId(),
        checkListTitle: '',
        todos: [],
      },
    }
  },
  methods: {
    addCheckList() {
      if (!this.checkList.id) return
      this.$emit('addCheckList', this.checkList)
    },
    closeModal() {
      this.$emit('closeModal')
    },
  },
  created() {},
  computed: {},
}
</script>
<style lang=""></style>

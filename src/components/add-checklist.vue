<template>
  <section class="actions-modal-container add-checklist">
    <div class="checklist-modal">
      <h4>Add checklist</h4>
      <span @click.stop="closeModal" class="close-icon"></span>
      <div class="modal-options">
        <div class="checklist-input-header">Title</div>
        <input autofocus spellcheck="false" type="text" v-model="checkListTitle" @keyup.enter="addCheckList" />
        <el-button @click.stop="closeModal" type="primary" @click="addCheckList">Add</el-button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'add-checklist',
  data() {
    return {
      checkListTitle: '',
    }
  },
  methods: {
    addCheckList() {
      this.$emit('addCheckList', this.checkListTitle)
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

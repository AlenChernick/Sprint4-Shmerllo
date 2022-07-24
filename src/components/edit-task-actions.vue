<template>
  <section class="edit-task-actions">
    <div class="main-task-sidebar">
      <div class="main-task-header">Add to card</div>

      <member-picker @toggleMember="toggleMember" />
      <label-picker @toggleLabel="toggleLabel" />

      <div @click="this.isCheckListAdded = !this.isCheckListAdded" class="main-task-edit-btn">
        <span class="checklist-icon"></span>
        Checklist
      </div>
      <div v-if="isCheckListAdded" class="checklist-modal">
        <div class="checklist-header">Add Checklist</div>
        <div v-if="getCurrTask" class="close-task-edit" @click="isCheckListAdded = false">
          <span class="close-checklist-modal"></span>
        </div>
        <div class="modal-options">
          <div class="checklist-input-header">Title</div>
          <input type="text" v-model="checkListTitle" @keyup.enter="addCheckList(checkListTitle)" />
          <el-button type="primary" @click="addCheckList(checkListTitle)">Add</el-button>
        </div>
      </div>
      <div @click="toggleDatePicker = !toggleDatePicker" class="main-task-edit-btn">
        <span class="dates-icon"><font-awesome-icon class="dates-icon-font-awesome" icon="fa-regular fa-clock" /></span>
        Dates
      </div>
      <div class="main-task-edit-btn">
        <span class="attachment-icon"></span>
        Attachment
      </div>
      <div class="main-task-edit-btn">
        <span class="cover-icon"></span>
        Cover
      </div>
    </div>
  </section>
</template>
<script>
import labelPicker from '../components/label-picker.vue'
import memberPicker from '../components/member-picker.vue'
export default {
  data() {
    return {
      isCheckListItemAdded: false,
      isCheckListAdded: false,
      displayLabelPicker: 'none',
      todoTitle: '',
      checkListTitle: '',
    }
  },
  components: {
    labelPicker,
    memberPicker,
  },
}
</script>

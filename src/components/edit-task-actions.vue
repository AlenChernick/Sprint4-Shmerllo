<template>
  <section class="edit-task-actions">
    <div class="main-task-sidebar">
      <div class="main-task-header">Add to card</div>

      <div v-for="btn in actionBtns" @click.stop="openModal(btn.type)" class="main-task-edit-btn">
        <span :class="btn.icon"></span>
        {{ btn.txt }}
      </div>
      <component
        :is="cmpType"
        @closeModal="closeModal"
        @toggleLabel="toggleLabel"
        @toggleMember="toggleMember"
        @setTaskStyle="setTaskStyle"
      >
      </component>

      <!-- TODO WITH ALEN -->
      <!-- <div @click="this.isCheckListAdded = !this.isCheckListAdded" class="main-task-edit-btn">
        <span class="checklist-icon"></span>
        Checklist
      </div>
      <div v-if="isCheckListAdded" class="checklist-modal">
        <div class="checklist-header">Add Checklist</div>
        <div v-if="getCurrTask" class="close-task-edit" @click="isCheckListAdded = false">
          <span class="close-checklist-modal"></span>
        </div> -->

      <!-- TODO WITH ALEN -->
      <!-- <div class="modal-options">
          <div class="checklist-input-header">Title</div>
          <input type="text" v-model="checkListTitle" @keyup.enter="addCheckList(checkListTitle)" />
          <el-button type="primary" @click="addCheckList(checkListTitle)">Add</el-button>
        </div>
      </div>
      <div @click="toggleDatePicker = !toggleDatePicker" class="main-task-edit-btn">
        <span class="dates-icon"><font-awesome-icon class="dates-icon-font-awesome" icon="fa-regular fa-clock" /></span>
        Dates
      </div> -->
    </div>
  </section>
</template>
<script>
import labelPicker from '../components/label-picker.vue'
import memberPicker from '../components/member-picker.vue'
import addChecklist from '../components/add-checklist.vue'
import datePicker from '../components/date-picker.vue'
import addAttachment from '../components/add-attachment.vue'
import coverPicker from '../components/cover-picker.vue'

export default {
  data() {
    return {
      actionBtns: [
        { txt: 'Labels', icon: 'labels-icon', type: 'labelPicker' },
        { txt: 'Members', icon: 'members-icon', type: 'memberPicker' },
        { txt: 'Checklist', icon: 'checklist-icon', type: 'addChecklist' },
        { txt: 'Dates', icon: 'dates-icon', type: 'datePicker' },
        { txt: 'Attachment', icon: 'attachment-icon', type: 'addAttachment' },
        { txt: 'Cover', icon: 'cover-icon', type: 'coverPicker' },
      ],
      cmpType: null,
      displayModal: 'none',
      // isCheckListItemAdded: false,
      // isCheckListAdded: false,
      // displayLabelPicker: 'none',
      // todoTitle: '',
      // checkListTitle: '',
    }
  },
  methods: {
    openModal(cmpType) {
      this.cmpType = cmpType
    },
    closeModal() {
      this.cmpType = null
    },
    toggleLabel(labelId) {
      this.$emit('toggleLabel', labelId)
    },
    toggleMember(member) {
      this.$emit('toggleMember', member)
    },
    setTaskStyle(style) {
      this.$emit('setTaskStyle', style)
    },
  },
  components: {
    labelPicker,
    memberPicker,
    addChecklist,
    datePicker,
    addAttachment,
    coverPicker,
  },
}
</script>

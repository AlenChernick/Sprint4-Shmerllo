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
        @addAttachment="addAttachment"
        @addCheckList="addCheckList"
      >
      </component>

      <!-- <div @click="toggleDatePicker = !toggleDatePicker" class="main-task-edit-btn">
        <span class="dates-icon"><font-awesome-icon class="dates-icon-font-awesome" icon="fa-regular fa-clock" /></span>
        Dates
      </div>
      -->
    </div>
  </section>
</template>
<script>
import labelPicker from '../components/label-picker.vue'
import memberPicker from '../components/member-picker.vue'
import addCheckList from '../components/add-checklist.vue'
import datePicker from '../components/date-picker.vue'
import addAttachment from '../components/add-attachment.vue'
import coverPicker from '../components/cover-picker.vue'

export default {
  data() {
    return {
      actionBtns: [
        { txt: 'Labels', icon: 'labels-icon', type: 'labelPicker' },
        { txt: 'Members', icon: 'members-icon', type: 'memberPicker' },
        { txt: 'Checklist', icon: 'checklist-icon', type: 'addCheckList' },
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
    addAttachment(attachment) {
      this.$emit('addAttachment', attachment)
    },
    addCheckList(checkListTitle) {
      this.$emit('addCheckList', checkListTitle)
    },
  },
  components: {
    labelPicker,
    memberPicker,
    addCheckList,
    datePicker,
    addAttachment,
    coverPicker,
  },
}
</script>

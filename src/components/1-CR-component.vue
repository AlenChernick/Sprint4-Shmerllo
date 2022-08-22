<!-- edit-task-actions component -->

<template>
  <section class="edit-task-actions">
    <!-- Loop through Array of buttons -->
    <div v-for="btn in actionBtns" @click.stop="openModal(btn.type)" class="main-task-edit-btn">
      <span :class="btn.icon"></span>
      {{ btn.txt }}
    </div>

    <!-- Dynamic component oppened when button is clicked -->
    <component :is="cmpType" @closeModal="closeModal" @editTask="editTask"></component>
  </section>
</template>

<script>
export default {
  data() {
    return {
      //Array of buttons
      actionBtns: [
        { txt: 'Members', icon: 'members-icon', type: 'memberPicker' },
        { txt: 'Labels', icon: 'labels-icon', type: 'labelPicker' },
        { txt: 'Checklist', icon: 'checklist-icon', type: 'addCheckList' },
        { txt: 'Dates', icon: 'dates-icon', type: 'datePicker' },
        { txt: 'Attachment', icon: 'attachment-icon', type: 'addAttachment' },
        { txt: 'Cover', icon: 'cover-icon', type: 'coverPicker' },
      ],
      cmpType: null, //Dynamic component type
      displayModal: 'none',
    }
  },
  methods: {
    openModal(cmpType) {
      this.cmpType = cmpType
    },
    closeModal() {
      this.cmpType = null
    },
    editTask(editData) {
      this.$emit('editTask', editData)
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

<!-- Member picker component  -->

<template>
  <section class="actions-modal-container member-picker">
    <h4>Members</h4>
  </section>
</template>

<script>
export default {
  name: 'member-picker',
  methods: {
    toggleMember(member) {
      this.$emit('editTask', { type: 'toggleMember', data: member })
    },
    closeModal() {
      this.$emit('closeModal')
    },
  },
}
</script>

<!-- Task-edit component (part of) -->

<template>
  <edit-task-actions @editTask="editTask" />
</template>

<script>
export default {
  name: 'task-edit',
  data() {
    return {
      taskToEdit: {}, //loaded from string parms when component is created
    }
  },
  methods: {
    editTask(editData) {
      let userAction

      switch (editData.type) {
        case 'toggleMember':
          const member = editData.data
          const members = this.taskToEdit.members
          idx = members.findIndex((m) => m.id === member.id)
          if (idx === -1) {
            members.push(member)
            userAction = 'Added member'
          } else {
            members.splice(idx, 1)
            userAction = 'Removed member'
          }
          break

        case 'toggleLabel':

        case 'addCheckList':

        case 'setDate':

        case 'addAttachment':

        case 'setTaskStyle':
      }
      this.saveTask(userAction)
    },

    saveTask(userAction) {
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.getCurrBoard._id,
        userAction,
        taskTitle: this.taskToEdit.title,
      })
    },
  },
}
</script>

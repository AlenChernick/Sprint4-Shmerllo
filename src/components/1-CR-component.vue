<!-- edit-task-actions component -->

<template>
  <section class="edit-task-actions">
    <!-- Loop through Array of buttons -->
    <div v-for="btn in actionBtns" @click.stop="openModal(btn.type)" class="main-task-edit-btn">
      <span :class="btn.icon"></span>
      {{ btn.txt }}
    </div>

    <!-- Dynamic component oppened when button is clicked -->
    <component
      :is="cmpType"
      @closeModal="closeModal"
      @toggleMember="toggleMember"
      @toggleLabel="toggleLabel"
      @setTaskStyle="setTaskStyle"
      @addAttachment="addAttachment"
      @addCheckList="addCheckList"
      @setDate="setDate"
      @removeDate="removeDate"
    ></component>
  </section>
</template>

<script>
// Import dynamic components
import labelPicker from '../components/label-picker.vue'
import memberPicker from '../components/member-picker.vue'
import addCheckList from '../components/add-checklist.vue'
import datePicker from '../components/date-picker.vue'
import addAttachment from '../components/add-attachment.vue'
import coverPicker from '../components/cover-picker.vue'

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
    toggleMember(member) {
      this.$emit('toggleMember', member)
    },
    toggleLabel(labelId) {
      this.$emit('toggleLabel', labelId)
    },
    setTaskStyle(style) {
      this.$emit('setTaskStyle', style)
    },
    addAttachment(attachment) {
      this.$emit('addAttachment', attachment)
    },
    addCheckList(checklist) {
      this.$emit('addCheckList', checklist)
    },
    setDate(dateValue) {
      this.$emit('setDate', dateValue)
    },
    removeDate(dateValue) {
      this.$emit('removeDate', dateValue)
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
    <span @click.stop="closeModal" class="close-icon"></span>
    <ul class="clean-list" v-for="member in membersToEdit">
      <li class="member-picker-list" @click.stop="toggleMember(member)">
        <img :src="member.imgUrl" />
        <h5>{{ member.fullname }}</h5>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'member-picker',
  data() {
    return {
      membersToEdit: null,
    }
  },
  methods: {
    toggleMember(member) {
      this.$emit('toggleMember', member)
    },
    closeModal() {
      this.$emit('closeModal')
    },
  },
  created() {
    this.membersToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.members))
  },
  computed: {},
}
</script>

<!-- Task-edit component (part of) -->

<template>
  <edit-task-actions
    @toggleLabel="toggleLabel"
    @toggleMember="toggleMember"
    @setTaskStyle="setTaskStyle"
    @addAttachment="addAttachment"
    @addCheckList="addCheckList"
    @setDate="setDate"
    @removeDate="removeDate"
  />
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
    toggleMember(member) {
      const members = this.taskToEdit.members
      const idx = members.findIndex((m) => m.id === member.id)
      let userAction = ''
      if (idx === -1) {
        userAction = 'Add member'
        members.push(member)
      } else {
        members.splice(idx, 1)
        userAction = 'Removed member'
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

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
      @editTask="editTask"
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
    editTask(editData){
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
      this.$emit('editTask', {type: 'toggleMember', data: member})
    },
    closeModal() {
      this.$emit('closeModal')
    },
  },
  created() {
    this.membersToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.members))
  }
}
</script>

<!-- Task-edit component (part of) -->

<template>
 <edit-task-actions
      @editTask="editTask"
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
    editTask(editData){
      
      let idx
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
            this.saveTask(userAction)
            const notification = {
                mentionedUserId: member._id,
                userAction,
                taskTitle: this.taskToEdit.title,
                time: Date.now(),
                style: this.taskToEdit.style,
              }
            socketService.emit(SOCKET_EMIT_MEMBER_ACTION, notification)
            break    
        
        case 'toggleLabel':
          const labelId = editData.data
          const labels = this.taskToEdit.labelIds
          idx = labels.findIndex((label) => label === labelId)
          if (idx === -1) {
              labels.push(labelId)
              userAction = 'Added label'
          } else {
              labels.splice(idx, 1)
              userAction = 'Removed label'
          }
          this.saveTask(userAction)
          break   
          
        case 'addCheckList':
          const checklist = editData.data
          if (checklist.checkListTitle === '') return
          this.taskToEdit.checklists.push(checklist)
          this.saveTask('Added checklist')
          this.isCheckListAdded = false
          this.checkListTitle = ''
          break  

        case 'setDate':
          const dateValue = editData.data    
          this.taskToEdit.dueDate = dateValue
          this.saveTask('Added due date')
          break 

        case 'addAttachment':
          const attachment = editData.data    
          this.taskToEdit.attachments.push(attachment)
          this.saveTask('Added attchment')
          break

        case 'setTaskStyle':
          const style = editData.data    
          this.taskToEdit.style = style
          this.saveTask('Changed cover')
          break
        }
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

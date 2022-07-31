<template>
  <section class="task-preview-container" @click="openTaskDetails">
    <span @click.stop="quickEditDisplay = 'block'" class="edit-icon">
      <font-awesome-icon class="edit-icon-font-awesome" icon="fa-solid fa-pen"
    /></span>
    <div class="task-preview-img" v-if="task.style?.bgImgUrl">
      <img :src="task.style.bgImgUrl" alt="" />
    </div>
    <div v-else-if="task.style?.bgColor" class="prev-task-color" :style="{ 'background-color': task.style.bgColor }"></div>
    <task-preview-details @addTaskMember="addMemeberOnDrop" :groupId="groupId" :task="task" :key="task.id" />

    <div @click.stop="quickEditDisplay = 'none'" class="quickEditScreen" :style="{ display: quickEditDisplay }"></div>

    <div class="quickEdit" :style="{ display: quickEditDisplay }">
      <div class="title-edit">
        <img v-if="task.style?.bgImgUrl" :src="task.style.bgImgUrl" />
        <textarea placeholder="Enter a title for this card..." v-model="taskToEdit.title" @click.stop></textarea>
      </div>

      <div class="action-buttons">
        <button @click="openTaskDetails"><span class="card-icon"></span>Open card</button>

        <button v-for="btn in actionBtns" @click.stop="openModal(btn.type)">
          <span :class="btn.icon"></span>
          {{ btn.txt }}
        </button>

        <component :is="cmpType" @closeModal="closeModal" @editTask="editTask"> </component>

        <div @click.stop="removeTask"><span class="archive-icon"></span>Archive</div>
      </div>
      <div class="save-button">
        <button @click.stop="editTitle">Save</button>
      </div>
    </div>
  </section>
</template>
<script>
import labelPicker from "../components/label-picker.vue"
import memberPicker from "../components/member-picker.vue"
import datePicker from "../components/date-picker.vue"
import coverPicker from "../components/cover-picker.vue"
import taskPreviewDetails from "../components/task-preview-details.vue"
import { utilService } from "../../services/util-service.js"

export default {
  name: "task-preview",
  props: {
    task: {
      type: Object,
    },
    groupId: {
      type: String,
    },
  },
  data() {
    return {
      quickEditDisplay: "none",
      actionBtns: [
        { txt: "Labels", icon: "labels-icon", type: "labelPicker" },
        { txt: "Members", icon: "members-icon", type: "memberPicker" },
        { txt: "Cover", icon: "cover-icon", type: "coverPicker" },
        { txt: "Dates", icon: "dates-icon", type: "datePicker" },
      ],
      cmpType: null,
      displayModal: "none",
      taskToEdit: {},
      boardToEdit: {},
      labelOpen: false,
      tasklen: 0,
      addDndTimes: [],
    }
  },
  created() {
    this.taskToEdit = JSON.parse(JSON.stringify(this.task))
    this.boardToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
    this.boardToEdit.groups.forEach((g) => (this.tasklen += g.tasks.length || 0))
  },
  methods: {
    saveTask(userAction = "Task update") {
      this.$store.dispatch({
        type: "saveTask",
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        currBoard: this.getCurrBoard,
        userAction,
      })
    },
    editTask(editData) {
      console.log(editData)
      let idx
      let userAction
      switch (editData.type) {
        case "toggleMember":
          const member = editData.data
          console.log(member)
          const members = this.taskToEdit.members
          idx = members.findIndex((m) => m._id === member._id)
          if (idx === -1) {
            members.push(member)
            userAction = "Added member"
          } else {
            members.splice(idx, 1)
            userAction = "Removed member"
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

        case "toggleLabel":
          const labelId = editData.data
          const labels = this.taskToEdit.labelIds
          idx = labels.findIndex((label) => label === labelId)
          if (idx === -1) {
            labels.push(labelId)
            userAction = "Added label"
          } else {
            labels.splice(idx, 1)
            userAction = "Removed label"
          }
          this.saveTask(userAction)
          break

        case "addCheckList":
          const checklist = editData.data
          if (checklist.checkListTitle === "") return
          this.taskToEdit.checklists.push(checklist)
          this.saveTask("Added checklist")
          this.isCheckListAdded = false
          this.checkListTitle = ""
          break

        case "setDate":
          const dateValue = editData.data
          this.taskToEdit.dueDate = dateValue
          this.saveTask("Added due date")
          break

        case "addAttachment":
          const attachment = editData.data
          this.taskToEdit.attachments.push(attachment)
          this.saveTask("Added attchment")
          break

        case "setTaskStyle":
          const style = editData.data
          this.taskToEdit.style = style
          this.saveTask("Changed cover")
          break
      }
    },
    removeTask() {
      this.$store.dispatch({
        type: "removeTask",
        taskId: this.getCurrTask.id,
        groupId: this.groupId,
        boardId: this.boardId,
      })
      this.$router.push(`/board/${this.boardId}`)
    },
    openTaskDetails() {
      this.$router.push(`/board/${this.boardToEdit._id}/${this.groupId}/${this.task.id}`)
      this.quickEditDisplay = "none"
    },
    saveTask(userAction) {
      this.$store.dispatch({
        type: "saveTask",
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardToEdit._id,
        userAction,
        taskTitle: this.taskToEdit.title,
      })
    },
    editTitle() {
      this.saveTask("Edit title")
    },
    openModal(cmpType) {
      this.cmpType = cmpType
    },
    closeModal() {
      this.cmpType = null
    },
    // toggleLabel(labelId) {
    //   const labels = this.taskToEdit.labelIds
    //   const idx = labels.findIndex((label) => label === labelId)
    //   let userAction = ""
    //   if (idx === -1) {
    //     userAction = "Added label"
    //     labels.push(labelId)
    //   } else {
    //     labels.splice(idx, 1)
    //     userAction = "Removed label"
    //   }
    //   this.saveTask(userAction)
    // },
    // toggleMember(member) {
    //   const members = this.taskToEdit.members
    //   const idx = members.findIndex((m) => m._id === member._id)
    //    let userAction = ""
    //   if (idx === -1) {
    //     userAction = "Add member"
    //     members.push(member)
    //   } else {
    //     members.splice(idx, 1)
    //     userAction = "Removed member"
    //   }
    //   this.saveTask(userAction)
    // },
    // setTaskStyle(style) {
    //   this.taskToEdit.style = style
    //   this.saveTask("Changed cover")
    // },
    // addAttachment(attachment) {
    //   this.taskToEdit.attachments.push(attachment)
    //   this.saveTask("Added attchement")
    // },
    addMemeberOnDrop(memberId) {
      let member = this.boardToEdit.members.find((member) => member._id === memberId)
      this.editTask({ type: "toggleMember", data: member })
    },
  },
  computed: {
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
  },
  components: {
    taskPreviewDetails,
    labelPicker,
    memberPicker,
    datePicker,
    coverPicker,
  },
}
</script>

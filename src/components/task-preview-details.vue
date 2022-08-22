<template>
  <div class="task-prev-details-conteiner" v-if="task">
    <div v-if="task?.labelIds" class="label-task-preview-container">
      <ul class="clean-list flex flex-warp">
        <li v-for="labelId in task.labelIds" :class="labelStaus" @click.stop="openLables" :style="{ 'background-color': labelColor(labelId) }">
          <span v-if="boardToEdit.isLabelsOpen">{{ labelTxt(labelId) }}</span>
        </li>
      </ul>
    </div>

    <div class="prev-task-title">{{ task.title }}</div>

    <div class="prev-fetchers-conteiner flex flex-warp">
      <div v-if="task.dueDate" class="prev-duedate-conteiner flex" :style="{ 'background-color': dueDateColor }" title="Due-Date">
        <div class="prev-dueDate-clock-icon"></div>
        <div class="prev-dueDate">
          {{ convertDate(task.dueDate) }}
        </div>
      </div>
      <div v-if="task.description" class="prev-task-desk-icon"></div>
      <div v-if="task.attachments?.length > 0" class="prev-task-attachments-conteiner">
        <div class="prev-task-attachments-icon"></div>
        <div class="prev-task-attachments-count">{{ attachmentsCount }}</div>
      </div>
      <div v-if="task.comments?.length > 0" class="prev-task-comments">
        <div class="prev-task-comments-icon"></div>
        <div class="prev-task-comments-count">{{ commentsCount }}</div>
      </div>
      <div v-if="task.checklists?.length > 0" :class="doneTodos">
        <span class="prev-task-checklists-icon"></span>
        <span class="prev-task-checklists-count">{{ todosCount(task.checklists) }}</span>
      </div>

      <Container @click.stop v-if="task.members" @drop="onDrop($event)" :get-child-payload="getChildPayload" orientation="horizontal" group-name="members" class="drag-img-conteiner-big prev-members-imgs">
        <Draggable class="members-imgs-draggble" v-for="member in task.members" :key="member._id">
          <ul class="clean-list">
            <img class="prev-member-img" :src="member.imgUrl" />
          </ul>
        </Draggable>
      </Container>
    </div>
  </div>
</template>
<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/dnd-service.js'
export default {
  name: 'task-preview-details',
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
      boardToEdit: {},
      labelOpen: false,
    }
  },
  created() {
    // this.taskToEdit = JSON.parse(JSON.stringify(this.task))
    this.boardToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
  },
  methods: {
    labelColor(labelId) {
      const boardLabels = this.$store.getters.getCurrBoard.boardLabels
      const label = boardLabels.find((l) => l.id === labelId)
      return label.bgColor
    },
    labelTxt(labelId) {
      const boardLabels = this.$store.getters.getCurrBoard.boardLabels
      const label = boardLabels.find((l) => l.id === labelId)
      return label.txt
    },
    openLables() {
      this.boardToEdit.isLabelsOpen = !this.boardToEdit.isLabelsOpen
      this.$store.dispatch({ type: 'saveBoard', board: this.boardToEdit })
    },
    todosCount(checklists) {
      let tempDoneTodos = 0
      let todos = 0

      checklists.forEach((checklist) => {
        checklist.todos.forEach((todo) => {
          todos++
          if (todo.isDone === true) tempDoneTodos++
        })
      })
      return `${tempDoneTodos}/${todos}`
    },
    convertDate(dueDate) {
      const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      let formatedDate = new Date(dueDate)
      let dueDateMonth = formatedDate.getMonth()
      dueDateMonth = monthArr[dueDateMonth]
      let dueDateDay = formatedDate.getDate()

      return `${dueDateMonth} ${dueDateDay}`
    },
    onDrop(dropRes) {
      let memberId = dropRes.payload._id

      if (dropRes.addedIndex !== null) {
        this.$emit('addTaskMember', memberId)
      }
    },
    getChildPayload(idx) {
      return this.task.members[idx]
    },
  },
  computed: {
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
    labelStaus() {
      if (!this.boardToEdit.isLabelsOpen) return 'label-task-preview'
      if (this.boardToEdit.isLabelsOpen) return 'label-task-preview-full'
    },
    doneTodos() {
      let checklists = this.task.checklists
      let tempDoneTodos = 0
      let todos = 0

      checklists.forEach((checklist) => {
        checklist.todos.forEach((todo) => {
          todos++
          if (todo.isDone === true) tempDoneTodos++
        })
      })

      return {
        'prev-task-checklists doneTodos': tempDoneTodos === todos && todos !== 0,
        'prev-task-checklists': tempDoneTodos !== todos,
      }
    },
    commentsCount() {
      return this.task.comments.length
    },
    attachmentsCount() {
      return this.task.attachments.length
    },
    dueDateColor() {
      if (new Date() < new Date(this.task.dueDate)) return '#61bd4f'
      if (new Date() >= new Date(this.task.dueDate)) return 'orange'
    },
  },
  components: {
    Container,
    Draggable,
  },
}
</script>

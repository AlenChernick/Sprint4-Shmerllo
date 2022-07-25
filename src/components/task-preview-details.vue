<template>
  <div class="task-prev-details-conteiner" v-if="task">
    <div v-if="taskToEdit?.labelIds" class="label-task-preview-container">
      <ul v-for="labelId in taskToEdit.labelIds" class="clean-list flex">
        <li
          :class="labelStaus"
          @click.stop="openLables"
          :style="{ 'background-color': labelColor(labelId) }"
        >
          <span v-if="boardToEdit.isLabelsOpen">{{ labelTxt(labelId) }}</span>
        </li>
      </ul>
    </div>

    <div class="prev-task-title">{{ task.title }}</div>

    <div class="prev-fetchers-conteiner flex flex-warp">
      <div v-if="task.description" class="prev-task-desk-icon"></div>
      <div v-if="task.dueDate" class="prev-dueDate">
        {{ convertDate(task.dueDate) }}
      </div>
      <div v-if="task.checklists.length > 0" class="prev-task-checklists">
        <span class="prev-task-checklists-icon"></span>
        <span  class="prev-task-checklists-count">{{ todosCount(task.checklists) }}</span>
                <!-- <span  :class="prev-task-checklists-count">{{ todosCount(task.checklists) }}</span> -->

      </div>

      <div class="flex prev-members-imgs">
        <ul
          v-if="task.members"
          class="clean-list flex"
          v-for="member in task.members"
        >
          <img class="prev-member-img" :src="member.imgUrl" />
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "task-preview-details",
  props: {
    task: {
      type: Object,
    },
  },
  data() {
    return {
      taskToEdit: {},
      boardToEdit: {},
      labelOpen: false,
    }
  },
  created() {
    this.taskToEdit = JSON.parse(JSON.stringify(this.task))
    this.boardToEdit = JSON.parse(
      JSON.stringify(this.$store.getters.getCurrBoard)
    )
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
      // let boardToUpdate = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
      this.boardToEdit.isLabelsOpen = !this.boardToEdit.isLabelsOpen
      this.$store.dispatch({ type: "saveBoard", board: this.boardToEdit })
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
    convertDate(dueDate){
     const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']  
     dueDate = new Date()
      let  dueDateMonth = dueDate.getMonth() + 1
      dueDateMonth = monthArr[dueDateMonth]
      let dueDateDay = dueDate.getDate()
       return `${dueDateDay}    ${dueDateMonth}`

        // let month = dueDate.date() + 1;
        // let day =  dueDate.getDate()
        // return `${day} + ${month}`
        // return `${dueDateDay} + ${dueDateMonth}`
    }
  },
  computed: {
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
    labelStaus() {
      if (this.boardToEdit.isLabelsOpen === false) return "label-task-preview"
      if (this.boardToEdit.isLabelsOpen) return "label-task-preview-full"
    },

  },
}
</script>

<template>
  <section @click="openTaskDetails">
    <span @click.stop="quickEditDisplay = 'block'" class="edit-icon">
      <font-awesome-icon icon="fa-solid fa-pen"
    /></span>
    <div v-if="task.style?.bgImgUrl">
      <img :src="task.style.bgImgUrl" alt="" />
    </div>
    <div v-else-if="task.style?.bgColor"  class="prev-task-color" :style="{'background-color':task.style.bgColor}"></div>
    <task-preview-details :task="task" :key="task.id"/>

   
    <!-- Tal's part -->
    <div
      @click.stop="quickEditDisplay = 'none'"
      class="quickEditScreen"
      :style="{ display: quickEditDisplay }"
    ></div>

    <div class="quickEdit" :style="{ display: quickEditDisplay }">
      <div class="title-edit">
        <img v-if="task.style?.bgImgUrl" :src="task.style.bgImgUrl" />
        <h5>{{ task.title }}</h5>
      </div>

      <div class="action-buttons">
        <button @click="openTaskDetails">
          <span class="card-icon"></span>Open card
        </button>
        <button @click="editLabels">
          <span class="labels-icon"></span>Edit lables
        </button>
        <button @click="editMembers">
          <span class="members-icon"></span>Change members
        </button>
        <button @click="changeCover">
          <span class="cover-icon"></span>Change cover
        </button>
        <button @click="editDates">
          <span class="dates-icon"></span>Edit dates
        </button>
        <button @click="removeTask">
          <span class="archive-icon"></span>Archive
        </button>
      </div>

      <div class="save-button">
        <button>Save</button>
      </div>
    </div>
  </section>
</template>
<script>
import taskPreviewDetails from "../components/task-preview-details.vue"

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
      // taskToEdit: {},
      // boardToEdit: {},
      // labelOpen: false,
    }
  },
  created() {
    this.taskToEdit = JSON.parse(JSON.stringify(this.task))
    this.boardToEdit = JSON.parse(
      JSON.stringify(this.$store.getters.getCurrBoard)
    )
  },
  methods: {
    openTaskDetails() {
      console.log(
        `/board/${this.getCurrBoard._id}/${this.groupId}/${this.task.id}`
      )
      this.$router.push(
        `/board/${this.getCurrBoard._id}/${this.groupId}/${this.task.id}`
      )
      // this.$router.push('')
    },
    removeTask() {
      console.log("remove task")
      this.$store.dispatch({ type: "removeTask", taskId: this.task.id })
    },

  
  },
  computed: {
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },

  },
  components: {
    taskPreviewDetails,
  },
}
</script>

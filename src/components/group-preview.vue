<template>
  <section>
    <div class="group-header flex">
      <!-- <div class="">{{ group.title }}</div> -->
      <div class="group-subject-header">
        <input
          type="text"
          v-model="group.title"
          @input="onSaveGroup(group.id)"
        />
      </div>
      <div class="group-dots-options-box">
        <div class="group-dots-options" @click="onRemoveGroup(group.id)">
          <font-awesome-icon icon="fa-solid fa-ellipsis" />
        </div>
      </div>
      <div class="group-remove-modal"></div>
    </div>
    <task-list :tasks="group.tasks" :groupId="group.id" />
    <div
      v-if="!newTaskModal"
      class="task-adding-conteiner flex"
      @click="newTaskModal = !newTaskModal"
    >
      <div class="task-adding-btn">
        <font-awesome-icon icon="fa-solid fa-plus" />
      </div>
      <div>Add new card</div>
    </div>
    <div v-else>
      <textarea
        cols="30"
        rows="2"
        class="new-task-area"
        placeholder="Enter a title for this card..."
        v-model="taskTitle"
      ></textarea>
      <button @click="newTaskModal = !newTaskModal">x</button>
      <button @click="oneNewTask(group.id)">add</button>
    </div>
  </section>
</template>
<script>
import taskList from "../components/task-list.vue"
// import { newTask } from "../../services/eventBus.service.js"
export default {
  name: "group-preview",
  props: {
    group: {
      type: Object,
    },
  },
  data() {
    return {
      currBoard: {},
      currTask: {},
      newTaskModal: false,
      taskTitle: "",
    }
  },
  created() {
    this.currBoard = this.$store.getters.getCurrBoard
    // this.currTask = this.$store.getters.getCurrTask
    // console.log('currTask', this.currTask)
  },
  methods: {
    oneNewTask(groupId) {
      // console.log('  this.currBoard', this.currBoard)

      this.$store.dispatch({
        type: "saveTask",
        groupId,
        taskTitle: this.taskTitle,
      })
      this.newTaskModal = !this.newTaskModal
      this.taskTitle = ""
    },
    onSaveGroup(groupId) {
      const boardId = this.currBoard._id
      this.$store.dispatch({ type: "saveGroup",group:this.group, boardId })
    },
    onRemoveGroup(groupId) {
      const boardId = this.currBoard._id
      this.$store.dispatch({ type: "removeGroup", groupId, boardId })
    },
    // goToTaskDetails() {
    //   this.$router.push(`/board/${this.currBoard._id}/${this.group.id}`)
    // },
  },
  components: {
    taskList,
  },
}
</script>

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
        <span
          class="group-dots-options"
          @click="groupOptionsModal = !groupOptionsModal"
        ></span>
        <div
          v-if="groupOptionsModal"
          class="group-options-modal flex flex-column"
        >
          <span class="group-options-modal-header">List Actions</span>
          <span
            class="group-options-modal-delete"
            @click="onRemoveGroup(group.id)"
            >Delete Group</span
          >
        </div>
      </div>
      <!-- <div class="group-remove-modal"></div> -->
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
      <div class="new-task-add-remove-conteiner flex">
        <el-button type="primary" @click="oneNewTask(group.id)"
          >Add Card</el-button
        >
        <span
          class="cancel-add-task"
          @click="newTaskModal = !newTaskModal"
        ></span>
      </div>
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
      groupOptionsModal: false,
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
      this.$store.dispatch({
        type: "saveTask",
        groupId,
        taskTitle: this.taskTitle,
        userAction: "Add new card",
      })
      this.newTaskModal = !this.newTaskModal
      this.taskTitle = ""
    },
    onSaveGroup(groupId) {
      const boardId = this.currBoard._id
      this.$store.dispatch({ type: "saveGroup", group: this.group, boardId })
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

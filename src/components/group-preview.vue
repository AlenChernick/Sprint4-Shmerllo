<template>
  <section>
    <div  class="group-header flex">
      <div class="group-subject-header">
        <input type="text" v-model="group.title" @change="onSaveGroup(group.id)" />
      </div>
      <div class="group-dots-options-box">
        <span class="group-dots-options" @click="groupOptionsModal = !groupOptionsModal"></span>
        <div v-if="groupOptionsModal" class="group-options-modal flex flex-column">
          <span class="group-options-modal-header">List Actions</span>
          <span class="group-options-modal-delete" @click="onRemoveGroup(group.id)">Delete Group</span>
        </div>
      </div>
    </div>
    <div>
      <div>
        <task-list @moveTasks="replaceTasks" :tasks="group.tasks" :groupId="group.id" />
      </div>
      <div v-if="!newTaskModal" class="task-adding-conteiner flex" @click="newTaskModal = !newTaskModal">
        <div class="task-adding-btn">
          <div class="trello-plus-btn"></div>
          <font-awesome-icon icon="fa-solid fa-plus" class="trello-plus-btn" />
        </div>
        <div>Add a card</div>
      </div>
      <div class="new-task-container" v-else>
        <textarea class="new-task-area" placeholder="Enter a title for this card..." v-model="taskTitle"></textarea>
        <div class="new-task-add-remove-container flex">
          <el-button class="trello-add-btn confirm-btn" type="primary" @click="oneNewTask(group.id)">Add Card</el-button>
          <span class="cancel-add-task" @click="newTaskModal = !newTaskModal"></span>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import taskList from '../components/task-list.vue'
// import { newTask } from "../../services/eventBus.service.js"
export default {
  name: 'group-preview',
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
      taskTitle: '',
    }
  },
  created() {
    this.currBoard = this.$store.getters.getCurrBoard
    if (this.group.tasks === []) this.newTaskModal = true
  },
  methods: {
    oneNewTask(groupId) {
      if (!this.taskTitle) return
      this.$store.dispatch({
        type: 'saveTask',
        groupId,
        taskTitle: this.taskTitle,
        userAction: 'Add new card',
        boardId: this.currBoard._id,
      })
      this.newTaskModal = !this.newTaskModal
      this.taskTitle = ''
    },
    onSaveGroup() {
      // const boardId = this.currBoard._id
      const boardId = this.currBoard._id

      this.$store.dispatch({ type: 'saveGroup', group: this.group, boardId })
    },
    onRemoveGroup(groupId) {
      const boardId = this.currBoard._id
      this.$store.dispatch({ type: 'removeGroup', groupId, boardId })
    },
    replaceTasks(tasks) {
      let group = JSON.parse(JSON.stringify(this.group))
      // group.tasks = tasks
      this.$emit('updateGroup', { info: { tasks, group } })
    },
  },

  components: {
    taskList,
  },
}
</script>

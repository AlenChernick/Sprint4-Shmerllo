<template>
  <section>
    <div class="group-header flex">
      <div class="group-subject">{{ group.title }}</div>
      <div class="group-dots-options-box">
        <div class="group-dots-options" @click="onRemoveGroup(group.id)">
          <font-awesome-icon icon="fa-solid fa-ellipsis" />
        </div>
      </div>
    </div>
    <task-list :tasks="group.tasks" :groupId="group.id" />
    <div class="task-adding-conteiner flex" @click="oneNewTask(group.id)">
      <div class="task-adding-btn">
        <font-awesome-icon icon="fa-solid fa-plus" />
      </div>
    </div>

    <div>
      <!-- <form>
    <textarea  cols="30" rows="2"  :non-drag-area-selecto="dragHandleSelector"
      class="new-task-area"
      placeholder="Enter a title for this card..."
    ></textarea>
    </form> -->
    </div>
    <div>Add new card</div>
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
      this.$store.dispatch({ type: 'saveTask', groupId })
      //  newTask("newTaskEvent", groupId)
    },
    onRemoveGroup(groupId) {
      const boardId = this.currBoard._id
      this.$store.dispatch({ type: 'removeGroup', groupId, boardId })
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

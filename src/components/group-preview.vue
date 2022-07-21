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
      <div>Add new card</div>
    </div>

    <div>
      <!-- <form>
    <textarea  cols="30" rows="2"  :non-drag-area-selecto="dragHandleSelector"
      class="new-task-area"
      placeholder="Enter a title for this card..."
    ></textarea>
    </form> -->
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
    }
  },
  created() {
    this.currBoard = this.$store.getters.getCurrBoard
  },
  methods: {
    oneNewTask(groupId) {
      console.log("  this.currBoard",   this.currBoard)
      this.$store.dispatch({ type: "saveTask", groupId })
      //  newTask("newTaskEvent", groupId)
    },
    onRemoveGroup(groupId) {
      
      console.log(this.currBoard._id);
      let boardId = this.currBoard._id
      this.$store.dispatch({ type: "removeGroup", groupId,boardId })
      
    },
  },
  components: {
    taskList,
  },
}
</script>

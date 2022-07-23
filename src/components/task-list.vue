<template>
  <!-- <h3 >Group ID:{{groupId}}</h3> -->
  <div class="group-title"></div>
  <Container
    class="tasks-container"
    orientation="vertical"
    v-if="tasks"
    :get-child-payload="getChildPayload"
    group-name="col-items"
    @drop="onDrop($event)"
  >
    <Draggable
      @mousedown.prevent
      class="task-preview"
      v-if="items"
      v-for="item in items"
      :key="item.id"
      
    >
      <task-preview :task="item" :groupId="groupId" />
    </Draggable>
  </Container>
</template>
<script>
import taskPreview from "../components/task-preview.vue"
import { Container, Draggable } from "vue3-smooth-dnd"
import { applyDrag } from "../../services/dnd-service.js"

export default {
  name: "task-list",
  props: {
    groupId: {
      type: String,
    },
    tasks: {
      type: Array,
    },
  },
  data() {
    return {
      items: [],
    }
  },
  created() {
    this.items = JSON.parse(JSON.stringify(this.tasks))
  },
  methods: {
    onDrop(dropRes) {
      if (this.item === this.tasks) return
      this.items = applyDrag(this.items, dropRes)
      this.$store.dispatch({
        type: "saveTasks",
        tasks: this.items,
        groupId: this.groupId,
      })
    },
    getChildPayload(idx) {
      return this.items[idx]
    },

    // onDrop(dropResult) {
    //   console.log(dropResult)
    //   this.tasks = this.applyDrag(this.tasks, dropResult)

    // },
    // applyDrag(arr, dragResult) {
    //   const { removedIndex, addedIndex, payload } = dragResult

    //   if (removedIndex === null && addedIndex === null) return arr
    //   const result = [...arr]
    //   let itemToAdd = payload

    //   if (removedIndex !== null) {
    //     itemToAdd = result.splice(removedIndex, 1)[0]
    //   }
    //   if (addedIndex !== null) {
    //     result.splice(addedIndex, 0, itemToAdd)
    //   }
    //   return result
    // },
  },
  components: {
    taskPreview,
    Container,
    Draggable,
  },
}
</script>

<style>
.red {
  background-color: red;
}
</style>

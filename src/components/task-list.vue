<template>
  <Container @drop="onDrop">
    <Draggable>
      <task-preview v-for="task in tasks" :task="task" :key="task.id" />
    </Draggable>
  </Container>
</template>
<script>
import taskPreview from "../components/task-preview.vue"
import { Container, Draggable } from "vue3-smooth-dnd"

export default {
  name: "task-list",
  props: {
    tasks: {
      type: Array,
    },
  },
  methods: {
    onDrop(dropResult) {
      console.log(dropResult)
      this.tasks = this.applyDrag(this.tasks, dropResult)

    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult

      if (removedIndex === null && addedIndex === null) return arr
      const result = [...arr]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }
      return result
    },
  },
  components: {
    taskPreview,
    Container,
    Draggable,
  },
}
</script>

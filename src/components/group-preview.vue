<template>
  <section class="group-preview">
    <!-- <Container> -->
    <!-- <Draggable class="group-preview" > -->
    <!-- <h2>I am group preview</h2> -->
    <task-list :tasks="group.tasks" />
    <!-- </Draggable> -->
    <!-- </Container> -->
  </section>
</template>
<script>
import taskList from '../components/task-list.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'

export default {
  name: 'group-preview',
  props: {
    group: {
      type: Object,
    },
  },
  methods: {
    onDrop(dropResult) {
      this.items = this.applyDrag(this.items, dropResult)
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
    taskList,
    Container,
    Draggable,
  },
}
</script>

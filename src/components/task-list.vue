<template>
  <!-- <div class="group-title"></div> -->
  <Container
    class="tasks-container"
    orientation="vertical"
    v-if="tasks"
    :get-child-payload="getChildPayload"
    group-name="col-items"
    @drop="onDrop($event)"
  >
    <Draggable class="task-preview" v-if="items" v-for="item in items" :key="item.id">
      <task-preview :task="item" :groupId="groupId" />
    </Draggable>
  </Container>
</template>
<script>
import taskPreview from '../components/task-preview.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/dnd-service.js'

export default {
  name: 'task-list',
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
      this.items = applyDrag(this.items, dropRes)
      this.$emit('moveTasks', this.items)
    },
    getChildPayload(idx) {
      return this.items[idx]
    },
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

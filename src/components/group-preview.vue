<template>
  <section >
    <h2>I am group preview</h2>
    <task-list :tasks="group.tasks" />
  </section>
</template>
<script>
import taskList from '../components/task-list.vue'

export default {
  name: 'group-preview',
  props: {
    group: {
      type: Object,
    },
  },
  components: {
    taskList,
  },
}
</script>

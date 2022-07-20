<template>
  <section class="task-list">
    <task-preview v-for="task in tasks" :task="task" :key="task.id" />
  </section>
</template>
<script>
import taskPreview from '../components/task-preview.vue'
export default {
  name: 'task-list',
  props: {
    tasks: {
      type: Array,
    },
  },
  components: {
    taskPreview,
  },
}
</script>
<style lang=""></style>

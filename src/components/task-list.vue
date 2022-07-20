<template>
  <section class="task-list"></section>
  <task-preview v-for="task in tasks" :task="task" :key="task.id" />
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

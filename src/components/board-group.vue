<template>
  <section class="board-group">
    <h2>I am board group</h2>
    <!-- for in -->
    <task-preview />
  </section>
</template>
<script>
import taskPreview from '../components/task-preview.vue'

export default {
  name: 'board-group',
  components: {
    taskPreview,
  },
}
</script>

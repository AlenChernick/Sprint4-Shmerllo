<template>
  <section class="task-preview">
    <h2>Task: {{task.title}}</h2>
    <!-- <pre>{{ task }}</pre> -->
    <div> Description: {{task.description}}</div>
  </section>
</template>
<script>
export default {
  name: 'task-preview',
  props: {
    task: {
      type: Object,
    },
  },
}
</script>
<style lang=""></style>

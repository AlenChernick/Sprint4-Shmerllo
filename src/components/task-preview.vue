<template>
  <section class="task-preview">
    <h2>this is task preview</h2>
    <pre>{{ task }}</pre>
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

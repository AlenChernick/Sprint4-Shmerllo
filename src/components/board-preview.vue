<template>
  <section class="board-preview">
    <h2>This is board preview</h2>
    <pre>{{ getBoards }}</pre>
    <group-list />
  </section>
</template>
<script>
import groupList from '../components/group-list.vue'

export default {
  name: 'board-preview',
  computed: {
    getBoards() {
      return this.$store.getters.getBoards
    },
  },
  components: {
    groupList,
  },
}
</script>
<style lang=""></style>

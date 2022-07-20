<template lang="">
  <section class="board-app">
    <h2>This is boards</h2>
    <board-list />
  </section>
</template>
<script>
import boardList from '../components/board-list.vue'

export default {
  name: 'board-app',
  components: {
    boardList,
  },
}
</script>

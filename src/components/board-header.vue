<template>
  <section class="board-header">
    <board-menu />
    <board-filter />
    <h2>I am board header</h2>
  </section>
</template>
<script>
import boardMenu from '../components/board-menu.vue'
import boardFilter from '../components/board-filter.vue'

export default {
  name: 'board-header',
  components: {
    boardMenu,
    boardFilter,
  },
}
</script>

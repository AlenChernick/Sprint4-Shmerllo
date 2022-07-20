<template>
  <section class="board-header">
    <h2>I am board header</h2>
    <board-menu />
    <board-filter />
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

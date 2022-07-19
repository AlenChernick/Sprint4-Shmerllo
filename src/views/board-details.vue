<template lang="">
  <section class="board-details">
    <h2>This is the board</h2>
    <board-header />
    //for in
    <board-group />
  </section>
</template>

<script>
import boardHeader from '../components/board-header.vue'
import boardGroup from '../components/board-group.vue'

export default {
  name: 'board-details',
  components: {
    boardHeader,
    boardGroup,
  },
}
</script>
<style lang=""></style>

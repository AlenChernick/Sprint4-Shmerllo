<template>
  <section class="board-list">
    <board-preview v-if="boards" v-for="board in boards" :key="board._id" :board="board" />
  </section>
</template>
<script>
import boardPreview from '../components/board-preview.vue'

export default {
  name: 'board-list',
  props: {
    boards: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  components: {
    boardPreview,
  },
}
</script>
<style lang=""></style>

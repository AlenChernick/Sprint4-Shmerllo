<template>
  <section class="board-list"></section>
  <board-preview />
</template>
<script>
import boardPreview from '../components/board-preview.vue'

export default {
  name: 'board-list',
  data() {
    return {}
  },
  components: {
    boardPreview,
  },
}
</script>
<style lang=""></style>

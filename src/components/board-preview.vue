<template>
  <section @click="goToBoardDetails" class="board-preview">
    <h2>{{ board.title }}</h2>
  </section>
</template>

<script>
export default {
  props: {
    board: {
      type: Object,
    },
  },
  name: 'board-preview',
  methods: {
    goToBoardDetails() {
      this.$router.push(`/board/${this.board._id}`)
    },
  },
  components: {},
}
</script>
<style lang=""></style>

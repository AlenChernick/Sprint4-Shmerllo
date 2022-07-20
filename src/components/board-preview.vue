<template>
  <section class="board-preview">
    <h2>{{ board.title }}</h2>
    <router-link :to="'/board/' + board._id">Board Details</router-link>
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
  components: {},
}
</script>
<style lang=""></style>

<template>
  <section class="board-preview">
    <h2>This is board preview</h2>
    <pre>{{ board.title }}</pre>
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

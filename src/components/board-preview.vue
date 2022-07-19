<template>
  <section class="board-preview">
    <h2>This is board preview</h2>
    <pre>{{getBoards}}</pre>
  </section>
</template>
<script>
export default {
  name: 'board-preview',
  computed:{
    getBoards(){
    return  this.$store.getters.getBoards
    }
  }
}
</script>
<style lang=""></style>

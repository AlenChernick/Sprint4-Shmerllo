<template>
  <section @click="goToBoardDetails" class="board-preview">
    <h2>{{ board.title }}</h2>
    <img :src=imgUrl alt="">
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
    data(){
      return{
      imgUrl:null,
    }},
    created() {
      this.imgUrl = this.board.backgroundImage
    },
  methods: {
    goToBoardDetails() {
      this.$router.push(`/board/${this.board._id}`)
    },
  },
  components: {},
}
</script>
<style lang=""></style>

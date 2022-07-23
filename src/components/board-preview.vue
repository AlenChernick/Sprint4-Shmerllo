<template>
  <section @click="goToBoardDetails" class="board-preview"
       v-if="board"
    :style= "bgStyle">
    <h2>{{ board.title }}</h2>
       <span @click.stop="toggeleIsFavorite" :class="isFavoriteIcon"></span>
     
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
     toggeleIsFavorite(){
      this.board.isFavorite = !this.board.isFavorite
      console.log(this.board.isFavorite)
      this.$store.dispatch({type: "saveBoard",board: this.board })
    }
  },
   computed: {
    bgStyle(){
      if (this.board.style.bgImgUrl) return {'background-image': `url(${this.board.style.bgImgUrl})` }
      if (this.board.style.bgColor) return { 'background-color': this.board.style.bgColor}
    },
    isFavoriteIcon(){
      if (this.board.isFavorite) return 'full-star-icon' 
      else return 'non-star-icon'
    }
}
}
</script>
<style lang=""></style>

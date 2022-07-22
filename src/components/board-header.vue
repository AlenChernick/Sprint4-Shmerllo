<template>
  <section class="board-header">
    <!-- <pre>{{currBoard}}</pre> -->

    <div class="board-info">
      <input spellcheck="false" v-model="board.title" type="text" @input="updateTitle"/>
      <span @click="toggeleIsFavorite" class="star-icon"></span>
      <!-- <pre >{{isFavorite}}</pre>  -->
      <h5> {{board.byMember.fullname}}'s workspace</h5> 
      <ul class="members clean-list" v-for="member in board.members">
        <img :src="member.imgUrl"/>
      </ul>

    </div>
   
    <div class="board-header-buttons">
      <board-filter />
      <board-menu :activities="board.activities"/>
    </div>
  </section>
</template>
<script>
import boardMenu from '../components/board-menu.vue'
import boardFilter from '../components/board-filter.vue'

export default {
  name: 'board-header',
   props: {
    board: {
      type: Object,
    },
    data() {
    return {
      currBoard: {},
    }
  },
  created(){
    this.currBoard = this.$store.getters.getCurrBoard
  },
   methods: {
    updateTitle() {
      console.log(this.board)
      this.$emit('updateBoard', JSON.parse(JSON.stringify(this.board)))
    },
    toggeleIsFavorite(){
      console.log('hi')
      // this.board.isFavorite = !this.board.isFavorite
      // this.$emit('updateBoard', JSON.parse(JSON.stringify(this.board)))
    }
  },

  },
  components: {
    boardMenu,
    boardFilter,
  },
}
</script>
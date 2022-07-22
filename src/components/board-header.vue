<template>
  <section class="board-header">
    <div class="board-info">
      <input @input="saveBoard" spellcheck="false" v-model="board.title" type="text" />
      <span @click="toggeleIsFavorite" :class="icon" ></span>
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
   },
    data() {
    return {
      currBoard: {},
    }
  },
   methods: {
    saveBoard() {
      console.log('im on', this.board.title)
      this.$store.dispatch({type: "saveBoard",board: this.board })
  },
    toggeleIsFavorite(){
      this.board.isFavorite = !this.board.isFavorite
      console.log(this.board.isFavorite)
      this.$store.dispatch({type: "saveBoard",board: this.board })
    }
  },
  computed: {
    icon(){
      let board = this.$store.getters.getCurrBoard
      if (board.isFavorite) return 'full-star-icon' 
      else return 'star-icon'
    }


  },
  components: {
    boardMenu,
    boardFilter,
  },

}

</script>
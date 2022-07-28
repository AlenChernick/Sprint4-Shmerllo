<template>
  <section v-if="board._id" class="board-header">
    <div class="board-info">
      <select class="board-type-select">
        <option value="board">Board</option>
      </select>
      <input @input="saveBoard" spellcheck="false" v-model="board.title" type="text" />
      <span @click="toggeleIsFavorite" :class="icon"></span>
      <h5>{{ board.byMember?.fullname }}'s workspace</h5>
      <ul class="members clean-list" v-for="member in board.members">
        <img :src="member.imgUrl" />
      </ul>
    </div>

    <div class="board-header-buttons">
      <!-- <board-filter /> -->
      <board-menu v-if="board" :key="board._id" />
    </div>
  </section>
</template>
<script>
import boardMenu from '../components/board-menu.vue'
import boardFilter from '../components/board-filter.vue'
import { utilService } from '../../services/util-service.js'

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
      txtColor: '',
    }
  },
  created() {
    this.saveBoard = utilService.debounce(this.saveBoard, 1000)
  },
  methods: {
    saveBoard() {
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    toggeleIsFavorite() {
      this.board.isFavorite = !this.board.isFavorite
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
  },
  computed: {
    icon() {
      let board = this.$store.getters.getCurrBoard
      if (board?.isFavorite) return 'full-star-icon'
      else return 'star-icon'
    },
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
  },
  components: {
    boardMenu,
    boardFilter,
  },
}
</script>

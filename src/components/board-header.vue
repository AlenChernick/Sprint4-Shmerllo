<template>
  <section v-if="board._id" class="board-header">
    <div class="board-info">
      <select :style="{ color: getTxtColor, getAvgColor, transition: 'color 0.4s' }" class="board-type-select">
        <option value="board">Board</option>
      </select>
      <input
        :style="{ color: getTxtColor, getAvgColor, transition: 'color 0.4s' }"
        @input="saveBoard"
        spellcheck="false"
        v-model="board.title"
        type="text"
      />
      <span @click="toggeleIsFavorite" :class="icon"></span>
      <h5 :style="{ color: getTxtColor, getAvgColor, transition: 'color 0.4s' }">{{ board.byMember?.fullname }}'s workspace</h5>
      <ul class="members clean-list" v-for="member in board.members">
        <img :src="member.imgUrl" />
      </ul>
    </div>

    <div class="board-header-buttons">
      <!-- <board-filter /> -->
      <button
        :style="{ color: getTxtColor, getAvgColor, transition: 'color 0.4s' }"
        class="board-header-btn"
        @click="openDashboard"
      >
        Dashboard
      </button>
      <board-menu v-if="board" :key="board._id" />
    </div>
  </section>
</template>

<script>
import boardMenu from '../components/board-menu.vue'
import boardFilter from '../components/board-filter.vue'
import { utilService } from '../../services/util-service.js'
import { FastAverageColor } from 'fast-average-color'

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
    openDashboard() {
      this.$router.push(`/board/${this.board._id}/dashboard`)
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
    async getAvgColor() {
      try {
        const imgUrl = await this.getCurrBoard.style.bgImgUrl
        const fac = new FastAverageColor()
        const color = await fac.getColorAsync(imgUrl)
        if (color.isLight) this.txtColor = '#000000'
        else this.txtColor = '#fff'
      } catch (err) {
        console.log('Cannot load avg color', err)
        throw err
      }
    },
    getTxtColor() {
      return this.txtColor
    },
  },
  components: {
    boardMenu,
    boardFilter,
  },
}
</script>

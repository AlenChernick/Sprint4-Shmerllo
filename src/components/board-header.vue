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

      <Container
        @drop="onDrop($event)"
        :get-child-payload="getChildPayload"
        orientation="horizontal"
        group-name="members"
        class="flex"
      >
        <Draggable v-for="member in board.members" :key="member._id">
          <ul class="members clean-list">
            <img :src="member.imgUrl" />
          </ul>
        </Draggable>
      </Container>

      <!-- <search-add-board-member></search-add-board-member> -->
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
import { Container, Draggable } from 'vue3-smooth-dnd'
// import { applyDrag } from "../../services/dnd-service.js"
import boardMenu from '../components/board-menu.vue'
import boardFilter from '../components/board-filter.vue'
// import searchAddBoardMember from "../components/search-add-board-member.vue"
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
    onDrop(dropRes) {
      // Here for DND Libery - Do not delete!!!!
      // let test = applyDrag(this.board.members, dropRes)
    },
    getChildPayload(idx) {
      // Here for DND Libery - Do not delete!!!!
      return this.board.members[idx]
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
    Container,
    Draggable,
  },
}
</script>

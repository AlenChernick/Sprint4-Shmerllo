<template>
    <!-- v-if="getCurrBoard" -->
  <header
    class="app-header main-header full"
    :style="{ 'background-color': getHeaderColor, getAvgColor, transition: 'background-color 0.4s ' }"
  >
    <!-- <div :style="{ 'background-color': getAvgColor }">hey</div> -->
    <!-- {{ getCurrBoard.style.bgImgUrl }} -->
    <!-- <router-link class="home-page-btn" to="/"><img src="../assets/img/logo.png" alt="logo" /></router-link> -->
    <div class="home-page-btn" @click="goToHomePage">
      <span><font-awesome-icon class="board-icon" icon="fab fa-trello" /></span> Shmerllo
    </div>
    <div class="boards-page-btn" @click="goToBoardsPage">Boards</div>
    <div class="active-user-conteiner">
      <div class="active-user" @click="isUserModalOpen = !isUserModalOpen">{{ getActiveUser }}</div>
      <user-options v-if="isUserModalOpen" @closeModal="closeModal" :user="user"></user-options>
    </div>
  </header>
</template>
<script>
import userOptions from '../components/user-options.vue'
import { FastAverageColor } from 'fast-average-color'
export default {
  name: 'app-header',
  data() {
    return {
      isUserModalOpen: false,
      user: null,
      headerColor: '#026aa7',
    }
  },
  methods: {
    closeModal() {
      this.isUserModalOpen = false
    },
    goToHomePage() {
      this.$router.push('/')
      this.headerColor = '#026aa7'
      this.opcity = '1'
    },
    goToBoardsPage() {
      this.$router.push('/board')
      this.headerColor = '#026aa7'
      this.opcity = '1'
    },
  },
  computed: {
    getActiveUser() {
      let user = this.$store.getters.loggedInUser
      if (!user) return 'G'
      this.user = user
      return user.username.charAt(0)
    },
    getCurrBoard() {
      console.log('from app header', this.$store.getters.getCurrBoard)
      return this.$store.getters.getCurrBoard
    },
    getAvgColor() {
      if (!this.getCurrBoard.style || !this.getCurrBoard.style.bgImgUrl) return
      const imgUrl = this.getCurrBoard.style.bgImgUrl
      const fac = new FastAverageColor()
      fac
        .getColorAsync(imgUrl)
        .then((color) => {
          this.headerColor = color.hexa
        })
        .catch((e) => {
          this.headerColor = '#026aa7'
          console.log(e)
          // throw err
        })
    },
    getHeaderColor() {
      return this.headerColor
    },
  },
  components: {
    userOptions,
  },
}
</script>

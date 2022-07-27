<template>
  <header
    v-if="getCurrBoard"
    class="app-header main-header full"
    :style="{ 'background-color': getHeaderColor, getAvgColor }"
  >
    <!-- <div :style="{ 'background-color': getAvgColor }">hey</div> -->
    <!-- {{ getCurrBoard.style.bgImgUrl }} -->
    <!-- <router-link class="home-page-btn" to="/"><img src="../assets/img/logo.png" alt="logo" /></router-link> -->
    <router-link class="home-page-btn" to="/"
      ><span><font-awesome-icon class="board-icon" icon="fab fa-trello" /></span> Shmerllo</router-link
    >
    <router-link class="boards-page-btn" to="/board"> Boards </router-link>
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
      headerColor: '',
    }
  },
  methods: {
    closeModal() {
      this.isUserModalOpen = false
    },
  },
  computed: {
    getActiveUser() {
      let user = this.$store.getters.loggedInUser
      if(!user) return 'G'
      this.user= user
      return user.username.charAt(0)
    },
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
    getAvgColor() {
      if (!this.getCurrBoard.style || !this.getCurrBoard.style.bgImgUrl) return
      const imgUrl = this.getCurrBoard.style.bgImgUrl
      console.log('imgUrl', imgUrl)
      const fac = new FastAverageColor()
      fac
        .getColorAsync(imgUrl)
        .then((color) => {
          this.headerColor = color.rgba
        })
        .catch((e) => {
          console.log(e)
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

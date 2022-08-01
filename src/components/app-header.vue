<template>
  <header
    class="app-header main-header full"
    :style="{ 'background-color': getHeaderColor, getAvgColor, transition: 'background-color 0.4s ' }"
  >
    <div class="main-header-left flex">
      <div class="home-page-btn" @click="goToHomePage">
        <span><font-awesome-icon class="board-icon" icon="fab fa-trello" /></span> Shmerllo
      </div>
      <div class="boards-page-btn" @click="goToBoardsPage"><span>Boards</span></div>
      <work-space-drop-down class="work-space-btn"> </work-space-drop-down>
    </div>
    <notifications />
    <div class="active-user-conteiner">
      <img :src="getActiveUser" class="active-user" @click="isUserModalOpen = !isUserModalOpen" />
      <user-options v-if="isUserModalOpen" @closeModal="closeModal" :user="user"></user-options>
    </div>
  </header>
</template>
<script>
import userOptions from '../components/user-options.vue'
import notifications from '../components/notifications.vue'
import workSpaceDropDown from '../components/work-space-drop-down.vue'
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
    goToHomePage() {
      this.$router.push('/')
      this.headerColor = '#026aa7'
    },
    goToBoardsPage() {
      this.$router.push('/board')
      this.headerColor = '#026aa7'
    },
  },
  computed: {
    getActiveUser() {
      let user = this.$store.getters.loggedInUser
      if (!user) return 'G'
      if (!user.imgUrl) return user.username.charAt(0)
      this.user = user
      return user.imgUrl
    },
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
    getCurrGroup() {
      return this.$store.getters.getCurrGroup
    },
    async getAvgColor() {
      try {
        if (this.getCurrBoard.style?.bgImgUrl === undefined ) return
        if (this.getCurrBoard === undefined && this.getCurrGroup === undefined) {
          this.headerColor = '#026aa7'
          return
        }
        const imgUrl = this.getCurrBoard.style.bgImgUrl
        const fac = new FastAverageColor()
        const color = await fac.getColorAsync(imgUrl)
        this.headerColor = color.hexa
      } catch (err) {
        console.log('Cannot load avg color', err)
        throw err
      }
    },
    getHeaderColor() {
      return this.headerColor
    },
  },
  components: {
    userOptions,
    notifications,
    workSpaceDropDown,
  },
}
</script>

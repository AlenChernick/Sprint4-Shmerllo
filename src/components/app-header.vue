<template>
  <header class="app-header main-header full">
    <!-- <router-link class="home-page-btn" to="/"><img src="../assets/img/logo.png" alt="logo" /></router-link> -->
    <router-link class="home-page-btn" to="/"
      ><span><font-awesome-icon class="board-icon" icon="fab fa-trello" /></span> Shmerllo</router-link
    >
    <router-link class="boards-page-btn" to="/board"> Boards </router-link>
    <div class="active-user-conteiner">
    <div class="active-user" @click="isUserModalOpen=!isUserModalOpen">{{getActiveUser}}</div>
    <user-options v-if="isUserModalOpen" @closeModal="closeModal" :user="user"></user-options>
  </div>
  </header>
</template>
<script>
import userOptions from '../components/user-options.vue'
export default {
  name: 'app-header',
  data() {
    return {
      isUserModalOpen:false,
      user:null,
    }
  },
  methods: {
    closeModal(){
      this.isUserModalOpen = false
    }
  },
  computed:{
    getActiveUser(){
      let user = this.$store.getters.loggedInUser
      console.log(user);
      if(!user) return 'G'
      this.user= user
      return user.username.charAt(0)
    }
  },
    components: {
    userOptions
  },

}
</script>

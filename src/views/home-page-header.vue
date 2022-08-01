<template lang="">
  <header class="home-page-header">
    <router-link class="home-page-home-btn" to="/"
      ><span><img src="../assets/img/trello.png" alt="" /></span> Shmerllo</router-link
    >
    <div class="home-page-user-btns">
      <router-link v-if="loggedInUser.username === 'Guest'" class="login-page-btn" to="/login">Log in</router-link>
      <router-link v-if="loggedInUser.username !== 'Guest'" class="login-page-btn" to="/login" @click="onLogout"
        >Logout</router-link
      >
      <router-link class="signup-page-btn" to="/board">Start Shmerllo</router-link>
    </div>
  </header>
</template>
<script>
export default {
  name: 'home-page-header',
  methods: {
    async onLogout() {
      await this.$store.dispatch({ type: 'logout' })
    },
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
  },
}
</script>

<template>
  <header class="app-header main-header full">
    <router-link class="home-page-btn" to="/"><img src="../assets/img/logo.png" alt="" /></router-link>
    <router-link class="boards-page-btn" to="/board"
      ><font-awesome-icon class="board-icon" icon="fab fa-trello" />Boards</router-link
    >
    <router-link class="login-page-btn" to="/login">Login</router-link>
  </header>
</template>
<script>
export default {
  name: 'app-header',
}
</script>
<style lang=""></style>

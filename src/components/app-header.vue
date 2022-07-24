<template>
  <header class="app-header main-header full">
    <!-- <router-link class="home-page-btn" to="/"><img src="../assets/img/logo.png" alt="logo" /></router-link> -->
    <router-link class="home-page-btn" to="/"
      ><span><font-awesome-icon class="board-icon" icon="fab fa-trello" /></span> Shmerllo</router-link
    >
    <router-link class="boards-page-btn" to="/board"> Boards </router-link>
  </header>
</template>
<script>
export default {
  name: 'app-header',
}
</script>

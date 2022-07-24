<template lang="">
  <header class="home-page-header">
    <router-link class="home-page-home-btn" to="/"
      ><span><img src="../assets/img/trello.png" alt="" /></span> Shmerllo</router-link
    >
    <div class="home-page-user-btns">
      <router-link class="login-page-btn" to="/login">Log in</router-link>
      <router-link class="signup-page-btn" to="/board">Start Shmerllo for free</router-link>
    </div>
  </header>
</template>
<script>
export default {
  name: 'home-page-header',
}
</script>

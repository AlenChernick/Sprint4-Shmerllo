<template>
  <div class="login-conteiner">
    <div class="login-header">Shmerllo</div>
    <div class="form-container">
      <form @submit.prevent="onLogin">
        <div class="login-container">
          <div class="login-form-header">Log in to Shmerllo</div>
          <input
            class="user-input first-input"
            type="text"
            placeholder=" Enter Username"
            name="curr-username"
            v-model="user.username"
            required
          />
          <input
            class="user-input"
            type="curr-password"
            placeholder=" Enter Password"
            name="curr-password"
            v-model="user.password"
            required
          />
          <button type="submit" class="login-btn">Login</button>
        </div>
      </form>
    </div>
    <img class="login-img-right" src="../assets/img/loging_pic_left.PNG" alt="" />
    <img class="login-img-left" src="../assets/img/loging_pic_right.PNG" alt="" />
  </div>
</template>
<script>
import { userService } from '../../services/user-service.js'
export default {
  data() {
    return {
      user: {
        username: null,
        password: null,
      },
    }
  },
  created() {
    const user = userService.getLoggedInUser()
    if (user) {
      this.$store.commit({ type: 'setUser', user })
      this.$router.push('/board')
    }
  },
  methods: {
    async onLogin() {
      try {
        await this.$store.dispatch({ type: 'loginUser', user: this.user })
        this.$router.push('/board')
      } catch (err) {
        console.log('cannot get user', err)
      }
    },
  },
}
</script>

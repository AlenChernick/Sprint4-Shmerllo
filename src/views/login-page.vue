<template>
  <div>
    <div class="form-container flex">
      <form @submit.prevent="onLogin">
        <div class="login-container flex flex-column">
          <label>Username : </label>
          <input
          class="user-input"
            type="text"
            placeholder="Enter Username"
            name="curr-username"
            v-model="user.username"
            required
          />
          <label class="user-input">Password : </label>
          <input
            type="curr-password"
            placeholder="Enter Password"
            name="curr-password"
            v-model="user.password"
            required
          />
          <button type="submit" class="btn btn-danger-text">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { userService } from "../../services/user-service.js"
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
      this.$store.commit({ type: "setUser", user })
      this.$router.push("/board")
    }
  },
  methods: {
    async onLogin() {
      try {
        await this.$store.dispatch({ type: "loginUser", user: this.user })
        this.$router.push("/board")
      } catch (err) {
        console.log("cannot get user", err)
      }
    },
  },
}
</script>

<template>
  <div class="user-options-modal flex flex-column">
    <div class="option account flex flex-column">
      <div>Account</div>
      <div v-if="user">{{ user.fullname }}@gmail.com</div>
    </div>
    <div class="close-user-option" @click="onClose()">Close</div>
    <div class="option" @click="onLogout()">Log out</div>
  </div>
</template>
<script>
export default {
  name: "user-options-modal",
  props: {
    user: {
      type: Object,
    },
  },
    methods:{
     async onLogout() {
        await this.$store.dispatch({ type: "logout" })
        this.$emit("closeModal")
        this.$router.push("/")
      },
      onClose(){
                this.$emit("closeModal")
      }
    },
  }

</script>

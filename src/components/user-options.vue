<template>
  <div class="user-options-modal flex flex-column">
    <div class="user-option-modal-option  flex flex-column">
      <div class="user-option-modal-header ">
      <div class="user-option-modal-account">Account</div>
      <div class="user-option-modal-close-modal" @click="onClose()"></div>
      </div>
    </div>
      <div class="user-option-modal-gmail" v-if="user">{{ getUserMail }}</div>
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
    computed:{
      getUserMail(){
        let userName=this.user.fullname
        userName = userName.replace(' ','')
        return `${userName}@gmail.com`
      }
    }
  }

</script>

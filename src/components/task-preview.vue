<template>
  <section @click="openTaskDetails">

    <div>{{ task.title }}</div>
    <div v-if="task.style?.bgImgUrl"><img :src ="task.style.bgImgUrl" alt=""></div>
 
  </section>
</template>
<script>
export default {
  name: "task-preview",
  props: {
    task: {
      type: Object,
    },
    groupId: {
      type: String,
    },
  },
  methods: {
    openTaskDetails() {
      console.log(
        `/board/${this.getCurrBoard._id}/${this.groupId}/${this.task.id}`
      )
      this.$router.push(
        `/board/${this.getCurrBoard._id}/${this.groupId}/${this.task.id}`
      )
      // this.$router.push('')
    },
  },
  computed: {
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
  },
}
</script>
<style lang=""></style>

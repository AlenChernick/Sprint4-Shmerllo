<template lang="">
  <section class="label-picker">
    <ul v-for="label in getCurrTask.labelIds">
      Labels
      <li>
        <p>{{ label }}</p>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  name: 'label-picker',
  computed: {
    getCurrTask() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrTask))
    },
  },
}
</script>
<style lang=""></style>

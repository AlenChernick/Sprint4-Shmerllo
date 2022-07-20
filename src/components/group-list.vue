<template lang="">
  <section class="group-list">
    <h2>this is group list</h2>
    <group-preview />
  </section>
</template>
<script>
import groupPreview from '../components/group-preview.vue'

export default {
  name: 'group-list',
  components: {
    groupPreview,
  },
}
</script>
<style lang=""></style>

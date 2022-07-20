<template lang="">
  <section class="group-list">
    <h2>this is group list</h2>
    <group-preview v-for="group in groups" :group="group" :key="group.id" />
  </section>
</template>
<script>
import groupPreview from '../components/group-preview.vue'

export default {
  name: 'group-list',
  props: {
    groups: {
      type: Array,
    },
  },
  components: {
    groupPreview,
  },
}
</script>

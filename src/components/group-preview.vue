<template>
  <section >
    <!-- <h2>I am group preview</h2> -->
    <div class="group-header flex">
      <div class="group-subject">{{group.title}}</div>
      <div class="group-dots-options"><font-awesome-icon icon="fa-solid fa-ellipsis" /></div>
    </div>
    <task-list :tasks="group.tasks" :groupId="group.id" />
  </section>
</template>
<script>
import taskList from '../components/task-list.vue'

export default {
  name: 'group-preview',
  props: {
    group: {
      type: Object,
    },
  },
  components: {
    taskList,
  },
}
</script>

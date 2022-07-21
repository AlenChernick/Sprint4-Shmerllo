<template>
  <section>
    <div class="group-header flex">
      <div class="group-subject">{{ group.title }}</div>
      <div class="group-dots-options-box">
      <div class="group-dots-options">
        <font-awesome-icon icon="fa-solid fa-ellipsis" />
      </div>
      </div>
    </div>
    <task-list :tasks="group.tasks" :groupId="group.id" />
    <div class="task-adding-conteiner flex">
      <div class="task-adding-btn">
        <font-awesome-icon icon="fa-solid fa-plus" />
      </div>
      <div>Add new card</div>
    </div>
  </section>
</template>
<script>
import taskList from "../components/task-list.vue"

export default {
  name: "group-preview",
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

<template>
  <section v-if="task" class="task-edit">
    <div v-if="task.style" class="task-edit-cover" :style="{ 'background-color': task.style.bgColor }">
      <img :src="task.style.coverImgUrl" />
    </div>
    <div class="task-edit-header">
      <span><font-awesome-icon icon="fa-solid fa-pager" /></span>
      <input v-model="task.title" type="text" />
    </div>
    <div class="task-list-name">
      <p>in List... to add when nestedroute</p>
    </div>
    <div class="main-task-editor-container">
      <!-- <h3>CreatedBy: {{task.byMember.fullname}}</h3> -->
      <!-- <img src="task.byMember.imgUrl"/> -->
      <div class="main-task-edit-container">
        <div class="main-editor">
          <ul class="main-task-members" v-for="member in task.memberIds">
            Members
            <li>
              <p>{{ member }}</p>
            </li>
          </ul>
          <ul v-for="label in task.labelIds">
            Labels
            <li>
              <p>{{ label }}</p>
            </li>
          </ul>
          <div class="main-editor-dates">
            <h4>Dates:</h4>
            <p>CreatedAt: {{ new Date(task.createdAt).toString() }}</p>
            <p>DueDate: {{ new Date(task.dueDate).toString() }}</p>
          </div>
        </div>
        <div class="main-editor-description">
          <span><font-awesome-icon icon="fa-solid fa-bars" /></span>
          <h4 class="main-editor-description-title">Description</h4>
        </div>
        <textarea @click="onEdit" v-model="task.description" class="main-editor-description-info">{{
          task.description
        }}</textarea>
        <div class="main-editor-btn-container">
          <el-button class="btn" type="primary" v-if="isEdit === true" @click="saveTask">Save</el-button>
          <el-button type="info" v-if="isEdit === true" @click="isEdit = false">Cancel</el-button>
        </div>
        <h4>Status: {{ task.status }}</h4>
        <ul v-for="comment in task.comments">
          Activity
          <li>
            <p>{{ comment.byMember.fullName }}</p>
            <p>{{ comment.txt }}</p>
            <p>{{ new Date(comment.createdAt).toString() }}</p>
            <!-- <img :src="comment.byMember.imgUrl"/> -->
          </li>
        </ul>
        <div v-for="checklist in task.checklists">
          checkLists:
          <h4>{{ checklist.title }}</h4>
          <ul v-for="todo in checklist.todos">
            Activity
            <li>
              <p>{{ todo.title }}</p>
              <p>{{ todo.isDone }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="main-task-sidebar">
        <button @click="saveTask">SaveTask</button>
        <button @click="removeTask">RemoveTask</button>
      </div>
    </div>
    <!-- <pre>{{task}}</pre> -->
  </section>
</template>
<script>
export default {
  name: 'task-edit',
  data() {
    return {
      task: {},
      boardId: null,
      groupId: null,
      isEdit: false,
    }
  },
  async created() {
    try {
      const { boardId, groupId, taskId } = this.$route.params
      this.boardId = boardId
      this.groupId = groupId
      const task = await this.$store.dispatch({ type: 'getTaskById', boardId, groupId, taskId })
      this.task = task
    } catch (err) {
      console.log('Cannot load task', err)
      throw err
    }
  },
  methods: {
    saveTask() {
      this.$store.dispatch({ type: 'saveTask', task: this.task, groupId: this.groupId, boardId: this.boardId })
      this.isEdit = false
    },
    removeTask() {
      console.log(this.task.id)
      this.$store.dispatch({ type: 'removeTask', taskId: this.task.id, groupId: this.groupId, boardId: this.boardId })
      this.$router.push('/board' + boardId)
    },
    onEdit() {
      this.isEdit = true
    },
    notEdit() {
      this.isEdit = false
    },
  },
}
</script>
<style></style>

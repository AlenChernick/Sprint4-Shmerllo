<template>
  <section class="task-edit">
    <div v-if="getCurrTask.style" class="task-edit-cover" :style="{ 'background-color': getCurrTask.style.bgColor }">
      <img :src="getCurrTask.style.coverImgUrl" />
    </div>
    <div class="task-edit-header">
      <span class="task-edit-header-icon"></span>
      <input @input="saveTask" spellcheck="false" v-model="getCurrTask.title" type="text" />
      <button @click="backToBoard">X</button>
    </div>
    <div class="task-list-name">
      <p>in List... to add when nestedroute</p>
    </div>
    <div class="main-task-editor-container">
      <!-- <h3>CreatedBy: {{task.byMember.fullname}}</h3> -->
      <!-- <img src="task.byMember.imgUrl"/> -->
      <div class="main-task-edit-container">
        <div class="main-editor">
          <ul class="main-task-members" v-for="member in getCurrTask.memberIds">
            Members
            <li>
              <p>{{ member }}</p>
            </li>
          </ul>
          <ul v-for="label in getCurrTask.labelIds">
            Labels
            <li>
              <p>{{ label }}</p>
            </li>
          </ul>
          <div class="main-editor-dates">
            Dates
            <div class="main-editor-dates-picker">
              <el-checkbox class="main-editor-checkbox"></el-checkbox>
              <el-date-picker type="dates" v-model="dateValue"></el-date-picker>
            </div>
          </div>
        </div>
        <div class="main-editor-description">
          <span class="main-editor-description-icon"></span>
          <h4 class="main-editor-description-title">Description</h4>
          <el-button v-if="!isEdit" class="btn main-editor-decription-edit-btn" type="info">Edit</el-button>
        </div>
        <textarea
          spellcheck="false"
          @click="onEdit"
          v-model="getCurrTask.description"
          class="main-editor-description-info"
          >{{ getCurrTask.description }}
        </textarea>
        <div class="main-editor-btn-container">
          <el-button type="primary" v-if="isEdit" @click="saveTask">Save</el-button>
          <el-button type="info" v-if="isEdit" @change="saveTask" @click="isEdit = false">Cancel</el-button>
        </div>
        <div class="main-editor-checklist-container" v-for="checklist in getCurrTask.checklists">
          <div class="main-editor-checklist-header">
            <div class="main-editor-checklist-header-info">
              <span class="main-editor-checklist-icon"></span>
              <h4 class="main-editor-checklist-title">{{ checklist.title }}</h4>
            </div>
            <el-button type="info" class="btn main-editor-checklist-delete-btn">Delete</el-button>
          </div>
          <ul v-for="todo in checklist.todos">
            <li>
              <el-checkbox @change="saveTask(todo)">{{ todo.title }}</el-checkbox>
              <pre>{{ todo }}</pre>
            </li>
          </ul>

          <el-button type="info" class="btn main-editor-add-item-btn">Add an item</el-button>
        </div>
        <div class="main-editor-activity-contianer">
          <div class="main-editor-activity-header">
            <div class="main-editor-activity-header-info">
              <span class="main-editor-activity-icon"></span>
              <h4 class="main-editor-activity-title">Activity</h4>
            </div>
            <el-button class="btn" type="info">Show details</el-button>
          </div>
          <div class="main-editor-activity-comments">
            <span class="main-editor-activity-icon"><font-awesome-icon icon="fa-solid fa-user" /></span>
            <textarea
              @click="onWriteComment"
              placeholder="Write a comment"
              spellcheck="false"
              class="main-editor-activity-comment"
            >
            </textarea>
          </div>
        </div>
        <!-- <ul v-for="comment in task.comments">
          Activity
          <li>
            <p>{{ comment.byMember.fullName }}</p>
            <p>{{ comment.txt }}</p>
            <p>{{ new Date(comment.createdAt).toString() }}</p>
            <img :src="comment.byMember.imgUrl" />
          </li>
        </ul> -->
      </div>
      <div class="main-task-sidebar">
        <h6>Add to card</h6>
        <div class="main-task-edit-btn"><h5>Members</h5></div>
        <div class="main-task-edit-btn"><h5>Labels</h5></div>
        <div class="main-task-edit-btn"><h5>Checklist</h5></div>
        <div class="main-task-edit-btn"><h5>Dates</h5></div>
        <div class="main-task-edit-btn"><h5>Attachment</h5></div>
      </div>
    </div>
    <!-- <pre>{{task}}</pre> -->
  </section>
</template>
<script>
import { ref } from 'vue'

export default {
  name: 'task-edit',
  data() {
    return {
      boardId: null,
      groupId: null,
      isEdit: false,
      isWrite: false,
      dateValue: ref(''),
    }
  },
  async created() {
    try {
      const { boardId, groupId, taskId } = this.$route.params
      this.boardId = boardId
      this.groupId = groupId
      await this.$store.dispatch({
        type: 'getTaskById',
        boardId,
        groupId,
        taskId,
      })
    } catch (err) {
      console.log('Cannot load task', err)
      throw err
    }
  },
  methods: {
    saveTask(todo) {
      this.$store.dispatch({
        type: 'saveTask',
        task: this.getCurrTask,
        groupId: this.groupId,
        boardId: this.boardId,
      })
      todo.isDone = !todo.isDone
      // this.isEdit = false
    },
    removeTask() {
      this.$store.dispatch({
        type: 'removeTask',
        taskId: this.getCurrTask.id,
        groupId: this.groupId,
        boardId: this.boardId,
      })
      this.$router.push('/board' + boardId)
    },
    onWriteComment() {
      this.isWrite = !this.isWrite
    },
    onEdit() {
      this.isEdit = true
    },
    backToBoard() {
      this.$router.push(`/board/${this.boardId}`)
    },
  },
  computed: {
    getCurrTask() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrTask))
    },
  },
}
</script>
<style></style>

<template>
  <section class="task-edit">
    <div
      v-if="getCurrTask.style.bgImgUrl"
      class="task-edit-cover"
      :style="{ 'background-color': getCurrTask.style.bgColor }"
    >
      <img :src="getCurrTask.style.bgImgUrl" />
      <div v-if="getCurrTask" class="close-task-edit" @click="backToBoard">
        <span class="close-task-edit-icon"></span>
      </div>
    </div>
    <div v-else class="close-task-edit-no-img" @click="backToBoard">
      <span class="close-task-edit-no-img-icon"></span>
    </div>
    <div class="task-edit-header">
      <span class="task-edit-header-icon"></span>
      <input @input="saveTask" spellcheck="false" v-model="getCurrTask.title" type="text" />
    </div>
    <div class="task-list-name">
      <p>in List... to add when nestedroute</p>
    </div>
    <div class="main-task-editor-container">
      <div class="main-task-edit-container">
        <div class="main-editor">
          <div class="main-task-members-container">
            <div class="main-task-members-header">Members</div>
            <div class="main-task-members">
              <ul v-for="member in getCurrTask.members">
                <li>
                  <img class="main-task-member-img" :src="member.imgUrl" alt="member" />
                </li>
              </ul>
              <div class="main-task-add-member"><span class="main-task-add-member-icon"></span></div>
            </div>
          </div>
          <label-picker />
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
          <el-button @click="onEdit" v-if="!isEdit" class="btn main-editor-decription-edit-btn" type="info"
            >Edit</el-button
          >
        </div>
        <textarea
          :class="openTextArea"
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
              <el-checkbox @input=";[(todo.isDone = !todo.isDone), saveTask()]">{{ todo.title }}</el-checkbox>
            </li>
          </ul>
          <el-button @click="addCheckListItem" type="info" class="btn main-editor-add-item-btn">Add an item</el-button>
          <div v-for="todo in checklist.todos" class="check-list-add-item-btn-container">
            <textarea v-model="todo.title" spellcheck="false"></textarea>
            <el-button type="primary" @click="saveTask">Save</el-button>
            <el-button type="info" @click="saveTask">Cancel</el-button>
          </div>
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
      </div>
      <div class="main-task-sidebar">
        <div class="main-task-header">Add to card</div>
        <div class="main-task-edit-btn">
          <span class="members-icon"></span>
          Members
        </div>
        <div class="main-task-edit-btn">
          <span class="labels-icon"></span>
          Labels
        </div>
        <div @click="addCheckList" class="main-task-edit-btn">
          <span class="checklist-icon"></span>
          Checklist
        </div>
        <div class="main-task-edit-btn">
          <span class="dates-icon"
            ><font-awesome-icon class="dates-icon-font-awesome" icon="fa-regular fa-clock"
          /></span>
          Dates
        </div>
        <div class="main-task-edit-btn">
          <span class="attachment-icon"></span>
          Attachment
        </div>
        <div class="main-task-edit-btn">
          <span class="cover-icon"></span>
          Cover
        </div>
      </div>
    </div>
    <!-- <pre>{{task}}</pre> -->
  </section>
</template>
<script>
import { ref } from 'vue'
import labelPicker from '../components/label-picker.vue'

export default {
  name: 'task-edit',
  data() {
    return {
      boardId: null,
      groupId: null,
      isEdit: false,
      isWrite: false,
      dateValue: ref(''),
      imgUrl: null,
      isCheckListItemAdded: false,
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
    saveTask() {
      this.isEdit = false
      this.$store.dispatch({
        type: 'saveTask',
        task: JSON.parse(JSON.stringify(this.getCurrTask)),
        groupId: this.groupId,
        boardId: this.boardId,
        currBoard: this.getCurrBoard,
        userAction: 'Task update',
      })
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
    addCheckListItem() {
      this.isCheckListItemAdded = !this.isCheckListItemAdded
      // this.$store.dispatch({ type: 'addCheckListItem' })
    },
    // addCheckList() {
    //   this.$store.dispatch({ type: 'addCheckList', title })
    // },
  },
  computed: {
    getCurrTask() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrTask))
    },
    getCurrBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
    },
    openTextArea() {
      return this.isEdit ? 'open-text-area' : ''
    },
  },
  components: {
    labelPicker,
  },
}
</script>

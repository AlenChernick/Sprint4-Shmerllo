<template>
  <section class="task-edit">
    <div
      v-if="taskToEdit.style?.bgColor !== '' || taskToEdit.style?.bgImgUrl !== ''"
      class="task-edit-cover"
      :style="{ 'background-color': taskToEdit.style?.bgColor }"
    >
      <img v-if="taskToEdit.style?.bgImgUrl" :src="taskToEdit.style.bgImgUrl" />
      <div v-if="getCurrTask" class="close-task-edit" @click="backToBoard">
        <span class="close-task-edit-icon"></span>
      </div>
    </div>
    <div v-else class="close-task-edit-no-img" @click="backToBoard">
      <span class="close-task-edit-no-img-icon"></span>
    </div>
    <!-- <pre>{{ getCurrTask.style }}</pre> -->
    <div class="task-edit-header">
      <span class="task-edit-header-icon"></span>
      <input @input="saveTask" spellcheck="false" v-model="getCurrTask.title" type="text" />
    </div>
    <div class="group-list-inlist-container">
      <p class="group-list-title">
        in list <span>{{ getCurrGroup.title }}</span>
      </p>
    </div>
    <div class="main-task-editor-container">
      <div class="main-task-edit-container">
        <div v-if="taskToEdit" class="main-editor">
          <div v-if="taskToEdit.members?.length > 0" class="main-task-members-container">
            <div class="main-task-members-header">Members</div>
            <div class="main-task-members">
              <ul v-for="member in taskToEdit.members">
                <li>
                  <img class="main-task-member-img" :src="member.imgUrl" alt="member" />
                </li>
              </ul>
              <div v-if="taskToEdit.members.length > 0" class="main-task-add-member">
                <span class="main-task-add-member-icon"></span>
              </div>
            </div>
          </div>

          <!-- <The labels per task are here: /> -->
          <div v-if="taskToEdit.labelIds?.length > 0" class="label-preview-container">
            <div class="label-preview-header">Labels</div>
            <div class="labels-preview-list">
              <ul class="label-preview" v-for="labelId in taskToEdit.labelIds">
                <li :style="{ 'background-color': labelColor(labelId) }">
                  <p>{{ labelText(labelId) }}</p>
                </li>
              </ul>
              <div v-if="taskToEdit.labelIds.length > 0" class="main-task-add-label">
                <span class="main-task-add-label-icon"></span>
              </div>
            </div>
          </div>
          <!-- /// -->

          <div class="main-editor-dates">
            <div class="main-task-dates-header">Dates</div>
            <div class="main-editor-dates-picker">
              <el-checkbox class="main-editor-checkbox"></el-checkbox>
              <el-date-picker class="main-editor-date-picker" type="dates" v-model="dateValue"></el-date-picker>
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
            <el-button @click="removeCheckList(checklist.id)" type="info" class="btn main-editor-checklist-delete-btn"
              >Delete</el-button
            >
          </div>
          <div class="checklist-progressbar-contianer">
            <el-progress :percentage="doneTodos(checklist)" class="checklist-progressbar" />
          </div>
          <ul v-for="todo in checklist.todos">
            <li>
              <el-checkbox v-model="todo.isDone" @change="saveTask(todo)">{{ todo.title }}</el-checkbox>
            </li>
          </ul>
          <el-button
            v-if="!isCheckListItemAdded"
            @click="isCheckListItemAdded = !isCheckListItemAdded"
            type="info"
            class="btn main-editor-add-item-btn"
            >Add an item</el-button
          >
          <div v-if="isCheckListItemAdded" class="check-list-add-item-btn-container">
            <div class="checklist-todo-add-container">
              <textarea v-model="todoTitle" spellcheck="false"></textarea>
              <div class="checklist-todo-add-btns">
                <el-button type="primary" @click="addCheckListItem(checklist.id, todoTitle)">Add</el-button>
                <el-button type="info" @click="isCheckListItemAdded = false">Cancel</el-button>
              </div>
            </div>
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
      <edit-task-actions
        @toggleLabel="toggleLabel"
        @toggleMember="toggleMember"
        @setTaskStyle="setTaskStyle"
        @addAttachment="addAttachment"
        @addCheckList="addCheckList"
      />
    </div>
  </section>
</template>
<script>
import { ref } from 'vue'

import editTaskActions from '../components/edit-task-actions.vue'

export default {
  name: 'task-edit',
  data() {
    return {
      boardId: null,
      groupId: null,
      isEdit: false,
      isWrite: false,
      dateValue: ref(''),
      taskToEdit: {},
      toggleDatePicker: false,
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
      this.taskToEdit = JSON.parse(JSON.stringify(this.$store.getters.getCurrTask))
      await this.$store.dispatch({
        type: 'getGroupById',
        boardId,
        groupId,
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
    addCheckListItem(checkListId, todoTitle) {
      if (todoTitle === '') return
      this.isCheckListItemAdded = !this.isCheckListItemAdded
      this.todoTitle = ''
      this.$store.dispatch({
        type: 'addCheckListItem',
        task: JSON.parse(JSON.stringify(this.getCurrTask)),
        groupId: this.groupId,
        checkListId,
        todoTitle,
        board: this.getCurrBoard,
      })
    },
    addCheckList(checkListTitle) {
      if (checkListTitle === '') return
      this.$store.dispatch({
        type: 'addCheckList',
        task: JSON.parse(JSON.stringify(this.getCurrTask)),
        groupId: this.groupId,
        board: this.getCurrBoard,
        checkListTitle,
      })
      this.isCheckListAdded = false
      this.checkListTitle = ''
    },
    removeCheckList(checklistId) {
      this.$store.dispatch({
        type: 'removeCheckList',
        task: JSON.parse(JSON.stringify(this.getCurrTask)),
        groupId: this.groupId,
        board: this.getCurrBoard,
        checklistId,
      })
    },
    toggleLabel(labelId) {
      console.log('yes ', labelId)
      const labels = this.taskToEdit.labelIds
      const idx = labels.findIndex((label) => label === labelId)
      let userAction = ''
      if (idx === -1) {
        userAction = 'Added label'
        labels.push(labelId)
      } else {
        labels.splice(idx, 1)
        userAction = 'Removed label'
      }
      console.log(this.taskToEdit, this.groupId, this.boardId)
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction,
        taskTitle: this.taskToEdit.title,
      })
    },
    toggleMember(member) {
      const members = this.taskToEdit.members
      const idx = members.findIndex((m) => m.id === member.id)
      let userAction = ''
      if (idx === -1) {
        userAction = 'Add member'
        members.push(member)
      } else {
        members.splice(idx, 1)
        userAction = 'Removed member'
      }
      console.log(this.taskToEdit, this.groupId, this.boardId)
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction,
        taskTitle: this.taskToEdit.title,
      })
    },
    setTaskStyle(style) {
      console.log(style)
      this.taskToEdit.style = style
      console.log(this.taskToEdit)
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Changed cover',
        taskTitle: this.taskToEdit.title,
      })
    },
    addAttachment(attachment) {
      this.taskToEdit.attachments.push(attachment)
      console.log(this.taskToEdit)
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Added attchment',
        taskTitle: this.taskToEdit.title,
      })
    },
    labelColor(labelId) {
      const boardLabels = this.$store.getters.getCurrBoard.boardLabels
      const label = boardLabels.find((l) => l.id === labelId)
      return label.bgColor
    },
    labelText(labelId) {
      const boardLabels = this.$store.getters.getCurrBoard.boardLabels
      const label = boardLabels.find((l) => l.id === labelId)
      return label.txt
    },
    doneTodos(checklist) {
      let checkListLen = checklist.todos.length
      let completed = checklist.todos.filter((todo) => todo.isDone === true)
      let commentLen = completed.length
      return (commentLen / checkListLen) * 100 || 0
    },
  },
  computed: {
    getCurrTask() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrTask))
    },
    getCurrBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard))
    },
    getCurrGroup() {
      return JSON.parse(JSON.stringify(this.$store.getters.getCurrGroup))
    },
    openTextArea() {
      return this.isEdit ? 'open-text-area' : ''
    },
    // boards() {
    //   return JSON.parse(JSON.stringify(this.$store.getters.getBoards))
    // },
  },
  components: {
    editTaskActions,
  },
}
</script>

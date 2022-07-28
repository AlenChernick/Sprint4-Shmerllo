<template>
  <div class="task-edit-screen" @click="backToBoard">
    <section @click.stop class="task-edit">
      <div
        v-if="taskToEdit.style?.bgColor !== '' || taskToEdit.style?.bgImgUrl !== ''"
        class="task-edit-cover"
        :style="{ 'background-color': taskToEdit.style?.bgColor }"
      >
        <div class="task-edit-img-container" :style="{ 'background-color': getAvgColor }">
        <pre>{{taskToEdit.style.bgImgUrl}}</pre>
          <img v-if="taskToEdit.style?.bgImgUrl" :src="taskToEdit.style.bgImgUrl" />
        </div>
        <div v-if="taskToEdit" class="close-task-edit" @click="backToBoard">
          <span class="close-task-edit-icon"></span>
        </div>
      </div>
      <div v-else-if="taskToEdit.style.bgImgUrl" class="task-edit-cover-img-with-bg-color">
        <img v-if="taskToEdit.style?.bgImgUrl" :src="taskToEdit.style.bgImgUrl" />
      </div>
      <div v-else class="close-task-edit-no-img" @click="backToBoard">
        <span class="close-task-edit-no-img-icon"></span>
      </div>
      <!-- <pre>{{ getCurrTask.style }}</pre> -->
      <div class="task-edit-header">
        <span class="task-edit-header-icon"></span>
        <input @input="saveTask" spellcheck="false" v-model="taskToEdit.title" type="text" />
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

            <div v-if="taskToEdit.dueDate !== ''" class="main-editor-dates">
              <div class="main-task-dates-header">Due date</div>
              <div class="main-editor-date-picker">
                <el-checkbox class="main-editor-checkbox"></el-checkbox>
                <Datepicker
                  class="main-editor-date-picker"
                  v-model="taskToEdit.dueDate"
                  cancelText="Close"
                  :full-month-name="false"
                  :inline="false"
                />
                <!-- <datepicker full-month-name="true" :inline="false"></datepicker> -->
              </div>
            </div>
          </div>
          <div class="main-editor-description">
            <span class="main-editor-description-icon"></span>
            <h4 class="main-editor-description-title">Description</h4>
            <el-button
              @click.stop=";[(isEdit = true), this.$refs.descriptionTxt.focus()]"
              v-if="!isEdit"
              class="btn main-editor-decription-edit-btn outter-task-btn"
              type="info"
              >Edit</el-button
            >
          </div>
          <p
            ref="descriptionTxt"
            @click="isEdit = true"
            @blur.stop="onEdit"
            contenteditable="true"
            spellcheck="false"
            class="main-editor-description-info"
          >
            {{ taskToEdit.description }}
          </p>
          <div class="main-editor-btn-container">
            <el-button
              class="confirm-btn"
              type="primary"
              v-if="isEdit"
              @click="onSaveDescription"
              @click.stop="isEdit = false"
              >Save</el-button
            >
            <el-button class="cancel-btn" type="info" v-if="isEdit" @click.stop="isEdit = false">Cancel</el-button>
          </div>
      
  
          <attachment-task-edit v-if="taskToEdit.attachments?.length>0" v-for="(attachment,idx) in taskToEdit.attachments" :attachment="attachment" :idx="idx"
          @makeCover="setTaskStyle"
           @removeAttachemnt="removeAttachemnt"
          ></attachment-task-edit>




          <div class="main-editor-checklist-container" v-for="checklist in taskToEdit.checklists">
            <div class="main-editor-checklist-header">
              <div class="main-editor-checklist-header-info">
                <span class="main-editor-checklist-icon"></span>
                <h4 class="main-editor-checklist-title">{{ checklist.checkListTitle }}</h4>
              </div>
              <el-button
                @click="removeCheckList(checklist.id)"
                type="info"
                class="btn main-editor-checklist-delete-btn outter-task-btn"
                >Delete</el-button
              >
            </div>
            <div class="checklist-progressbar-contianer">
              <el-progress :percentage="doneTodos(checklist)" class="checklist-progressbar" />
            </div>
            <div class="checklist-checkbox" v-for="todo in checklist.todos">
              <div class="checklist-checkbox-preview">
                <el-checkbox v-model="todo.isDone" @change="saveTask">
                  <span class="todo-title">{{ todo.todoTitle }}<span class="remove-todo-icon"></span></span
                ></el-checkbox>
                <div class="checklist-checkbox-menu">
                  <span @click.stop="checkListMenuToggle = !checkListMenuToggle" class="checklist-dots-icon"></span>
                  <div v-if="checkListMenuToggle" @click="removeCheckListItem(todo.id, checklist.id)">Delete</div>
                </div>
              </div>
            </div>
            <el-button
              v-if="isCheckListItemAdded !== checklist.id"
              @click="onCheckListItemAdded(checklist.id)"
              type="info"
              class="btn main-editor-add-item-btn outter-task-btn"
              >Add an item</el-button
            >
            <div v-if="isCheckListItemAdded === checklist.id" class="check-list-add-item-btn-container">
              <div class="checklist-todo-add-container">
                <textarea
                  ref="checkListText"
                  placeholder="Add an item"
                  v-model="checkListItem.todoTitle"
                  spellcheck="false"
                  class="check-list-textarea"
                ></textarea>
                <div class="checklist-todo-add-btns">
                  <el-button class="confirm-btn" type="primary" @click="addCheckListItem(checkListItem, checklist.id)"
                    >Add</el-button
                  >
                  <el-button class="cancel-btn" type="info" @click="isCheckListItemAdded = false">Cancel</el-button>
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
              <el-button class="outter-task-btn" type="info">Show details</el-button>
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
          @setDate="setDate"
          @removeDate="removeDate"
        />
      </div>
    </section>
  </div>
</template>
<script>
import editTaskActions from '../components/edit-task-actions.vue'
import attachmentTaskEdit from '../components/attachment-task-edit.vue'

import { utilService } from '../../services/util-service'
import { FastAverageColor } from 'fast-average-color'



export default {
  name: 'task-edit',
  data() {
    return {
      boardId: null,
      groupId: null,
      isEdit: false,
      isWrite: false,
      taskToEdit: {},
      toggleDatePicker: false,
      isCheckListItemAdded: false,
      todoTitle: '',
      checkListMenuToggle: false,
      checkListItem: {
        id: '',
        todoTitle: '',
        isDone: false,
      },
      paragraphTxt: '',
    }
  },
  async created() {
    try {
      const { boardId, groupId, taskId } = this.$route.params
      this.boardId = boardId
      this.groupId = groupId
      this.checkListItem.id = utilService.makeId()
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
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
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
    onEdit(evt) {
      this.taskToEdit.description = evt.target.innerText
      this.isEdit = true
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Added checklist item',
        taskTitle: this.taskToEdit.title,
      })
    },
    onSaveDescription() {
      this.isEdit = false
      this.onEdit
    },
    backToBoard() {
      this.$router.push(`/board/${this.boardId}`)
    },
    addCheckListItem(checkListItem, checkListId) {
      this.isCheckListItemAdded = !this.isCheckListItemAdded
      if (checkListItem.todoTitle === '') return
      const newCheckListItem = JSON.parse(JSON.stringify(checkListItem))
      const checkListIdx = this.taskToEdit.checklists.findIndex((checklist) => checklist.id === checkListId)
      this.taskToEdit.checklists[checkListIdx].todos.push(newCheckListItem)
      checkListItem.todoTitle = ''
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Added checklist item',
        taskTitle: this.taskToEdit.title,
      })
    },
    addCheckList(checklist) {
      if (checklist.checkListTitle === '') return
      this.taskToEdit.checklists.push(checklist)
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Added checklist',
        taskTitle: this.taskToEdit.title,
      })
      this.isCheckListAdded = false
      this.checkListTitle = ''
    },
    removeCheckList(checklistId) {
      const checkListIdx = this.taskToEdit.checklists.findIndex((checklist) => checklist.id === checklistId)
      const checklist = this.taskToEdit.checklists
      checklist.splice(checkListIdx, 1)
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Removed checklist',
        taskTitle: this.taskToEdit.title,
      })
    },
    removeCheckListItem(todoId, checkListId) {
      const checkListIdx = this.taskToEdit.checklists.findIndex((checklist) => checklist.id === checkListId)
      const todoIdx = this.taskToEdit.checklists[checkListIdx].todos.findIndex((todo) => todo.id === todoId)
      const todos = this.taskToEdit.checklists[checkListIdx].todos
      todos.splice(todoIdx, 1)

      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Removed checklist item',
        taskTitle: this.taskToEdit.title,
      })
    },
    toggleLabel(labelId) {
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
      console.log('style:',style)
      this.taskToEdit.style = style
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
      let percentage = (commentLen / checkListLen) * 100 || 0
      return +percentage.toFixed(0)
    },
    setDate(dateValue) {
      this.taskToEdit.dueDate = dateValue
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Added due date',
        taskTitle: this.taskToEdit.title,
      })
    },
    removeDate() {
      this.taskToEdit.dueDate = ''
      this.$store.dispatch({
        type: 'saveTask',
        task: this.taskToEdit,
        groupId: this.groupId,
        boardId: this.boardId,
        userAction: 'Removed due date',
        taskTitle: this.taskToEdit.title,
      })
    },
    onCheckListItemAdded(checkListId) {
      this.isCheckListItemAdded = checkListId
    },
    removeAttachemnt({attachemnt,idx}){
        console.log(attachemnt,idx)
    }
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
    getAvgColor() {
      if (!this.taskToEdit.style || !this.taskToEdit.style.bgImgUrl) return
      const imgUrl = this.taskToEdit.style.bgImgUrl
      const fac = new FastAverageColor()
      fac
        .getColorAsync(imgUrl)
        .then((color) => {
          this.taskToEdit.style.bgColor = color.hexa
        })
        .catch((e) => {
          console.log(e)
          throw err
        })
    },
    // boards() {
    //   return JSON.parse(JSON.stringify(this.$store.getters.getBoards))
    // },
  },
  components: {
    editTaskActions,
    attachmentTaskEdit,
  },
}
</script>

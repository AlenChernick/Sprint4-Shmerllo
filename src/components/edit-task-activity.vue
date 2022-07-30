<template lang="">
  <div class="main-editor-activity-contianer">
    <div class="main-editor-activity-header">
      <div class="main-editor-activity-header-info">
        <span class="main-editor-activity-icon"></span>
        <h4 class="main-editor-activity-title">Activity</h4>
      </div>
      <el-button
        v-if="!showDetails"
        @click="showDetails = !showDetails"
        class="outter-task-btn main-editor-show-details"
        type="info"
        >Show details</el-button
      >
      <el-button
        v-if="showDetails"
        @click="showDetails = !showDetails"
        class="outter-task-btn main-editor-show-details"
        type="info"
        >Hide details</el-button
      >
    </div>
    <div class="main-editor-activity-comments">
      <img v-if="user.imgUrl" class="main-edior-activity-user-icon" :src="user.imgUrl" alt="user-icon" />
      <div v-else-if="!user.imgUrl" class="active-user-no-img">{{ userFirstLetter(user.fullname) }}</div>
      <div v-else class="active-user guest-icon">{{ userFirstLetter('Guest') }}</div>
      <div class="main-edtior-activity-comment">
        <textarea
          @click="isEdit = true"
          :class="openTextArea"
          placeholder="Write a comment..."
          spellcheck="false"
          class="main-editor-activity-comment"
          v-model="currComment"
        >
        </textarea>

        <div class="task-edit-comment-btns">
          <el-button @click="onSaveCommmnt" v-if="isEdit" class="task-activity-comment-save-btn confirm-btn">Save</el-button>
          <el-button @click="onCancelComment" v-if="isEdit" class="task-activity-comment-cancel-btn cancel-btn">Cancel</el-button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDetails" class="task-activity-list" v-for="comment in comments">
    <img v-if="comment.user.imgUrl" class="active-user" :src="comment.user.imgUrl" alt="user-icon" />
    <div v-else-if="!comment.user.imgUrl" class="active-user-no-img">{{ userFirstLetter(comment.user.fullname) }}</div>
    <div v-else class="active-user guest-icon">{{ userFirstLetter('Guest') }}</div>
    <div class="task-activity-info">
      <div class="task-activity-user">{{ comment.user.fullname }}</div>
      <div class="task-activity-comment">{{ comment.comment }}</div>
      <a class="task-activity-delete" href="#" @click="onRemoveComment(comment.id)">Delete</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'task-edit-activity',
  emits: ['onSaveCommmnt', 'removeComment'],

  props: {
    comments: {
      type: Object,
    },
  },
  data() {
    return {
      isEdit: false,
      currComment: '',
      showDetails: true,
    }
  },
  methods: {
    userFirstLetter(memberFullName) {
      return memberFullName.charAt(0).toUpperCase()
    },
    onCancelComment() {
      this.currComment = ''
      this.isEdit = false
    },
    onSaveCommmnt() {
      if (this.currComment === '') {
        this.isEdit = false
        return
      }
      this.isEdit = false
      this.$emit('onSaveCommmnt', this.currComment)
      this.currComment = ''
    },
    onRemoveComment(commentId) {
      this.$emit('removeComment', commentId)
    },
  },
  computed: {
    openTextArea() {
      return this.isEdit ? 'open-text-area' : ''
    },
    user() {
      return this.$store.getters.loggedInUser
    },
    guest() {
      return this.$store.getters.guest
    },
  },
}
</script>

<template lang="">
  <!-- <pre>{{comments}}</pre> -->
  <div class="main-editor-activity-contianer">
    <div class="main-editor-activity-header">
      <div class="main-editor-activity-header-info">
        <span class="main-editor-activity-icon"></span>
        <h4 class="main-editor-activity-title">Activity</h4>
      </div>
      <el-button class="outter-task-btn" type="info">Show details</el-button>
    </div>
    <div class="main-editor-activity-comments flex flex-column">
      <span class="main-editor-activity-icon"
        ><font-awesome-icon icon="fa-solid fa-user"
      /></span>
      <textarea
        @click="isEdit = true"
        :class="openTextArea"
        placeholder="Write a comment"
        spellcheck="false"
        class="main-editor-activity-comment"
        v-model="currComment"
      >
      </textarea>
      <pre>{{ currComment }}</pre>
      <div class="task-edit-comment-btns flex">
        <el-button
          @click="onSaveCommmnt"
          v-if="isEdit"
          class="task-activity-comment-btn"
          >Save</el-button
        >
        <el-button
          @click="onCancelComment"
          v-if="isEdit"
          class="task-activity-comment-btn"
          >Cancel</el-button
        >
      </div>
    </div>
  </div>
  <div v-for="comment in comments">
    <div class="flex">
      <div class="active-user">
        {{ userFirstLetter(comment.user.username) }}
      </div>
      <div>
        <div class="task-activity-user">{{ comment.user.fullname }}</div>
        <div class="task-activity-comment">{{ comment.comment }}</div>
      </div>
    </div>
    <a href="#" @click="onRemoveComment(comment.id)">Delete</a>
  </div>
</template>
<script>
export default {
  name: "task-edit-activity",
  emits: ["onSaveCommmnt", "removeComment"],

  props: {
    comments: {
      type: Object,
    },
  },
  data() {
    return {
      isEdit: false,
      currComment: "",
    }
  },
  methods: {
    userFirstLetter(member) {
      return member.charAt(0).toUpperCase()
    },
    onCancelComment() {
      this.currComment = ""
      this.isEdit = false
    },
    onSaveCommmnt() {
      if (this.currComment === "") {
        this.isEdit = false
        return
      }
      this.isEdit = false
      this.$emit("onSaveCommmnt", this.currComment)
      this.currComment = ""
    },
    onRemoveComment(commentId) {
      this.$emit("removeComment", commentId)
    },
  },
  computed: {
    openTextArea() {
      return this.isEdit ? "open-text-area" : ""
    },
  },
}
</script>

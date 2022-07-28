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
          <div  v-for="comment in comments">
        <div class="flex ">
          <div class="active-user">{{userLetter(comment.byMember)}}</div>
          <div class="task-edit-comment" >{{comment.comment}}</div>
          </div>
          <a href="#">Delete</a>

          </div>
</template>
<script>
export default {
      name: "task-edit-activity",

  props: {
    comments: {
      type: Object,
    },
  
  },
  methods: {
    userLetter(member){
    
return member.charAt(0).toUpperCase()
    }
  },
}
</script>
<style lang="">
    
</style>
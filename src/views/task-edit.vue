<template >
  <section class="task-edit">
    <pre>{{groupId}}</pre>
    <button @click="saveTask">Save</button>
    <input v-model="task.title" type="text"> 
    <p>in List... to add when nestedroute</p>
    <!-- <h3>CreatedBy: {{task.byMember.fullname}}</h3> -->
    <!-- <img src="task.byMember.imgUrl"/> -->
    <ul v-for="member in task.memberIds">Member
        <li>
          <p>{{member}}</p>
        </li>
    </ul> 
    <ul v-for="label in task.labelIds">Label
        <li>
          <p>{{label}}</p>
        </li>
    </ul> 
    <h2>Dates:</h2>
    <p>CreatedAt: {{new Date (task.createdAt).toString()}}</p>
    <p>DueDate: {{new Date (task.dueDate).toString()}}</p>
    <h2>Status: {{task.status}}</h2> 
    <h2>Description: {{task.description}}</h2>
    <ul v-for="comment in task.comments">Activity
        <li>
          <p>{{comment.byMember.fullName}}</p>
          <p>{{comment.txt}}</p>
          <p>{{new Date (comment.createdAt).toString()}}</p>
          <img src="comment.byMember.imgUrl"/>

        </li>
    </ul> 
    <div v-for="checklist in task.checklists">checkLists:
          <h4>{{checklist.title}}</h4>
           <ul v-for="todo in checklist.todos">Activity
        <li>
          <p>{{todo.title}}</p>
          <p>{{todo.isDone}}</p>
        </li>
        </ul> 
    </div> 

    <pre>{{task}}</pre>


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
      }
    },
    removeTask(){
      this.$store.dispatch({ type: 'saveTask', taskId: this.task._id })
    }
}


</script>
<style ></style>

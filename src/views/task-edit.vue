<template lang="">
  <section class="task-edit">
    <input v-model="task.title" type="text"> 
    <p>in List... to add when nestedroute</p>
    <h3>CreatedBy: {{task.byMember.fullname}}</h3>
    <img src="task.byMember.imgUrl"/>
    <pre>{{task.byMember.imgUrl}}</pre>
    <ul v-for="member in task.memberIds">Activity
        <li>
          <p>{{member}}</p>
        </li>
    </ul> 
    <ul v-for="label in task.lavelIds">Activity
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

    <!-- <pre>{{task}}</pre> -->


  </section>
</template>
<script>
export default {
  name: 'task-edit',
  data() {
    return {
      task: {},
    }
  },
  async created() {
    try {
      const { id } = this.$route.params
      const task = await this.$store.dispatch({ type: 'getTaskById', taskId: id })
      this.task = task
    } catch (err) {
      console.log('Cannot load task', err)
      throw err
    }
  },
  methods: {  
    saveTask() {
      this.$store.dispatch({ type: 'saveTask', task: this.task })
      }
    },
    removeTask(){
      this.$store.dispatch({ type: 'saveTask', taskId: this.task._id })
    }
}


</script>
<style ></style>

<template>
  <button @click="displayMenu='block'" class="board-header-btn"><span class="menu-icon"></span>Show menu</button>
  <section :style="{ display: displayMenu }" class="board-menu">
    <!-- <pre>{{activities}}</pre> -->
    <h4>Menu</h4>
    <span  @click="displayMenu='none'" class="close-icon"></span>

    <div class="change-background">
      <div class="change-background-hover">
        <img src="https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=1600"/>
        <h3>Change background</h3>
      </div>
    </div>

    <div class="activity-header">
      <span class="activity-icon"></span>
      <h6>Activity</h6>
      <p>{{activities.length}}</p>
    </div>

      <!-- <pre>{{activities}}</pre> -->
      <div class="activity-log">
        <ul class="activity-list clean-list" v-for="activity in activities">
          <img :src="activity.byMember.imgUrl"/>
          <div class="activity-details">
            <h5>{{activity.byMember.fullname}}</h5>
            <h4>{{activity.txt}}</h4>
            <h3>{{activity.task.title}}</h3>
            <p>{{new Date(activity.createdAt).toString()}}</p>
          </div>
        </ul>
      </div>
  </section>
</template>
<script>
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons"
import { boardService } from "../../services/board-service.js"

export default {
  name: 'board-menu',
  data() {
    return {
      activities: boardService.getEmptyBoard().activities,
      displayMenu: 'none',
    }
  },
  created() {
   
  },
  methods: {
   
  },
}
</script>

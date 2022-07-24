<template>
  <button @click="displayMenu='block'" class="board-header-btn"><span class="menu-icon"></span>Show menu</button>
  <section :style="{ display: displayMenu }" class="board-menu">
    <!-- <pre>{{activities}}</pre> -->
    <h4>{{pageTitle}}</h4>
    <span  @click="displayMenu='none'" class="close-icon"></span>

  <div :style="{ display: activityView }" class="activity-view">
    <div @click="openCoverSelection" class="change-background">
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
            <p>{{timeFormat(activity.createdAt)}}</p>
          </div>
        </ul>
      </div>
  </div>

  <div :style="{ display: coverSelectionView }" class="board-cover-selection">

   <span @click="closeCoverSelection" class="close-cover-selection"></span>
  
      <div v-for="color in coverOptions.coverColors" :style="{ 'background-color': color}"  class="color-box" @click="setBgColor(color)"> 
          </div>
    <div class="seperator"></div>
  
      <img v-for="imgUrl in coverOptions.coverImgs" :src="imgUrl" @click="setBgImgUrl(imgUrl)"/>
  

  </div>

  </section>
</template>
<script>
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons"
import { boardService } from "../../services/board-service.js"
import moment from "moment";

export default {
  name: 'board-menu',
  // props: {
  //   activities: {
  //     type: Array,
  //   },
  //  },
  data() {
    return {
      displayMenu: 'none',
      activityView: 'block',
      coverSelectionView: 'none',
      coverOptions: boardService.coverOptions(),
      pageTitle: 'Menu',
      style: {
        bgColor: '',
        bgImgUrl: '',
      },
      activities: [],

    }
  },
  created() {
     this.activities = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.activities))
   
  },
  methods: {
    openCoverSelection(){
      this.activityView =  'none'
      this.coverSelectionView =  'block'
      this.pageTitle = 'Choose Background'
    },
    closeCoverSelection(){
      this.activityView =  'block'
      this.coverSelectionView =  'none'
      this.pageTitle = 'Menu'
    },
    setBgColor(color){
      this.style.bgColor= color
      this.style.bgImgUrl= ''
      console.log(this.style)
      this.$store.dispatch({type: "setBoardStyle",style: this.style })

    },
    setBgImgUrl(imgUrl){
      this.style.bgColor= ''
      this.style.bgImgUrl= imgUrl
      console.log(this.style)
      this.$store.dispatch({type: "setBoardStyle",style: this.style })
    }, 
    timeFormat(time) {
      return moment(time).fromNow()
    },
  },
  computed: {
  }
}
</script>

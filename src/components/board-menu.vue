<template>
<<<<<<< HEAD
  <button @click="displayMenu = 'block'" class="board-header-btn"><span class="menu-icon"></span>Show menu</button>
  <section :style="{ display: displayMenu }" class="board-menu">
    <h4>{{ pageTitle }}</h4>
    <span @click="displayMenu = 'none'" class="close-icon"></span>
=======
  <button @click="displayMenu='block'" class="board-header-btn"><span class="menu-icon"></span>Show menu</button>
  <section v-if="activities" :style="{ display: displayMenu }" class="board-menu">
    <!-- <pre>{{activities}}</pre> -->
    <h4>{{pageTitle}}</h4>
    <span  @click="displayMenu='none'" class="close-icon"></span>
>>>>>>> 41dcff26f4e65514452177629985382d8d56cea3

    <div :style="{ display: activityView }" class="activity-view">
      <div @click="openCoverSelection" class="change-background">
        <div class="change-background-hover">
          <img
            src="https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=1600"
          />
          <h3>Change background</h3>
        </div>
      </div>

      <div class="activity-header">
        <span class="activity-icon"></span>
        <h6>Activity</h6>
        <p>{{ activities.length }}</p>
      </div>

      <!-- <pre>{{activities}}</pre> -->
      <div class="activity-log">
        <!-- <pre>{{activities}}</pre> -->
        <ul class="activity-list clean-list" v-for="activity in activities">
<<<<<<< HEAD
          <img :src="activity.byMember.imgUrl" />
=======
          <img v-if="activity.byMember.fullname !=='Guest'" :src="activity.byMember?.imgUrl"/>
          <div v-else class="active-user">G</div>
>>>>>>> 41dcff26f4e65514452177629985382d8d56cea3
          <div class="activity-details">
            <h5>{{ activity.byMember.fullname }}</h5>
            <h4>{{ activity.txt }}</h4>
            <h3>{{ activity.task.title }}</h3>
            <p>{{ timeFormat(activity.createdAt) }}</p>
          </div>
        </ul>
      </div>
    </div>

    <div :style="{ display: coverSelectionView }" class="board-cover-selection">
      <span @click="closeCoverSelection" class="close-cover-selection"></span>

      <div
        v-for="color in coverOptions.coverColors"
        :style="{ 'background-color': color }"
        class="color-box"
        @click="setBgColor(color)"
      ></div>
      <div class="seperator"></div>

      <img v-for="imgUrl in coverOptions.coverImgs" :src="imgUrl" @click="setBgImgUrl(imgUrl)" />
    </div>
  </section>
</template>
<script>
// import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons"
// import { boardService } from "../../services/board-service.js"
import moment from 'moment'

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
      coverOptions: {
        coverColors: ['#277da1', '#4d908e', '#fb6f92', '#90be6d', '#f9c74f', '#f9844a', '#00b4d8', '#3a5a40'],
        coverImgs: [
          'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
          'https://media.istockphoto.com/photos/the-sun-goes-down-behind-the-autumn-forest-picture-id1162998855?k=20&m=1162998855&s=612x612&w=0&h=JLbCH4hLaO5war1ipJXx7eoxXMdhcMXFO9pwXz1NR1Q=',
          'https://wallpaperaccess.com/full/1131217.jpg',
          'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg',
          'https://media.istockphoto.com/photos/hydrangea-flowers-in-the-garden-picture-id927499422?k=20&m=927499422&s=612x612&w=0&h=9fZtBAXZ3I8qNRTi87SHTDEjbBjyn_eRoDoLAC7zVvg=',
          'https://i.pinimg.com/originals/18/28/4e/18284ec99d85c9ee5afaf05baf77083a.jpg',
          'https://media.istockphoto.com/photos/colored-ceiling-picture-id1208301897?k=20&m=1208301897&s=612x612&w=0&h=xXFlsJphxez3hgCYRxYmS7yxb5P4-HOtbnsjIVJSSWA=',
          'https://assets.weforum.org/global_future_council/image/xALg-7b0WN5aLOY6aejbKW3NepG-PEipzKnEuyS8ZlI.jpeg',
          'https://media.cntraveler.com/photos/5ca60f7f7b531a5e47949cde/master/w_4000,h_2400,c_limit/NYC_GettyImages-500619014.jpg',
          'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=1600',
        ],
      },
      pageTitle: 'Menu',
      style: {
        bgColor: '',
        bgImgUrl: '',
      },
<<<<<<< HEAD
      activities: [],
    }
  },
  created() {
    this.activities = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.activities))
=======
      // activities: [],

    }
  },
  created() {
    //  this.activities = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.activities))
   
>>>>>>> 41dcff26f4e65514452177629985382d8d56cea3
  },
  methods: {
    openCoverSelection() {
      this.activityView = 'none'
      this.coverSelectionView = 'block'
      this.pageTitle = 'Choose Background'
    },
    closeCoverSelection() {
      this.activityView = 'block'
      this.coverSelectionView = 'none'
      this.pageTitle = 'Menu'
    },
    setBgColor(color) {
      this.style.bgColor = color
      this.style.bgImgUrl = ''
      this.$store.dispatch({ type: 'setBoardStyle', style: this.style })
    },
    setBgImgUrl(imgUrl) {
      this.style.bgColor = ''
      this.style.bgImgUrl = imgUrl
      this.$store.dispatch({ type: 'setBoardStyle', style: this.style })
    },
    timeFormat(time) {
      return moment(time).fromNow()
    },
  },
<<<<<<< HEAD
  computed: {},
=======
  computed: {
    activities(){
       return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.activities))
    }
  }
>>>>>>> 41dcff26f4e65514452177629985382d8d56cea3
}
</script>

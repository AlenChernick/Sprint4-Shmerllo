<template>
  <button
    :style="{ color: getTxtColor, getAvgColor, transition: 'background-color 0.4s ' }"
    @click="displayMenu = 'block'"
    class="board-header-btn"
  >
    <span class="menu-icon"></span>Show menu
  </button>
  <section v-if="activities" :style="{ display: displayMenu }" class="board-menu">
    <!-- <pre>{{activities}}</pre> -->
    <div class="menu-title">{{ pageTitle }}</div>
    <span @click="displayMenu = 'none'" class="close-icon"></span>

    <div :style="{ display: activityView }" class="activity-view">
      <div @click="openCoverSelection" class="change-background">
        <div class="change-background-hover">
          <span class="cover-icon"></span>
          <div class="change-background-contianer">Change background</div>
        </div>
      </div>

      <div class="activity-header">
        <span class="activity-icon"></span>
        <div class="activity-header-text">Activity</div>
      </div>
      <div class="activity-log">
        <div class="activity-list" v-for="activity in activities">
          <img v-if="activity.byMember.fullname !== 'Guest'" :src="activity.byMember?.imgUrl" />
          <div v-else class="active-user">G</div>
          <div class="activity-details">
            <div class="activity-member-name">{{ activity.byMember.fullname + ' ' }}</div>
            <div class="activity-txt">{{ activity.txt + ' ' }}</div>
            <div class="activity-task-title">{{ activity.task.title }}</div>
            <div class="activity-created-at">{{ timeFormat(activity.createdAt) }}</div>
          </div>
        </div>
      </div>
      <!-- <div class="activity-log">
        <div class="activity-list" v-for="activity in activities">
          <img v-if="activity.byMember.fullname !== 'Guest'" :src="activity.byMember?.imgUrl" />
          <div v-else class="active-user">G</div>
          <div class="activity-details">
            <div class="activity-member-name">{{ activity.byMember.fullname + ' ' }}</div>
            <div class="activity-txt">{{ activity.txt + ' ' }}</div>
            <div class="activity-task-title">{{ activity.task.title }}</div>
            <div class="activity-created-at">{{ timeFormat(activity.createdAt) }}</div>
          </div>
        </div>
      </div> -->
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
      <el-input class="search-img-input" placeholder="Search Photos" type="text" v-model="query" @input="fetchListOfPhotos()" />
      <img v-for="imgUrl in coverOptions.coverImgs" :src="imgUrl" @click="setBgImgUrl(imgUrl)" />
    </div>
  </section>
</template>
<script>
import moment from 'moment'
import { FastAverageColor } from 'fast-average-color'

export default {
  name: 'board-menu',
  data() {
    return {
      displayMenu: 'none',
      activityView: 'block',
      coverSelectionView: 'none',
      coverOptions: {
        coverColors: ['#277da1', '#4d908e', '#fb6f92', '#90be6d', '#f9c74f', '#f9844a', '#00b4d8', '#3a5a40'],
        coverImgs: [],
      },
      pageTitle: 'Menu',
      style: {
        bgColor: '',
        bgImgUrl: '',
      },
      accesKey: 'MW3WlTYHFpvQZJwkJp360WPZFpDiNui3_1sdi4VjuhY',
      query: '',
      txtColor: '',

      // activities: [],
    }
  },
  created() {
    //  this.activities = JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.activities))
    this.fetchListOfPhotos()
  },
  methods: {
    async fetchListOfPhotos() {
      try {
        let query = this.query
        let response = null
        if (query === '')
          response = await fetch(`https://api.unsplash.com/search/photos?client_id=${this.accesKey}&query=develop`)
        else response = await fetch(`https://api.unsplash.com/search/photos?client_id=${this.accesKey}&query=${query}`)
        let json = await response.json()
        await json.results.forEach((img) => {
          const imgUrl = img.urls.full
          if (this.coverOptions.coverImgs.length > 15) {
            return (this.coverOptions.coverImgs = [])
          } else {
            return this.coverOptions.coverImgs.push(imgUrl)
          }
        })
      } catch (err) {
        console.log('Cannot load photos', err)
        // throw err
      }
    },
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
  computed: {
    activities() {
      return this.$store.getters.getCurrBoard.activities
      // return JSON.parse(JSON.stringify(this.$store.getters.getCurrBoard.activities))
    },
    async getAvgColor() {
      try {
        const imgUrl = await this.getCurrBoard.style.bgImgUrl
        const fac = new FastAverageColor()
        const color = await fac.getColorAsync(imgUrl)
        console.log(color)
        if (color.isLight) this.txtColor = '#000000'
        else this.txtColor = '#fff'
      } catch (err) {
        console.log('Cannot load avg color', err)
        throw err
      }
    },
    getTxtColor() {
      return this.txtColor
    },
    getCurrBoard() {
      return this.$store.getters.getCurrBoard
    },
  },
}
</script>

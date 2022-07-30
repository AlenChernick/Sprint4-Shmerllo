<template>
  <div class="new-board-modal flex flex-column">
    <div class="new-board-modal-container">
      <div class="new-board-modal-header">
        <div @click.stop="onCloseModal" class="close-modal"></div>
        <div class="new-board-modal-header main-title">Create Board</div>
      </div>
      <img src="../assets/img/teamwork.webp" alt="" />

      <div class="seperator"></div>
      <div class="background-title-header title">Background</div>
      <div class="new-board-modal-bg-picker">
        <div class="color-container">
          <div
            v-for="color in coverOptions.coverColors"
            @click.stop="setBgColor(color)"
            :style="{ 'background-color': color }"
            class="color-box"
          ></div>
        </div>
        <div class="seperator"></div>
        <div class="img-container">
          <el-input
            class="search-img-input"
            placeholder="Search Photos"
            type="text"
            v-model="query"
            @input="fetchListOfPhotos()"
          />
          <img v-for="imgUrl in coverOptions.coverImgs" @click.stop="setBgImgUrl(imgUrl)" :src="imgUrl" />
        </div>
      </div>
      <div class="enter-board-title title">Board title</div>
      <input @click.stop class="board-title-input" v-model="title" type="text" />
      <span v-if="!title" class="input-required">👋 Board title is required</span>
      <el-button class="new-board-create new-board-create-btn confirm-btn" @click.stop="oneNewBoard">Create</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'new-board-modal',
  data() {
    return {
      title: '',
      coverOptions: {
        coverColors: [
          '#277da1',
          '#4d908e',
          '#fb6f92',
          '#90be6d',
          '#f9c74f',
          '#f9844a',
          '#00b4d8',
          '#3a5a40',
          '#c8b6ff',
          '#83c5be',
          '#90be2d',
          '#f9f74f',
        ],
        coverImgs: [],
      },
      style: {
        bgColor: '',
        bgImgUrl: '',
      },
      accesKey: 'MW3WlTYHFpvQZJwkJp360WPZFpDiNui3_1sdi4VjuhY',
      query: '',
    }
  },
  created() {
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
    setBgColor(color) {
      this.style.bgColor = color
      this.style.bgImgUrl = ''
    },
    setBgImgUrl(imgUrl) {
      this.style.bgColor = ''
      this.style.bgImgUrl = imgUrl
    },
    oneNewBoard() {
      if (!this.title) return
      if (!this.style.bgColor && !this.style.bgImgUrl) return
      let properties = {
        title: this.title,
        style: this.style,
      }
      this.$emit('newBoard', properties)
    },
    onCloseModal() {
      this.$emit('abortNewBoardModal')
    },
  },
  components: {},
}
</script>

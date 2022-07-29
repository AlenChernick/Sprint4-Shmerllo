<template lang="">
  <section class="actions-modal-container cover-picker">
    <h4>cover</h4>
    <span @click.stop="closeModal" class="close-icon"></span>

    <div class="cover-selection">
      <div
        v-for="color in coverOptions.coverColors"
        :style="{ 'background-color': color }"
        class="color-box"
        @click.stop="setBgColor(color)"
      ></div>
      <div class="seperator"></div>
      <el-input
        class="search-img-input"
        placeholder="Search Photos"
        type="text"
        v-model="query"
        @click.stop
        @input="fetchListOfPhotos()"
      />
      <img v-for="imgUrl in coverOptions.coverImgs" :src="imgUrl" @click.stop="setBgImgUrl(imgUrl)" />
    </div>
  </section>
</template>
<script>
export default {
  name: 'cover-picker',
  data() {
    return {
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
  methods: {
    async fetchListOfPhotos() {
      try {
        let query = this.query
        const response = await fetch(`https://api.unsplash.com/search/photos?client_id=${this.accesKey}&query=${query}`)
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
      this.$emit('setTaskStyle', this.style)
    },
    setBgImgUrl(imgUrl) {
      this.style.bgColor = ''
      this.style.bgImgUrl = imgUrl
      this.$emit('setTaskStyle', this.style)
    },
    closeModal() {
      this.$emit('closeModal')
    },
  },

  computed: {},
}
</script>
<style lang=""></style>

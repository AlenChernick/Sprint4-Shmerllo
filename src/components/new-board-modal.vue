<template>
  <div class="new-board-modal flex flex-column">
    <div class="new-board-modal-container">
      <div @click.stop="onCloseModal">X</div>
      <img src="../assets/img/teamwork.webp" alt="" />
      <div class="new-board-modal-header main-title">Create Board</div>
      <div class="seperator"></div>
      <div class="background-title-header title" >Background</div>
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
          <img v-for="imgUrl in coverOptions.coverImgs" @click.stop="setBgImgUrl(imgUrl)" :src="imgUrl" />
        </div>
      </div>
      <div class="enter-board-title title " >Board title</div>
      <input @click.stop class="board-title-input" v-model="title" type="text" />
      <span class="new-board-create new-board-create-btn" @click.stop="oneNewBoard">Create</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "new-board-modal",
  data() {
    return {
      title: "",
      coverOptions: {
        coverColors: [
          "#277da1",
          "#4d908e",
          "#fb6f92",
          "#90be6d",
          "#f9c74f",
          "#f9844a",
          "#00b4d8",
          "#3a5a40",
          "#c8b6ff",
          "#83c5be",
          "#90be2d",
          "#f9f74f",
        ],
        coverImgs: [
          "https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg",
          "https://media.istockphoto.com/photos/the-sun-goes-down-behind-the-autumn-forest-picture-id1162998855?k=20&m=1162998855&s=612x612&w=0&h=JLbCH4hLaO5war1ipJXx7eoxXMdhcMXFO9pwXz1NR1Q=",
          "https://wallpaperaccess.com/full/1131217.jpg",
          "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg",
          "https://media.istockphoto.com/photos/hydrangea-flowers-in-the-garden-picture-id927499422?k=20&m=927499422&s=612x612&w=0&h=9fZtBAXZ3I8qNRTi87SHTDEjbBjyn_eRoDoLAC7zVvg=",
          "https://i.pinimg.com/originals/18/28/4e/18284ec99d85c9ee5afaf05baf77083a.jpg",
          "https://media.istockphoto.com/photos/colored-ceiling-picture-id1208301897?k=20&m=1208301897&s=612x612&w=0&h=xXFlsJphxez3hgCYRxYmS7yxb5P4-HOtbnsjIVJSSWA=",
          "https://assets.weforum.org/global_future_council/image/xALg-7b0WN5aLOY6aejbKW3NepG-PEipzKnEuyS8ZlI.jpeg",
          "https://media.cntraveler.com/photos/5ca60f7f7b531a5e47949cde/master/w_4000,h_2400,c_limit/NYC_GettyImages-500619014.jpg",
          "https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=1600",
          "https://worldbirds.com/wp-content/uploads/2021/09/pink-flamingo-birds-scaled.jpg",
          "https://img.freepik.com/premium-photo/chamomile-flower-field-camomile-nature-field-camomiles-sunny-day-nature-camomile_569122-690.jpg?w=2000",
        ],
      },
      style: {
        bgColor: "",
        bgImgUrl: "",
      },
    }
  },
  methods: {
    setBgColor(color) {
      this.style.bgColor = color
      this.style.bgImgUrl = ""
    },
    setBgImgUrl(imgUrl) {
      this.style.bgColor = ""
      this.style.bgImgUrl = imgUrl
    },
    oneNewBoard() {
      if (!this.title) return
      if (!this.style.bgColor && !this.style.bgImgUrl) return
      let properties = {
        title: this.title,
        style: this.style,
      }
      this.$emit("newBoard", properties)
    },
    onCloseModal() {
      this.$emit("abortNewBoardModal")
    },
  },
  components: {},
}
</script>

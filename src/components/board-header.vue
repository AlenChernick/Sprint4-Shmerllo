<template>
  <section class="board-header">

    <div class="board-info">
      <input spellcheck="false" v-model="title" type="text" />
      <pre>{{isFavorite}}</pre> 
      <h5> {{byMember.fullname}}'s workspace</h5> 
      <ul class="members clean-list" v-for="member in members">
        <img :src="member.imgUrl"/>
      </ul>

    </div>
    <!-- <h1><font-awesome-icon icon="fa-solid fa-star" /></h1> -->


    <!-- <pre>{{members}}</pre> -->


    <div class="board-header-buttons">
      <board-menu />
      <board-filter />
    </div>
  </section>
</template>
<script>
import boardMenu from '../components/board-menu.vue'
import boardFilter from '../components/board-filter.vue'

export default {
  name: 'board-header',
   props: {
    title: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
    },
    members: {
      type: Array,
    },
    byMember: {
      type: String,
    },

  },
  components: {
    boardMenu,
    boardFilter,
  },
}
</script>

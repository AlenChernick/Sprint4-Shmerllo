<template lang="">
  <section v-if="users">
    <div>Add member</div>
    <input type="text" v-model="filterBy" placeholder="Enter work member" />
    <div v-if="filterBy" v-for="user in users" class="users-modal">
      <div>{{ user.fullname }}</div>
      <img :src="user.imgUrl" alt="" />
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      filterBy: '',
    }
  },
  computed: {
    users() {
      const usersArr = [
        {
          _id: '62e026b0e591ebcf9c1f1160',
          username: 'THT',
          fullname: 'Tal Hammer Topaz',
          imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512',
        },
        {
          _id: '62e026d0e591ebcf9c1f1162',
          username: 'AK',
          fullname: 'Alon Kolker',
          imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512',
        },
        {
          _id: '62e026d4e591ebcf9c1f1163',
          username: 'AC',
          fullname: 'Alen Chernick',
          imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512',
        },
        {
          _id: '62e026d9e591ebcf9c1f1164',
          username: 'LS',
          fullname: 'Lihi Sered',
          imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512',
        },
      ]

      if (!this.filterBy) return usersArr
      return usersArr.filter((user) => user.fullname.toUpperCase().includes(this.filterBy.toUpperCase()))
    },
    board() {
      return JSON.parse(JSON.stringify(this.$store.getCurrBoard))
    },
  },
  components: {
    ArrowDown,
  },
}
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

<!-- users() {
      return (
        {
          _id: "62e026b0e591ebcf9c1f1160",
          username: "THT",
          fullname: "Tal Hammer Topaz",
          imgUrl: "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512",
        },
        {
          _id: "62e026d0e591ebcf9c1f1162",
          username: "AK",
          fullname: "Alon Kolker",
          imgUrl: "https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512",
        },
        {
          _id: "62e026d4e591ebcf9c1f1163",
          username: "AC",
          fullname: "Alen Chernick",
          imgUrl: "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512",
        },
        {
          _id: "62e026d9e591ebcf9c1f1164",
          username: "LS",
          fullname: "Lihi Sered",
          imgUrl: "https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512",
        }
      )
    }, -->

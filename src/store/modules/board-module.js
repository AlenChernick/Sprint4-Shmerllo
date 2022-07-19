// import { userService } from '@/services/user-service.js'

const store = createStore({
  strict: true,
  state: {
    boards: null,
    currBoard: null,
  },
  getters: {
    loggedInUser({ loggedInUser }) {
      return loggedInUser
    },
    users({ users }) {
      return users
    },
  },
  mutations: {

  },
  actions: {},
})

export default store

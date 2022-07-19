// import { userService } from '@/services/user-service.js'

const store = createStore({
  strict: true,
  state: {
    users: null,
    loggedInUser: userService.getLoggedinUser(),
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
  modules: {
  },
})

export default store

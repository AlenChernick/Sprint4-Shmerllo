import { userService } from '../../../services/user-service.js'

export default {
  state: {
      loggedInUser: userService.getLoggedInUser(),
    //   users: null,
  },
  getters: {
    loggedInUser({ loggedInUser }) {
      return loggedInUser
    },
    // users({ users }) {
    //   return users
    // },
  },
  mutations: {
 
  },
  actions: {},

}


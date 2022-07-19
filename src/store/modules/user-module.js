import { userService } from '../../../services/user-service.js'

export default {
  state: {
    users: null,
    loggedInUser: userService.getLoggedInUser(),
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

}


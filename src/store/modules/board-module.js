import { boardService } from "../../../services/board-service_Async"

export default {
  state: {
    boards: [],
    currBoard: {},
    currTask: {},
    currGroup: {},
  },
  getters: {
    getBoards({ boards }) {
      return boards
    },
    getCurrBoard({ currBoard }) {
      return currBoard
    },
    getCurrTask({ currTask }) {
      return currTask
    },
    getCurrGroup({ currGroup }) {
      return currGroup
    }
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    setCurrBoard(state, { currBoard }) {
      state.currBoard = currBoard
    },
    setCurrTask(state, { currTask }) {
      state.currTask = currTask
    },
    setCurrGroup(state, { currGroup }) {
      state.currGroup = currGroup
    },
    removeBoard(state, { id }) {
      const idx = state.boards.findIndex((board) => board._id === id)
      state.boards.splice(idx, 1)
    },
    saveBoard(state, { board }) {
      const idx = state.boards.findIndex(
        (currBoard) => currBoard._id === board._id
      )
      if (idx !== -1) state.boards.splice(idx, 1, board)
      else state.boards.push(board)
      state.currBoard = board
    },
    saveGroup(state, { savedGroup }) {
      const idx = state.currBoard.groups.findIndex(
        (g) => g.id === savedGroup.id
      )
      if (idx !== -1) {
        state.currBoard.groups.splice(idx, 1, savedGroup)
      } else {
        state.currBoard.groups.push(savedGroup)
      }
    },
    saveGroups(state, { groups, boardId }) {
      const idx = state.boards.findIndex((b) => b._id === boardId)
      state.boards[idx].groups = groups
    },
    saveTask(state, { savedTask, groupId }) {
      // state.currBoard = currBoard
      const groupIdx = state.currBoard.groups.findIndex(
        (group) => group.id === groupId
      )
      const taskIdx = state.currBoard.groups[groupIdx].tasks.findIndex(
        (task) => task.id === savedTask.id
      )
      // const boardIdx = state.boards.findIndex((board) => board._id === boardId)
      if (taskIdx !== -1) {
        // state.boards[boardIdx].groups[groupIdx].tasks.splice(taskIdx, 1, savedTask)
        state.currBoard.groups[groupIdx].tasks.splice(taskIdx, 1, savedTask)
        // console.log(state.boards[boardIdx].groups[groupIdx].tasks[taskIdx])
      } else {
        // state.boards[boardIdx].groups[groupIdx].tasks.push(savedTask)
        state.currBoard.groups[groupIdx].tasks.push(savedTask)
      }
    },
    removeGroup(state, { groupId, boardId }) {
      const boardIdx = state.boards.findIndex((board) => board._id === boardId)
      const groupIdx = state.boards[boardIdx].groups.findIndex(
        (group) => group.id === groupId
      )

      state.boards[boardIdx].groups.splice(groupIdx, 1)
      state.currBoard = state.boards[boardIdx]
    },
  },
  actions: {
    async loadBoards({ commit }) {
      try {
        const boards = await boardService.query()
        commit({ type: "setBoards", boards })
      } catch (err) {
        console.log("Cannot load boards", err)
        throw err
      }
    },
    async removeBoard({ commit }, { id }) {
      try {
        await boardService.removeBoard(id)
        commit({ type: "removeBoard", id })
      } catch (err) {
        console.log("Cannot remove board", err)
        throw err
      }
    },
    async saveBoard({ commit }, { board }) {
 
      try {
        const savedBoard = await boardService.saveBoard(board)
        commit({ type: "saveBoard", board: savedBoard })
      } catch (err) {
        console.log("Cannot save board", err)
        throw err
      }
    },
    async loadCurrBoard({ commit }, { boardId }) {
      try {
        const currBoard = await boardService.getBoardById(boardId)
        commit({ type: "setCurrBoard", currBoard })
        return currBoard
      } catch (err) {
        console.log("Cannot get currBoard", err)
        throw err
      }
    },
    async getTaskById({ commit }, { boardId, groupId, taskId }) {
      try {
        const currTask = await boardService.getTaskById(
          boardId,
          groupId,
          taskId
        )
        commit({ type: "setCurrTask", currTask })
        return currTask
      } catch (err) {
        console.error("cannot get task", err)
        throw err
      }
    },
    async getGroupById({ commit }, { boardId, groupId }) {
      try {
        const currGroup = await boardService.getGroupById(
          boardId,
          groupId,
        )
        commit({ type: "setCurrGroup", currGroup })
        return currGroup
      } catch (err) {
        console.error("cannot get task", err)
        throw err
      }
    },
    async saveTask(
      { commit, state, dispatch,rootGetters },
      { task = null, taskTitle = "", groupId, boardId, userAction = "" }
    ) {
      let user = rootGetters.loggedInUser
      console.log(user);
      try {
        const currBoard = await boardService.saveTask(
          task,
          taskTitle,
          groupId,
          boardId,
          userAction,
          user
        )

        // commit({ type: "saveTask", savedTask, groupId, boardId })
        commit({ type: "setCurrBoard", currBoard })
      } catch (err) {
        console.log("Cannot save task", err)
        throw err
      }
    },
    async removeTask({ commit }, { taskId, groupId, boardId }) {
      try {
        const currBoard = await boardService.removeTask(taskId, groupId, boardId)
        commit({ type: "setCurrBoard", currBoard })
      } catch (err) {
        console.log("Cannot remove task", err)
        throw err
      }
    },
    async saveGroup(
      { commit, state },
      { group = null, groupId, boardId, subject = null }
    ) {
      boardId = state.currBoard._id
      // async saveGroup({ commit }, { group,groupId, boardId }) {
      try {
        const savedGroup = await boardService.saveGroup(group, boardId, subject)
        commit({ type: "saveGroup", savedGroup })
      } catch (err) {
        console.log("Cannot save group", err)
        throw err
      }
    },
    async saveGroups({ commit, state, dispatch }, { groups, currBoard }) {
      try {
        // Notice! Before it was like mantion above, new code line is runnig without errors code
        // let currBoard = JSON.parse(JSON.stringify(state.currBoard))
        currBoard = JSON.parse(JSON.stringify(currBoard))
        currBoard.groups = groups
        const savedBoard = await boardService.saveBoard(currBoard)
        commit({ type: "setCurrBoard", savedBoard })
        dispatch({ type: "loadBoards" })
      } catch (err) {
        console.log("Cannot save group", err)
        throw err
      }
    },
    async saveTasks({ commit, state, dispatch }, { tasks, groupId, board = null }) {
      try {
        if (board === null) board = state.currBoard
        let group = board.groups.find((group) => group.id === groupId)
        group = JSON.parse(JSON.stringify(group))
        group.tasks = tasks
        commit({ type: "saveGroup", savedGroup: group })
        
        let board = JSON.parse(JSON.stringify(state.currBoard))
        dispatch({ type: "saveBoard", board })


        // setTimeout(() => {
        //   let board = JSON.parse(JSON.stringify(state.currBoard))
        //   dispatch({ type: "saveBoard", board })
        // }, 500);


        //FROM TODAY
        // const boardId = state.currBoard._id
        // let group = state.currBoard.groups.find((group) => group.id === groupId)
        // group = JSON.parse(JSON.stringify(group))
        // group.tasks = tasks
        // const savedGroup = await boardService.saveGroup(group, boardId)

        //OLD
        // let currBoard = JSON.parse( JSON.stringify(state.currBoard))
        // const idx = currBoard.groups.findIndex((group) => group.id === groupId)
        // currBoard.groups[idx].tasks = tasks
        // const savedBoard = await boardService.saveBoard(currBoard)
        // commit({ type: "setCurrBoard", savedBoard })
        // dispatch({type:'loadBoards'})
      } catch (err) {
        console.log("Cannot save group", err)
        throw err
      }
    },
    async removeGroup({ commit }, { groupId, boardId }) {
      try {
        await boardService.removeGroup(groupId, boardId)
        commit({ type: "removeGroup", groupId, boardId })
      } catch (err) {
        console.log("Cannot remove group", err)
        throw err
      }
    },
    async setBoardStyle({ state, dispatch }, { style }) {
      try {
        let board = JSON.parse(JSON.stringify(state.currBoard))
        board.style = style
        dispatch({ type: "saveBoard", board })
      } catch (err) {
        console.log("Cannot change style", err)
        throw err
      }
    },
    async editLabels({ state, dispatch }, { labels }) {
      try {
        let board = JSON.parse(JSON.stringify(state.currBoard))
        board.boardLabels = labels
        dispatch({ type: "saveBoard", board })
      } catch (err) {
        console.log("Cannot change style", err)
        throw err
      }
    },
    // async addActivity({ state, dispatch }, { userAction, savedTask }) {
    //   console.log('userAction', userAction)

    //   try {
    //     let activity = boardService.getEmptyActivity()
    //     activity.txt = userAction || "change"
    //     activity.task.id = savedTask.id
    //     activity.task.title = savedTask.title
    //     // let board = JSON.parse(JSON.stringify(state.currBoard))
    //     // board.activities.unshift(activity)
    //     // dispatch({ type: "saveBoard", board })
    //   } catch (err) {
    //     console.log("Cannot change style", err)
    //     throw err
    //   }
    // },
  },
}

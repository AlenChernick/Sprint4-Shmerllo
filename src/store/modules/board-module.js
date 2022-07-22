import { boardService } from "../../../services/board-service.js"

export default {
  state: {
    boards: [],
    currBoard: {},
    currTask: {},
  },
  getters: {
    getBoards({ boards }) {
      return boards
    },
    getCurrBoard({ currBoard }) {
      // console.log(currBoard);
      return currBoard
    },
    getCurrTask({ currTask }) {
      return currTask
    },
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
    saveGroup(state, { group }) {
      const idx = state.boards.groups.findIndex((g) => g.id === group.id)
      if (idx !== -1) state.boards.splice(idx, 1, board)
      else state.board.push(board)
    },
    saveGroups(state, { groups, boardId }) {
      const idx = state.boards.findIndex((b) => b._id === boardId)
      console.log(groups)
      state.boards[idx].groups = groups
    },
    saveTask(state, { savedTask, groupId, boardId }) {
      // saveTask(state, {newBoards }) {
      // state.boards = newBoards
      // return
      console.log("savedTask, groupId, boardId", savedTask, groupId, boardId)

      const groupIdx = state.currBoard.groups.findIndex(
        (group) => group.id === groupId
      )
      console.log(groupIdx, "groupIdx")
      const taskIdx = state.currBoard.groups[groupIdx].tasks.findIndex(
        (task) => task.id === savedTask.id
      )
      const boardIdx = state.boards.findIndex((board) => board._id === boardId)
      console.log(boardIdx)
      if (taskIdx !== -1) {
        // state.boards[boardIdx].groups[groupIdx].tasks[taskIdx].splice(
        //   taskIdx,
        //   1,
        //   savedTask
        // )
        state.currBoard.groups[groupIdx].tasks.splice(taskIdx, 1, savedTask)
      } else {
        // console.log(state.boards[boardIdx].groups[groupIdx].tasks)
        // state.boards[boardIdx].groups[groupIdx].tasks.push(savedTask)
        state.currBoard.groups[groupIdx].tasks.push(savedTask)
      }
    },
    // removeTask(state, { taskId }){

    // }\

    removeGroup(state, { groupId, boardId }) {
      console.log("removeGroup mutation", groupId, boardId)
      const boardIdx = state.boards.findIndex((board) => board._id === boardId)
      const groupIdx = state.boards[boardIdx].groups.findIndex(
        (group) => group.id === groupId
      )
      console.log("boardIdx", boardIdx)
      console.log("groupIdx", groupIdx)

      state.boards[boardIdx].groups.splice(groupIdx, 1)
      state.currBoard = state.boards[boardIdx]
      console.log(state.currBoard) 

      // console.log(state.currBoard.groups)
      // state.currBoard.groups.splice(groupIdx, 1)
      // console.log(state.currBoard.groups)
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
        console.log(currBoard);
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
    async saveTask(
      { commit, state },
      { task = null, groupId, boardId = null }
    ) {
      if (boardId === null)
        boardId = JSON.parse(JSON.stringify(state.currBoard._id))
      console.log(task, groupId, boardId)
      try {
        const savedTask = await boardService.saveTask(task, groupId, boardId)
        // const newBoards = await boardService.saveTask(task, groupId, boardId)

        commit({ type: "saveTask", savedTask, groupId, boardId })
        // commit({ type: "saveTask", newBoards })
      } catch (err) {
        console.log("Cannot save task", err)
        throw err
      }
    },
    async removeTask({ commit }, { taskId, groupId, boardId }) {
      console.log(taskId, groupId, boardId)
      try {
        await boardService.removeTask(taskId, groupId, boardId)

        // commit({ type: "removeBoard", id })
      } catch (err) {
        console.log("Cannot remove task", err)
        throw err
      }
    },
    async saveGroup({ commit }, { groupId, boardId }) {
      try {
        console.log(groupId)
        const savedGroup = await boardService.saveGroup(groupId, boardId)
        commit({ type: "saveGroup", savedGroup })
      } catch (err) {
        console.log("Cannot save group", err)
        throw err
      }
    },
    async saveGroups({ commit, state, dispatch }, { groups }) {
      try {
        console.log("store", state.currBoard)
        let currBoard = JSON.parse(JSON.stringify(state.currBoard))
        currBoard.groups = groups
        const savedBoard = await boardService.saveBoard(currBoard)
        commit({ type: "setCurrBoard", savedBoard })
        dispatch({ type: "loadBoards" })
      } catch (err) {
        console.log("Cannot save group", err)
        throw err
      }
    },
    async saveTasks({ commit, state, dispatch }, { tasks, groupId }) {
      try {
        console.log("store saveTasks", tasks, groupId)
        const boardId = state.currBoard._id
        let group = state.currBoard.groups.find((group) => group.id === groupId)
        console.log("store group before change", group)
        group = JSON.parse(JSON.stringify(group))
        group.tasks = tasks
        console.log("store group after change", group)
        const savedGroup = await boardService.saveGroup(group, boardId)
        console.log(savedGroup)

        // let currBoard = JSON.parse( JSON.stringify(state.currBoard))
        // const idx = currBoard.groups.findIndex((group) => group.id === groupId)
        // currBoard.groups[idx].tasks = tasks
        // console.log(currBoard)
        // const savedBoard = await boardService.saveBoard(currBoard)
        // console.log(savedBoard)
        // commit({ type: "setCurrBoard", savedBoard })
        // dispatch({type:'loadBoards'})
      } catch (err) {
        console.log("Cannot save group", err)
        throw err
      }
    },
    async removeGroup({ commit }, { groupId, boardId }) {
      try {
        let answer = await boardService.removeGroup(groupId, boardId)
        console.log(answer)
        commit({ type: "removeGroup", groupId, boardId })
      } catch (err) {
        console.log("Cannot remove group", err)
        throw err
      }
    },
    async setBoardStyle({ state, dispatch }, { style }) {
      console.log(style)
      try {
        let board = JSON.parse(JSON.stringify(state.currBoard))
        console.log(board)
        board.style = style
        dispatch({ type: "saveBoard" , board})
      } catch (err) {
        console.log("Cannot change style", err)
        throw err
      }
    },


  },
}

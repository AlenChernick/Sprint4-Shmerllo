import { boardService } from "../../../services/board-service.js"

export default {
  state: {
    boards: [],
    currBoard: null,
  },
  getters: {
    getBoards({ boards }) {
      return boards
    },
    getCurrBoard({ currBoard }) {
      return currBoard
    },
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    removeBoard(state, { id }) {
      const idx = state.boards.findIndex((board) => board._id === id)
      state.boards.splice(idx, 1)
    },
    saveBoard(state, { board }) {
      const idx = state.boards.findIndex(
        (currBoard) => currBoard._id === board_.id
      )
      if (idx !== -1) state.boards.splice(idx, 1, board)
      else state.board.puse(board)
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
        await boardService.remove(id)
        commit({ type: "removeBoard", id })
      } catch (err) {
        console.log("Cannot remove board", err)
        throw err
      }
    },
    async saveBoard({ commit }, { board }) {
      try {
        const savedBoard = await boardService.save(board)
        commit({ type: "saveBoard", savedBoard })
      } catch (err) {
        console.log("Cannot save board", err)
        throw err
      }
    },
  },
}

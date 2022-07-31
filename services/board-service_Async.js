import { utilService } from "./util-service.js"
import { httpService } from "./http.service"
import { socketService, SOCKET_EVENT_BOARD_UPDATED } from "./socket.service"
import { userService } from "./user-service.js"

import Axios from "axios"
const axios = Axios.create({ withCredentials: true }) //withCredentials???

// const STORAGE_KEY = "board_db"
// const TASK = "task"  ..not in use?
// _createBoards()

export const boardService = {
  query,
  getBoardById,
  saveBoard,
  newBoard,
  removeBoard,
  // getEmptyBoard,
  getGroupById,
  saveGroup,
  getTaskById,
  saveTask,
  removeTask,
  removeGroup,
  coverOptions,
  getEmptyActivity,
  addTodo,
  addCheckList,
  removeCheckList,
}

//get boards
async function query() {
  try {
    return await httpService.get("board")
    // return await httpService.get('board',filterBy)
  } catch (err) {
    throw err
  }

  // return storageService.query(STORAGE_KEY)
}

//board level functions
async function getBoardById(boardId) {
  try {
    return await httpService.get(`board/${boardId}`)
  } catch (err) {
    throw err
  }
  // return storageService.get(STORAGE_KEY, boardId)
}

async function removeBoard(boardId) {
  try {
    return await httpService.delete(`board/${boardId}`)
  } catch (err) {
    throw err
  }
  // return storageService.remove(STORAGE_KEY, boardId)
}

async function saveBoard(board) {
  try {
    if (board._id) {
      // console.log('with id');
      const savedBoard = await httpService.put(`board/${board._id}`, board)
      socketService.emit(SOCKET_EVENT_BOARD_UPDATED, savedBoard)
      return savedBoard
    } else {
      return await httpService.post(`board`, board)
    }

  } catch (err) {
    throw err
  }

  // if (board._id) {
  //   return storageService.put(STORAGE_KEY, board)
  // } else {
  //   return storageService.post(STORAGE_KEY, board)
  // }
}

async function newBoard(properties, user) {
  try {
    const board = _createNewBoard(properties, user)
    saveBoard(board)
  } catch (err) {
    console.log("Cannot add board")
    throw err
  }
}

//group level functions
async function getGroupById(boardId, groupId) {
  let board
  try {
    board = await httpService.get(`board/${boardId}`)
    const group = board.groups.find((group) => group.id === groupId)
    return group
  } catch (err) {
    console.log("cant get board")
    throw err
  }
}

async function saveGroup(group, boardId, subject) {
  if (!group) {
    group = _getEmptyGroup()
    group.title = subject
  }

  try {
    //GET BOARD
    let board = await getBoardById(boardId)

    //addgroup
    if (!group.id) {
      group.id = utilService.makeId()
      board.groups.push(group)
    }

    // or update group
    else {
      const groupIdx = board.groups.findIndex((g) => g.id === group.id)
      board.groups.splice(groupIdx, 1, group)
    }

    await saveBoard(board)

    const savedGroup = getGroupById(boardId, group.id)

    return savedGroup
  } catch (err) {
    console.log("cannot save Group", err)
    throw err
  }
}

async function removeGroup(groupId, boardId) {
  try {
    //GET BOARD
    let board = await getBoardById(boardId)

    //remove group
    const groupIdx = board.groups.findIndex((g) => g.id === groupId)
    board.groups.splice(groupIdx, 1)

    return await saveBoard(board)

    // return "removed"
  } catch (err) {
    console.log("cannot remove Group", err)
    throw err
  }
}

//task level functions:

async function getTaskById(boardId, groupId, taskId) {
  try {
    const board = await getBoardById(boardId)
    const group = board.groups.find((group) => group.id === groupId)
    const task = group.tasks.find((task) => task.id === taskId)
    return task
  } catch (err) {
    console.log("cannot get task by id")
    throw err
  }
}

async function saveTask(task, taskTitle, groupId, boardId, userAction, user) {
  if (task === null) {
    task = _createTask()
    task.title = taskTitle
  }
  try {
    //GET BOARD
    let board = await getBoardById(boardId)
    // console.log(board)

    //DET GROUP
    let group = await getGroupById(boardId, groupId)
    // console.log(group)

    //addTask
    if (!task.id) {
      task.id = utilService.makeId()
      group.tasks.push(task)
    }
    // or update task
    else {
      const taskIdx = group.tasks.findIndex((t) => t.id === task.id)
      group.tasks.splice(taskIdx, 1, task)
    }

    //update group
    const groupIdx = board.groups.findIndex((g) => g.id === groupId)
    board.groups.splice(groupIdx, 1, group)

    board = addActivity(board, task, userAction, user)
    return await saveBoard(board)

  } catch (err) {
    console.log("cannot save task", err)
    throw err
  }
}

async function removeTask(taskId, groupId, boardId) {
  // console.log(groupId, boardId, taskId)

  try {
    //GET BOARD
    let board = await getBoardById(boardId)

    //DET GROUP
    let group = await getGroupById(boardId, groupId)

    const taskIdx = group.tasks.findIndex((t) => t.id === taskId)
    group.tasks.splice(taskIdx, 1)

    //update group
    const groupIdx = board.groups.findIndex((g) => g.id === groupId)
    board.groups.splice(groupIdx, 1, group)

    return await saveBoard(board)
  } catch (err) {
    console.log("cannot remove task", err)
    throw err
  }
}

function addActivity(board, task, userAction, user) {
  let activity = getEmptyActivity(user)
  activity.txt = userAction || "change"
  activity.task.id = task.id
  activity.task.title = task.title
  board.activities.unshift(activity)
  // console.log(activity)
  return board
}

async function addTodo(task, groupId, checkListId, todoTitle, board) {
  try {
    const groupIdx = board.groups.findIndex((group) => group.id === groupId)
    const taskIdx = board.groups[groupIdx].tasks.findIndex((t) => t.id === task.id)
    const checkListIdx = task.checklists.findIndex((checkList) => checkList.id === checkListId)
    let todo = getEmptyTodo()
    todo.title = todoTitle
    await board.groups[groupIdx].tasks[taskIdx].checklists[checkListIdx].todos.push(todo)
    await saveBoard(board)
    return todo
  } catch (err) {
    console.log("Cannot add todo", err)
    throw err
  }
}

async function addCheckList(task, groupId, board, checkListTitle) {
  try {
    const groupIdx = board.groups.findIndex((group) => group.id === groupId)
    const taskIdx = board.groups[groupIdx].tasks.findIndex((t) => t.id === task.id)
    let checkList = getEmptyCheckList()
    checkList.title = checkListTitle
    // await board.groups[groupIdx].tasks[taskIdx].checklists.push(checkList)
    board.groups[groupIdx].tasks[taskIdx].checklists.push(checkList)
    await saveBoard(board)
    return checkList
  } catch (err) {
    console.log("Cannot add checklist", err)
    throw err
  }
}

async function removeCheckList(task, groupId, board, checkListId) {
  try {
    const groupIdx = board.groups.findIndex((group) => group.id === groupId)
    const taskIdx = board.groups[groupIdx].tasks.findIndex((t) => t.id === task.id)
    const checkListIdx = task.checklists.findIndex((checkList) => checkList.id === checkListId)
    // await board.groups[groupIdx].tasks[taskIdx].checklists.splice(
    //   checkListIdx,
    //   1
    // )
    board.groups[groupIdx].tasks[taskIdx].checklists.splice(checkListIdx, 1)
    await saveBoard(board)
    return board.groups[groupIdx].tasks[taskIdx]
  } catch (err) {
    console.log("Cannot remove checklist", err)
    throw err
  }
}

// function _createBoards() {
//   let boards = utilService.loadFromStorage(STORAGE_KEY)
//   if (!boards || !boards.length) {
//     boards = [
//       _createBoard("My first Board"),
//       _createBoard("My Second Board"),
//       _createBoard("My Third Board"),
//       _createBoard("My firth Board"),
//     ]
//     utilService.saveToStorage(STORAGE_KEY, boards)
//   }
// return boards
// }

// function _createBoard(title) {
//   const board = getEmptyBoard()
//   board._id = utilService.makeId()
//   board.title = title
//   //   board.style.bgImgUrl = imgUrls.pop()
//   return board
// }

function _createTask() {
  return {
    status: "",
    description: "",
    comments: [],
    checklists: [],
    labelIds: [],
    attachments: [],
    createdAt: Date.now(),
    dueDate: "",
    byMember: {
      id: "m102",
      username: "AK",
      fullname: "Alon Kolker",
      imgUrl: "../assets/img/AK.jpg",
      createdAt: "2021-12-11T10:01:48.000Z",
    },
    members: [],
    style: {
      bgColor: "",
      bgImgUrl: "",
    },
  }
}
function _getEmptyGroup() {
  return {
    id: null,
    title: "",
    archivedAt: Date.now(),
    description: " ",
    type: "draggable",
    tasks: [],
    style: {},
  }
}


function _createNewBoard(properties, user) {
  if (!user) {
    user = {
      _id: 111,
      username: "Guest",
      fullname: "Guest",
      imgUrl: "https://www.computerhope.com/jargon/g/guest-user.jpg",
    }
  }



  return {
    title: properties.title,
    style: {
      bgImgUrl: properties.style.bgImgUrl,
      bgColor: properties.style.bgColor,
    },
    members: [
    ],
    groups: [ {
      "id" : "G37tGgx7",
      "title" : "My first board! 😎",
      "archivedAt" : '',
      "description" : " ",
      "type" : "draggable",
      "tasks" : [
          {
              "status" : "",
              "description" : "",
              "comments" : [

              ],
              "checklists" : [

              ],
              "labelIds" : [

              ],
              "attachments" : [

              ],
              "createdAt" :Date.now(),
              "dueDate" : "",
              "byMember" : {
                  "_id" : user._id,
                  "username" :user.username,
                  "fullname" : user.fulllname,
                  "imgUrl" : user.imgUrl,
                  "createdAt" :Date.now()
              },
              "members" : [

              ],
              "style" : {
                  "bgColor" : "",
                  "bgImgUrl" : ""
              },
              "title" : "Hello!",
              "id" : "32ZfUpiD"
          },
          {
              "status" : "",
              "description" : "",
              "comments" : [

              ],
              "checklists" : [

              ],
              "labelIds" : [

              ],
              "attachments" : [

              ],
              "createdAt" : Date.now(),
              "dueDate" : "",
              "byMember" : {
                  "_id" : user._id,
                  "username" : user.username,
                  "fullname" : user.fullname,
                  "imgUrl" : user.imgUrl,
                  "createdAt" :Date.now()
              },
              "members" : [

              ],
              "style" : {
                  "bgColor" : "",
                  "bgImgUrl" : ""
              },
              "title" : "Shmerllo app will improve your team productivity👍",
              "id" : "6RCBb3wO"
          }
      ],
      "style" : {

      }
  }],

    byMember: {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
      createdAt: Date.now(),
    },
    isDemoBoard: true,
    isFavorite: false,
    activityCount: 0,
    lastActivity: Date.now(),
    boardLabels: _labelOptions(),
    isLabelsOpen: false,
    activities:[],
    members : [
      {
          "_id" : "62e4266dff763f0b995957a9",
          "username" : "THT",
          "fullname" : "Tal Hammer Topaz",
          "imgUrl" : "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512"
      },
      {
          "_id" : "62e4267aff763f0b995957aa",
          "username" : "AK",
          "fullname" : "Alon Kolker",
          "imgUrl" : "https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512"
      },
      {
          "_id" : "62e4267eff763f0b995957ab",
          "username" : "AC",
          "fullname" : "Alen  Chernick",
          "imgUrl" : "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512"
      },
      {
          "_id" : "62e42686ff763f0b995957ac",
          "username" : "LS",
          "fullname" : "Lihi Sered",
          "imgUrl" : "https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512"
      }
  ],
  }
}

function getEmptyTodo() {
  return {
    id: utilService.makeId(),
    title: "",
    isDone: false,
  }
}

function getEmptyCheckList() {
  return {
    id: utilService.makeId(),
    title: "",
    todos: [],
  }
}

function getEmptyActivity(user) {
  if (!user) {
    user = {
      id: 111,
      username: "Guest",
      fullname: "Guest",
      imgUrl: "https://www.computerhope.com/jargon/g/guest-user.jpg",
    }
  }
  return {
    id: utilService.makeId(),
    txt: "",
    createdAt: Date.now(),
    byMember: user,
    task: {},
  }
}

function coverOptions() {
  return {
    coverColors: ["#277da1", "#4d908e", "#fb6f92", "#90be6d", "#f9c74f", "#f9844a", "#00b4d8", "#3a5a40"],
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
    ],
  }
}

function _labelOptions() {
  return [
    {
      id: "l101",
      bgColor: "#e63946",
      txt: "Urgent",
    },
    {
      id: "l102",
      bgColor: "#2a9d8f",
      txt: "Important",
    },
    {
      id: "l103",
      bgColor: "#e9c46a",
      txt: "New",
    },
    {
      id: "l104",
      bgColor: "#48cae4",
      txt: "Nice to have",
    },
    {
      id: "l106",
      bgColor: "#adc178",
      txt: "Delayed",
    },
    {
      id: "l107",
      bgColor: "#9c89b8",
      txt: "In progress",
    },
    {
      id: "l108",
      bgColor: "#0ead69",
      txt: "Done",
    },
    {
      id: "l109",
      bgColor: "#16697a",
      txt: "Do not forget",
    },
    {
      id: "l110",
      bgColor: "#70e000",
      txt: "Bug",
    },
    {
      id: "l111",
      bgColor: "#00a8e8",
      txt: "Take care today",
    },
  ]
}

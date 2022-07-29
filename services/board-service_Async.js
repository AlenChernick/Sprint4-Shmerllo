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
      console.log("big nono ")

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
  console.log(activity)
  return board
}

async function addTodo(task, groupId, checkListId, todoTitle, board) {
  try {
    const groupIdx = board.groups.findIndex((group) => group.id === groupId)
    const taskIdx = board.groups[groupIdx].tasks.findIndex(
      (t) => t.id === task.id
    )
    const checkListIdx = task.checklists.findIndex(
      (checkList) => checkList.id === checkListId
    )
    let todo = getEmptyTodo()
    todo.title = todoTitle
    await board.groups[groupIdx].tasks[taskIdx].checklists[
      checkListIdx
    ].todos.push(todo)
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
    const taskIdx = board.groups[groupIdx].tasks.findIndex(
      (t) => t.id === task.id
    )
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
    const taskIdx = board.groups[groupIdx].tasks.findIndex(
      (t) => t.id === task.id
    )
    const checkListIdx = task.checklists.findIndex(
      (checkList) => checkList.id === checkListId
    )
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

// function getEmptyBoard() {
//   return {
//     _id: "",
//     title: "",
//     style: {
//       bgImgUrl:
//         "https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg",
//       bgColor: "",
//     },
//     members: [
//       {
//         id: "m101",
//         username: "THT",
//         fullname: "Tal Hammer Topaz",
//         imgUrl:
//           "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512",
//         createdAt: "2021-12-11T10:01:48.000Z",
//       },
//       {
//         id: "m102",
//         username: "AK",
//         fullname: "Alon Kolker",
//         imgUrl:
//           "https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512",
//         createdAt: "2021-12-11T10:01:48.000Z",
//       },
//       {
//         id: "m103",
//         username: "AC",
//         fullname: "Alen Alen Chernick",
//         imgUrl:
//           "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512",
//         createdAt: "2021-12-11T10:01:48.000Z",
//       },
//       {
//         id: "m104",
//         username: "LS",
//         fullname: "Lihi Sered",
//         imgUrl:
//           "https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512",
//         createdAt: "2021-12-11T10:01:48.000Z",
//       },
//     ],
//     groups: [
//       {
//         id: "g101",
//         title: "First steps",
//         archivedAt: 1589983468418,
//         description:
//           "Organization and order, opening folders, dividing tasks, who is strong in what and more.",
//         type: "draggable",
//         tasks: [
//           {
//             id: "c101",
//             title: "Replace logo",
//             status: "",
//             description: "",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             labelIds: [],
//             attachments: ["https://augnitive.com/wp-content/uploads/2019/09/Fundamentals-of-JavaScript-Part-2.png","https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/07/23090714/nature-1024x682.jpeg","https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/07/23090714/nature-1024x682.jpeg"],
//             createdAt: 1590999730348,
//             dueDate: "2022-07-31T07:28:00.000Z",
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c102",
//             title: "Fonts and color vars",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c131",
//             title: "Make playpack",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,

//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c132",
//             title: "Add PerfectPixel to chorme",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: ["https://augnitive.com/wp-content/uploads/2019/09/Fundamentals-of-JavaScript-Part-2.png","https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/07/23090714/nature-1024x682.jpeg","https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/07/23090714/nature-1024x682.jpeg","https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/07/23090714/nature-1024x682.jpeg"],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c133",
//             title: "Find Trello project for reference",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c134",
//             title: "Collect& build demo data ",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//         ],
//         style: {
//           bgImgUrl:
//             "https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg",
//         },
//       },
//       {
//         id: "g102",
//         title: "Views",
//         tasks: [
//           {
//             id: "c103",
//             title: "Page ruler",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: ["https://augnitive.com/wp-content/uploads/2019/09/Fundamentals-of-JavaScript-Part-2.png",],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: "2023-09-31T07:28:00.000Z",
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl:
//                 "https://miro.medium.com/max/1400/1*P_H_UpQahH0juwQpXWXnpQ.jpeg",
//             },
//           },
//           {
//             id: "c120",
//             title: "Board Details",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c121",
//             title: "task list",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c122",
//             title: "Task list - important!",
//             status: "",
//             description:
//               "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.  ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c123",
//             title: "InterActive homepage",
//             status: "",
//             description:
//               "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.  ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: "2022-04-14T07:28:00.000Z",
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c124",
//             title: "Login page",
//             status: "",
//             description: "Curabitur tortor. Pellentesque nibh. Aenean quam. ",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: ["https://augnitive.com/wp-content/uploads/2019/09/Fundamentals-of-JavaScript-Part-2.png","|https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/07/23090714/nature-1024x682.jpeg",],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c104",
//             title: "Some stuff we need to do and its alot of stuff",
//             status: "in-progress",
//             description:
//               "hgfkgf Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.  hjkgfkjhv khjghlb opup iojnm ytreuyteyitufvbn ",
//             comments: [
//               {
//                 id: "ZdPnm",
//                 txt: "also @yaronb please CR this",
//                 createdAt: 1590999817436.0,
//                 byMember: {
//                   _id: "u101",
//                   fullname: "Tal Tarablus",
//                   imgUrl:
//                     "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                 },
//               },
//             ],
//             checklists: [
//               {
//                 id: "YEhmF",
//                 title: "Checklist",
//                 todos: [
//                   {
//                     id: "212jX",
//                     title: "To Do 1",
//                     isDone: false,
//                   },
//                 ],
//               },
//             ],
//             checklistsIsDone: false,
//             memberIds: ["m101", "m102", "m103", "m104"],
//             labelIds: ["l101", "l102"],
//             attachments: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m101",
//               username: "THT",
//               fullname: "Tal Hammer Topaz",
//               imgUrl:
//                 "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512",
//             },
//             members: [
//               {
//                 id: "m101",
//                 username: "THT",
//                 fullname: "Tal Hammer Topaz",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512",
//               },
//               {
//                 id: "m102",
//                 username: "AK",
//                 fullname: "Alon Kolker",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512",
//               },
//               {
//                 id: "m103",
//                 username: "AC",
//                 fullname: "Alen Alen Chernick",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512",
//               },
//               {
//                 id: "m104",
//                 username: "LS",
//                 fullname: "Lihi Sered",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512",
//               },
//             ],
//             style: {
//               bgColor: "#26de81",
//               bgImgUrl:
//                 "https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg",
//             },
//           },
//         ],
//         style: {
//           bgImgUrl:
//             "https://imageio.forbes.com/blogs-images/forbestechcouncil/files/2019/01/canva-photo-editor-8-7.jpg?format=jpg&width=960",
//         },
//       },
//       {
//         id: "g103",
//         title: "Components",
//         archivedAt: 1589983468418,
//         type: "draggable",
//         tasks: [
//           {
//             id: "c105",
//             title: "app-header",
//             status: "",
//             description: "",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c106",
//             title: "footer is not fot us",
//             status: "",
//             description: "",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: "2024-07-11T07:28:00.000Z",
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//         ],
//         style: {},
//       },

//       {
//         id: "g122",
//         title: "CSS&SCSS",
//         tasks: [
//           {
//             id: "c107",
//             title: "Open master asi notes",
//             status: "",
//             description: "",
//             comments: [],
//             checklists: [],
//             checklistsIsDone: false,
//             attachments: [],
//             labelIds: [],
//             createdAt: 1590999730348,
//             dueDate: "2020-07-25T07:28:00.000Z",
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [],
//             style: {
//               bgColor: "",
//               bgImgUrl: "",
//             },
//           },
//           {
//             id: "c108",
//             title: "mixins-how, when and when todo",
//             status: "in-progress",
//             attachments: [],
//             description:
//               "Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus. ",
//             comments: [
//               {
//                 id: "ZdPnm",
//                 txt: "also @yaronb please CR this",
//                 createdAt: 1590999817436.0,
//                 byMember: {
//                   _id: "u101",
//                   fullname: "Tal Tarablus",
//                   imgUrl:
//                     "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                 },
//               },
//             ],
//             checklists: [
//               {
//                 id: "YEhmF",
//                 title: "Checklist",
//                 todos: [
//                   {
//                     id: "212jX",
//                     title: "To Do 1",
//                     isDone: false,
//                   },
//                 ],
//               },
//             ],
//             checklistsIsDone: false,

//             memberIds: ["u101"],
//             labelIds: ["l101", "l102"],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [
//               {
//                 id: "m101",
//                 username: "THT",
//                 fullname: "Tal Hammer Topaz",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512",
//               },
//               {
//                 id: "m102",
//                 username: "AK",
//                 fullname: "Alon Kolker",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512",
//               },
//               {
//                 id: "m103",
//                 username: "AC",
//                 fullname: "Alen Alen Chernick",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512",
//               },
//               {
//                 id: "m104",
//                 username: "LS",
//                 fullname: "Lihi Sered",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512",
//               },
//             ],
//             style: {
//               bgColor: "#26de81",
//               bgImgUrl:
//                 "data:image/jpeg;base64,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",
//             },
//           },
//           {
//             id: "c126",
//             title: "Basic layout",
//             status: "in-progress",
//             description:
//               "Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus. ",
//             comments: [
//               {
//                 id: "ZdPnm",
//                 txt: "also @yaronb please CR this",
//                 createdAt: 1590999817436.0,
//                 byMember: {
//                   _id: "u101",
//                   fullname: "Tal Tarablus",
//                   imgUrl:
//                     "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                 },
//               },
//             ],
//             checklists: [
//               {
//                 id: "YEhmF",
//                 title: "Checklist",
//                 todos: [
//                   {
//                     id: "212jX",
//                     title: "To Do 1",
//                     isDone: false,
//                   },
//                 ],
//               },
//             ],
//             checklistsIsDone: false,

//             memberIds: ["u101"],
//             labelIds: ["l101", "l102"],
//             attachments: [],
//             createdAt: 1590999730348,
//             dueDate: '',
//             byMember: {
//               id: "m102",
//               username: "AK",
//               fullname: "Alon Kolker",
//               imgUrl: "../assets/img/AK.jpg",
//               createdAt: "2021-12-11T10:01:48.000Z",
//             },
//             members: [
//               {
//                 id: "m101",
//                 username: "THT",
//                 fullname: "Tal Hammer Topaz",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512",
//               },
//               {
//                 id: "m102",
//                 username: "AK",
//                 fullname: "Alon Kolker",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512",
//               },
//               {
//                 id: "m103",
//                 username: "AC",
//                 fullname: "Alen Alen Chernick",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512",
//               },
//               {
//                 id: "m104",
//                 username: "LS",
//                 fullname: "Lihi Sered",
//                 imgUrl:
//                   "https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512",
//               },
//             ],
//             style: {
//               bgColor: "#26de81",
//               bgImgUrl:
//                 "https://www.tutorialspoint.com/css/images/responsive.jpg",
//             },
//           },
//         ],
//         style: {},
//       },
//     ],
//     activities: [
//       {
//         id: "a101",
//         txt: "Changed Color",
//         createdAt: 1589983468418,
//         byMember: {
//           id: "m103",
//           username: "AC",
//           fullname: "Alen Chernick",
//           imgUrl:
//             "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512",
//         },
//         task: {
//           id: "c101",
//           title: "Replace Logo",
//         },
//       },
//       {
//         id: "a102",
//         txt: "did something",
//         createdAt: 1589983468418,
//         byMember: {
//           id: "m102",
//           username: "AK",
//           fullname: "Alon Kolker",
//           imgUrl:
//             "https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512",
//         },
//         task: {
//           id: "c103",
//           title: "Replace Logo",
//         },
//       },
//       {
//         id: "a104",
//         txt: "did something else",
//         createdAt: 1589983468418,
//         byMember: {
//           id: "m101",
//           username: "THT",
//           fullname: "Tal Hammer Topaz",
//           imgUrl:
//             "https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512",
//         },
//         task: {
//           id: "c101",
//           title: "Replace Logo",
//         },
//       },
//       {
//         id: "a105",
//         txt: "and another thing",
//         createdAt: 1589983468418,
//         byMember: {
//           id: "m104",
//           username: "LS",
//           fullname: "Lihi Sered",
//           imgUrl:
//             "https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512",
//         },
//         task: {
//           id: "c101",
//           title: "Replace Logo",
//         },
//       },
//     ],
//     isDemoBoard: true,
//     byMember: {
//       id: "m102",
//       username: "AK",
//       fullname: "Alon Kolker",
//       imgUrl: "../assets/img/AK.jpg",
//       createdAt: "2021-12-11T10:01:48.000Z",
//     },
//     isFavorite: true,
//     activityCount: 0,
//     lastActivity: 1658239902711,
//     boardLabels: _labelOptions(),
//     isLabelsOpen: false,
//   }
// }

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
      id: "Guest",
      username: "Guest",
      fullname: "Guest",
      imgUrl:
        "https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512",
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
    coverColors: [
      "#277da1",
      "#4d908e",
      "#fb6f92",
      "#90be6d",
      "#f9c74f",
      "#f9844a",
      "#00b4d8",
      "#3a5a40",
    ],
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
      txt: "Take care togay",
    },
  ]
}

import { createConditionalExpression } from '@vue/compiler-core'
import { storageService } from './storage-service.js'
import { utilService } from './util-service.js'


const STORAGE_KEY = 'board_db'
const TASK = 'task'

_createBoards()


export const boardService = {
    query,
    removeBoard,
    saveBoard,
    getBoardById,
    getEmptyBoard,
    getTaskById,
    saveTask,
    getGroupById
}

//get boards
function query() {
    return storageService.query(STORAGE_KEY)

}

//board level functions
function getBoardById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

function removeBoard(boardId) {
    return storageService.remove(STORAGE_KEY, boardId)
}

function saveBoard(board) {
    if (board._id) {
        return storageService.put(STORAGE_KEY, board)
    } else {
        return storageService.post(STORAGE_KEY, board)
    }
}


//group level functions
async function getGroupById(boardId, groupId){
    const board = await getBoardById(boardId)
    const group = board.groups.find((group) => group.id === groupId)
    return group
    
}


//task level functions
async function getTaskById(boardId, groupId, taskId){
    const board = await getBoardById(boardId)
    const group = board.groups.find((group) => group.id === groupId)
    const task = group.tasks.find((task) => task.id === taskId)
    return task
    
}


// async function saveTask(task, groupId, boardId){
//     console.log(groupId, boardId, task)
    
//     //GET BOARD
//     const board = await getBoardById(boardId)
    
//     //TODO replace task

//     const taskIdx = group.tasks.find((task) => task.id === taskId)

//     const savedBoard = saveBoard(board)

//     const savedTask = getTaskById(boardId, groupId, task.id)
//     return savedTask
// }



function _createBoards() {
    let boards = utilService.loadFromStorage(STORAGE_KEY)
    if (!boards || !boards.length) {
        boards = [
            _createBoard('First Demo Board'),
            _createBoard('Seconed Demo Board'),
            _createBoard('Third Demo Board'),
        ]
        utilService.saveToStorage(STORAGE_KEY, boards)
    }
    // return boards
}


function _createBoard(title) {
    const board = getEmptyBoard()
    board._id = utilService.makeId()
    board.title = title
    return board
}


function getEmptyBoard() {
    return {
        _id: '',
        title: '',
        // style: {
        //     type: '',
        // backgroundImage: url('https://www.nestle.com/sites/default/files/styles/da_vinci_header_hero_desktop/public/2022-02/sustainability-nature-forest-river-article-header-fw.jpg?h=a612ed85&itok=1mqqgg1L'),
        //     backgroundThumb: url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE5MzB8MHwxfHNlYXJjaHwzfHxjb2Rpbmd8ZW58MHx8fHwxNjQyMzU4NjIz&ixlib=rb-1.2.1&q=80&w=200'),
        //     isDark: true,
        //     customImages: []
        // },
        members: [
            {
                _id: '',
                username: '',
                fullname: '',
                // imgUrl: 'https://lh3.googleusercontent.com/a-/AOh14GiJ70ctVlIg29JncAhgQTH6Jo22NtXQNdT5LK4u=s96-c',
                createdAt: '2021-12-11T10:01:48.000Z'
            },
        ],
        groups: [
            {
                id: 'g101',
                title: '',
                archivedAt: 1589983468418,
                tasks: [
                    {
                        id: 'c101',
                        title: 'Replace logo'
                    },
                    {
                        id: 'c102',
                        title: 'Add Samples'
                    }
                ],
                style: {}
            },
            {
                id: 'g102',
                title: 'Group 2',
                tasks: [
                    {
                        id: 'c103',
                        title: 'Do that',
                        archivedAt: 1589983468418,
                    },
                    {
                        id: 'c104',
                        title: 'Help me',
                        status: 'in-progress',
                        description: 'description',
                        comments: [
                            {
                                id: 'ZdPnm',
                                txt: 'also @yaronb please CR this',
                                createdAt: 1590999817436.0,
                                byMember: {
                                    _id: 'u101',
                                    fullname: 'Tal Tarablus',
                                    imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg'
                                }
                            }
                        ],
                        checklists: [
                            {
                                id: 'YEhmF',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: '212jX',
                                        title: 'To Do 1',
                                        isDone: false
                                    }
                                ]
                            }
                        ],
                        memberIds: ['u101'],
                        labelIds: ['l101', 'l102'],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember: {
                            _id: 'u101',
                            username: 'Tal',
                            fullname: 'Tal Tarablus',
                            imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg'
                        },
                        style: {
                            bgColor: '#26de81'
                        }
                    }
                ],
                style: {}
            }
        ],
        activities: [
            {
                id: 'a101',
                txt: 'Changed Color',
                createdAt: 154514,
                byMember: {
                    _id: 'u101',
                    fullname: 'Abi Abambi',
                    imgUrl: 'http://some-img'
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo'
                }
            }
        ],
        isDemoBoard: true,
        isFavorite: true,
        activityCount: 0,
        lastActivity: 1658239902711
    };
}


function _getDemoTask(){
    return   {
        id: 'c104',
        title: 'Help me',
        status: 'in-progress',
        description: 'description',
        comments: [
            {
                id: 'ZdPnm',
                txt: 'also @yaronb please CR this',
                createdAt: 1590999817436.0,
                byMember: {
                    _id: 'u101',
                    fullname: 'Tal Tarablus',
                    imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg'
                }
            }
        ],
        checklists: [
            {
                id: 'YEhmF',
                title: 'Checklist',
                todos: [
                    {
                        id: '212jX',
                        title: 'To Do 1',
                        isDone: false
                    }
                ]
            }
        ],
        memberIds: ['u101'],
        labelIds: ['l101', 'l102'],
        createdAt: 1590999730348,
        dueDate: 16156215211,
        byMember: {
            _id: 'u101',
            username: 'Tal',
            fullname: 'Tal Tarablus',
            imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg'
        },
        style: {
            bgColor: '#26de81'
        }
    }
}
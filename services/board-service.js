import { createConditionalExpression } from '@vue/compiler-core'
import { storageService } from './storage-service.js'
import { utilService } from './util-service.js'


const STORAGE_KEY = 'board_db'
const TASK = 'task'

_createBoards()


export const boardService = {
    query,
    getBoardById,
    saveBoard,
    removeBoard,
    getEmptyBoard,
    getGroupById,
    saveGroup,
    getTaskById,
    saveTask,
    removeTask,
    removeGroup,
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



async function saveGroup(group, boardId){
    console.log(group, boardId)

    try{
    //GET BOARD
    let board = await getBoardById(boardId)

    //addgroup
    if(!group.id){
        group.id = utilService.makeId()
        board.groups.push(group)
    }

    // or update group
    else{
        const groupIdx = board.groups.findIndex((g)=> g.id === group.id )
        board.groups.splice(groupIdx, 1, group)
    }
    
    await saveBoard(board)

    const savedGroup = getGroupById(boardId, group.id)
    return savedGroup
    }
    catch (err){
        console.log('cannot save task', err)
        throw err
    }
}


async function removeGroup(groupId, boardId){
    console.log(groupId, boardId)

    try{
    //GET BOARD
    let board = await getBoardById(boardId)
   
    
    //remove group
    const groupIdx = board.groups.findIndex((g)=> g.id === groupId )
    board.groups.splice(groupIdx, 1)

    await saveBoard(board)

    return 'removed'
    }
    catch (err){
        console.log('cannot remove task', err)
        throw err
    }
}




//task level functions:

async function getTaskById(boardId, groupId, taskId){
    const board = await getBoardById(boardId)
    const group = board.groups.find((group) => group.id === groupId)
    const task = group.tasks.find((task) => task.id === taskId)
    return task
    
}



async function saveTask(task, groupId, boardId){
    console.log(groupId, boardId, task)

    try{
    //GET BOARD
    let board = await getBoardById(boardId)

    //DET GROUP
    let group = await getGroupById(boardId, groupId)

    //addTask
    if(!task.id){
        task.id = utilService.makeId()
        group.tasks.push(task)
    }

    // or update task
    else{
        const taskIdx = group.tasks.findIndex((t)=> t.id === task.id )
        group.tasks.splice(taskIdx, 1, task)
    }
    
    //update group
        const groupIdx = board.groups.findIndex((g)=> g.id === groupId )
        board.groups.splice(groupIdx, 1, group)


    await saveBoard(board)

    const savedTask = getTaskById(boardId, groupId, task.id)
    return savedTask
    }
    catch (err){
        console.log('cannot save task', err)
        throw err
    }
}



async function removeTask(taskId, groupId, boardId){
    console.log(groupId, boardId, taskId)

    try{
    //GET BOARD
    let board = await getBoardById(boardId)

    //DET GROUP
    let group = await getGroupById(boardId, groupId)

    const taskIdx = group.tasks.findIndex((t)=> t.id === taskId )
    group.tasks.splice(taskIdx, 1)
    
    
    //update group
    const groupIdx = board.groups.findIndex((g)=> g.id === groupId )
    board.groups.splice(groupIdx, 1, group)

    await saveBoard(board)

    return 'removed'
    }
    catch (err){
        console.log('cannot remove task', err)
        throw err
    }
}






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
        //      backgroundImage: url('https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg'),
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
                        title: 'Some stuff we need to do and its alot of stuff',
                        status: 'in-progress',
                        description: 'hgfkgf bvkjgfv hjkgfkjhv khjghlb opup iojnm ytreuyteyitufvbn ',
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
                            bgColor: '#26de81',
                            coverImgUrl: 'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
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
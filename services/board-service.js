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
    coverOptions,
    getEmptyActivity,
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
    console.log('updatedBoard', board)


    if (board._id) {
        return storageService.put(STORAGE_KEY, board)
    } else {
        return storageService.post(STORAGE_KEY, board)
    }
}


//group level functions
async function getGroupById(boardId, groupId) {
    const board = await getBoardById(boardId)
    const group = board.groups.find((group) => group.id === groupId)
    return group

}



async function saveGroup(group, boardId) {

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
    }
    catch (err) {
        console.log('cannot save task', err)
        throw err
    }
}


async function removeGroup(groupId, boardId) {
    console.log(groupId, boardId)

    try {
        //GET BOARD
        let board = await getBoardById(boardId)


        //remove group
        const groupIdx = board.groups.findIndex((g) => g.id === groupId)
        board.groups.splice(groupIdx, 1)

        await saveBoard(board)

        return 'removed'
    }
    catch (err) {
        console.log('cannot remove task', err)
        throw err
    }
}




//task level functions:

async function getTaskById(boardId, groupId, taskId) {
    const board = await getBoardById(boardId)
    const group = board.groups.find((group) => group.id === groupId)
    const task = group.tasks.find((task) => task.id === taskId)
    return task

}



async function saveTask(task, taskTitle, groupId, boardId, userAction) {
    if (task === null) {
        task = _createTask()
        task.title = taskTitle
    }
    try {
        //GET BOARD
        let board = await getBoardById(boardId)

        //DET GROUP
        let group = await getGroupById(boardId, groupId)

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
        board = addActivity(board, task, userAction)

        await saveBoard(board)

        // const savedTask = await getTaskById(boardId, groupId, task.id)
        const updatedBoard = await getBoardById(boardId)

        // return savedTask
        return updatedBoard
    }
    catch (err) {
        console.log('cannot save task', err)
        throw err
    }
}



async function removeTask(taskId, groupId, boardId) {
    console.log(groupId, boardId, taskId)

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

        await saveBoard(board)

        return 'removed'
    }
    catch (err) {
        console.log('cannot remove task', err)
        throw err
    }
}

function addActivity(board, task, userAction) {
    // console.log('board, task, userAction', board, task, userAction)
    let activity = getEmptyActivity()
    activity.txt = userAction || "change"
    activity.task.id = task.id
    activity.task.title = task.title
    board.activities.unshift(activity)
    return board
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


function _createTask() {
    return {
        title: "new!",
        status: "",
        description: "",
        comments: [],
    }
}

function getEmptyBoard() {
    return {
        _id: '',
        title: '',
        style: {
            bgColor: '#26de81',
            bgImgUrl: 'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
        },
        members: [
            {
                id: 'm101',
                username: 'THT',
                fullname: 'Tal Hammer Topaz',
                imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512',
                createdAt: '2021-12-11T10:01:48.000Z'
            },
            {
                id: 'm102',
                username: 'AK',
                fullname: 'Alon Kolker',
                imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512',
                createdAt: '2021-12-11T10:01:48.000Z'
            },
            {
                id: 'm103',
                username: 'AC',
                fullname: 'Alen Alen Chernick',
                imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512',
                createdAt: '2021-12-11T10:01:48.000Z'
            },
            {
                id: 'm104',
                username: 'LS',
                fullname: 'Lihi Sered',
                imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512',
                createdAt: '2021-12-11T10:01:48.000Z'
            },
        ],
        groups: [
            {
                id: 'g101',
                title: 'Group subject',
                archivedAt: 1589983468418,
                description: 'hgfkgf bvkjgfv hjkgfkjhv khjghlb opup iojnm ytreuyteyitufvbn hgfkgf bvkjgfv hjkgfkjhv khjghlb opup iojnm ytreuyteyitufvbn hgfkgf bvkjgfv hjkgfkjhv khjghlb opup iojnm ytreuyteyitufvbn ',
                type: "draggable",
                tasks: [
                    {
                        id: 'c101',
                        title: 'Replace logo',
                        status: '',
                        description: '',
                        comments: [],
                        checklists: [],
                        memberIds: [],
                        labelIds: [],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember: {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: '../assets/img/AK.jpg',
                            createdAt: '2021-12-11T10:01:48.000Z'
                        },
                        members: [],
                        style: {
                            bgColor: '',
                            bgImgUrl: '',
                        }
                    },
                    {
                        id: 'c102',
                        title: 'Add Samples',
                        status: '',
                        description: '',
                        comments: [],
                        checklists: [],
                        memberIds: [],
                        labelIds: [],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember: {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: '../assets/img/AK.jpg',
                            createdAt: '2021-12-11T10:01:48.000Z'
                        },
                        members: [],
                        style: {
                            bgColor: '',
                            bgImgUrl: '',
                        }
                    },
                ],
                style: {
                    bgImgUrl: 'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg'
                }
            },
            {
                id: 'g102',
                title: 'Group subject',
                tasks: [
                    {
                        id: 'c103',
                        title: 'Add Samples',
                        status: '',
                        description: '',
                        comments: [],
                        checklists: [],
                        memberIds: [],
                        labelIds: [],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember: {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: '../assets/img/AK.jpg',
                            createdAt: '2021-12-11T10:01:48.000Z'
                        },
                        members: [],
                        style: {
                            bgColor: '',
                            bgImgUrl: '',
                        }
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
                        memberIds: ['m101', 'm102', 'm103', 'm104'],
                        labelIds: ['l101', 'l102'],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember:
                        {
                            id: 'm101',
                            username: 'THT',
                            fullname: 'Tal Hammer Topaz',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512',
                        },
                        members: [{
                            id: 'm101',
                            username: 'THT',
                            fullname: 'Tal Hammer Topaz',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512',
                        },
                        {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512',
                        },
                        {
                            id: 'm103',
                            username: 'AC',
                            fullname: 'Alen Alen Chernick',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512',
                        },
                        {
                            id: 'm104',
                            username: 'LS',
                            fullname: 'Lihi Sered',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512',
                        }],
                        style: {
                            bgColor: '#26de81',
                            bgImgUrl: 'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
                        }
                    }
                ],
                style: {}
            },
            {
                id: 'g103',
                title: 'Group subject',
                archivedAt: 1589983468418,
                type: "draggable",
                tasks: [
                    {
                        id: 'c105',
                        title: 'Add Samples',
                        status: '',
                        description: '',
                        comments: [],
                        checklists: [],
                        memberIds: [],
                        labelIds: [],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember: {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: '../assets/img/AK.jpg',
                            createdAt: '2021-12-11T10:01:48.000Z'
                        },
                        members: [],
                        style: {
                            bgColor: '',
                            bgImgUrl: '',
                        }
                    },
                    {
                        id: 'c106',
                        title: 'Add Samples',
                        status: '',
                        description: '',
                        comments: [],
                        checklists: [],
                        memberIds: [],
                        labelIds: [],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember: {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: '../assets/img/AK.jpg',
                            createdAt: '2021-12-11T10:01:48.000Z'
                        },
                        members: [],
                        style: {
                            bgColor: '',
                            bgImgUrl: '',
                        }
                    }
                ],
                style: {}
            },
            {
                id: 'g104',
                title: 'Group subject',
                tasks: [
                    {
                        id: 'c107',
                        title: 'Add Samples',
                        status: '',
                        description: '',
                        comments: [],
                        checklists: [],
                        memberIds: [],
                        labelIds: [],
                        createdAt: 1590999730348,
                        dueDate: 16156215211,
                        byMember: {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: '../assets/img/AK.jpg',
                            createdAt: '2021-12-11T10:01:48.000Z'
                        },
                        members: [],
                        style: {
                            bgColor: '',
                            bgImgUrl: '',
                        }
                    },
                    {
                        id: 'c108',
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
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: '../assets/img/AK.jpg',
                            createdAt: '2021-12-11T10:01:48.000Z'
                        },
                        members: [{
                            id: 'm101',
                            username: 'THT',
                            fullname: 'Tal Hammer Topaz',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512',
                        },
                        {
                            id: 'm102',
                            username: 'AK',
                            fullname: 'Alon Kolker',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512',
                        },
                        {
                            id: 'm103',
                            username: 'AC',
                            fullname: 'Alen Alen Chernick',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512',
                        },
                        {
                            id: 'm104',
                            username: 'LS',
                            fullname: 'Lihi Sered',
                            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512',
                        }],
                        style: {
                            bgColor: '#26de81',
                            bgImgUrl: 'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
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
                createdAt: 1589983468418,
                byMember: {
                    id: 'm103',
                    username: 'AC',
                    fullname: 'Alen Chernick',
                    imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U039NGTS4LS-ecf5fa0f2299-512',
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo'
                }
            },
            {
                id: 'a102',
                txt: 'did something',
                createdAt: 1589983468418,
                byMember: {
                    id: 'm102',
                    username: 'AK',
                    fullname: 'Alon Kolker',
                    imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512',
                },
                task: {
                    id: 'c103',
                    title: 'Replace Logo'
                }
            },
            {
                id: 'a104',
                txt: 'did something else',
                createdAt: 1589983468418,
                byMember: {
                    id: 'm101',
                    username: 'THT',
                    fullname: 'Tal Hammer Topaz',
                    imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03AHSR218R-c8967c6358b4-512',
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo'
                }
            },
            {
                id: 'a105',
                txt: 'and another thing',
                createdAt: 1589983468418,
                byMember: {
                    id: 'm104',
                    username: 'LS',
                    fullname: 'Lihi Sered',
                    imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BUP78HDG-30bde5111b5b-512',
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo'
                }
            }
        ],
        isDemoBoard: true,
        byMember: {
            id: 'm102',
            username: 'AK',
            fullname: 'Alon Kolker',
            imgUrl: '../assets/img/AK.jpg',
            createdAt: '2021-12-11T10:01:48.000Z'
        },
        members: [],
        isFavorite: true,
        activityCount: 0,
        lastActivity: 1658239902711,
        boardLabels: _labelOptions(),
    };
}


function getEmptyActivity() {
    return {
        id: utilService.makeId(),
        txt: '',
        createdAt: Date.now(),
        //will replace later to loggedin user
        byMember: {
            id: 'm102',
            username: 'AK',
            fullname: 'Alon Kolker',
            imgUrl: 'https://ca.slack-edge.com/T035GULFZRD-U03BSQW83JN-2722b50680bb-512',
        },
        task: {},

    }
}



function coverOptions() {
    return {
        coverColors: ['#277da1', '#4d908e', '#fb6f92', '#90be6d', '#f9c74f',
            '#f9844a', '#00b4d8', '#3a5a40'],
        coverImgs: ['https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
            'https://media.istockphoto.com/photos/the-sun-goes-down-behind-the-autumn-forest-picture-id1162998855?k=20&m=1162998855&s=612x612&w=0&h=JLbCH4hLaO5war1ipJXx7eoxXMdhcMXFO9pwXz1NR1Q=',
            'https://wallpaperaccess.com/full/1131217.jpg',
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg',
            'https://media.istockphoto.com/photos/hydrangea-flowers-in-the-garden-picture-id927499422?k=20&m=927499422&s=612x612&w=0&h=9fZtBAXZ3I8qNRTi87SHTDEjbBjyn_eRoDoLAC7zVvg=',
            'https://i.pinimg.com/originals/18/28/4e/18284ec99d85c9ee5afaf05baf77083a.jpg',
            'https://media.istockphoto.com/photos/colored-ceiling-picture-id1208301897?k=20&m=1208301897&s=612x612&w=0&h=xXFlsJphxez3hgCYRxYmS7yxb5P4-HOtbnsjIVJSSWA=',
            'https://assets.weforum.org/global_future_council/image/xALg-7b0WN5aLOY6aejbKW3NepG-PEipzKnEuyS8ZlI.jpeg',
            'https://media.cntraveler.com/photos/5ca60f7f7b531a5e47949cde/master/w_4000,h_2400,c_limit/NYC_GettyImages-500619014.jpg',
            'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=1600',


        ],

    }

}


function _labelOptions(){
    return [
        {
            id: 'l101',
            bgColor: '#e63946',
            txt: 'Urgent',
        },
        {
            id: 'l102',
            bgColor: '#2a9d8f',
            txt: 'Important',
        },
        {
            id: 'l103',
            bgColor: '#e9c46a',
            txt: 'New',
        },
        {
            id: 'l104',
            bgColor: '#48cae4',
            txt: 'Nice to have',
        },
        {
            id: 'l106',
            bgColor: '#adc178',
            txt: 'Delayed',
        },
        {
            id: 'l107',
            bgColor: '#9c89b8',
            txt: 'In progress',
        },
        {
            id: 'l108',
            bgColor: '#0ead69',
            txt: 'Done',
        },
        {
            id: 'l109',
            bgColor: '#16697a',
            txt: 'Do not forget',
        },
        {
            id: 'l110',
            bgColor: '#70e000',
            txt: 'Bug',
        },
        {
            id: 'l111',
            bgColor: '#00a8e8',
            txt: 'Take care togay',
        },
    ]
}
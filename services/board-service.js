import { storageService } from './storage-service.js'
import { utilService } from './util-service.js'


const STORAGE_KEY = 'board_db'

_createBoards()


export const boardService = {
    query,
    remove,
    save,
    getById,
    getEmptyBoard,
}


function query() {
    return storageService.query(STORAGE_KEY)

}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

function remove(boardId) {
    return storageService.remove(STORAGE_KEY, boardId)
}

function save(board) {
    if (board._id) {
        return storageService.put(STORAGE_KEY, board)
    } else {
        return storageService.post(STORAGE_KEY, board)
    }
}

function _createBoards() {
    let boards = utilService.loadFromStorage(STORAGE_KEY)
    if (!boards || !boards.length) {
        boards = [
            _createBoard('First Demo Board')
        ]
    }
    return boards
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
        //     backgroundImage: url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODE5MzB8MHwxfHNlYXJjaHwzfHxjb2Rpbmd8ZW58MHx8fHwxNjQyMzU4NjIz&ixlib=rb-1.2.1&q=85'),
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
        isDemoBoard: true,
        isFavorite: true,
        activityCount: 0,
        lastActivity: 1658239902711
    };
}

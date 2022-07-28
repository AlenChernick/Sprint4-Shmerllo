import Axios from 'axios'
const axios = Axios.create({ withCredentials: true })

import { socketService } from './socket.service'

const STORAGE_KEY = 'loggedin'

export const userService = {
    // signup,
    setLogin,
    getLoggedInUser,
    setLogout,
}

function _getUrl(id = '') {  /* TODO */
    const BASE_URL =
        process.env.NODE_ENV !== 'development'
            ? '/api/user'
            : '//localhost:3032/api/user/login'

    return `${BASE_URL}/${id}`
}


function _getUrlAuth(id = '') {
    const BASE_URL =
        process.env.NODE_ENV !== 'development'
            ? '/api/auth'
            : '//localhost:3032/api/auth'

    return `${BASE_URL}/`
}

function getLoggedInUser() {
    const user =  JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    console.log(user)
    return user
}


async function setLogin(userCred) {
    try {
        const res = await axios.post(_getUrlAuth() + 'login', userCred)
        const user= res.data
        socketService.login(user._id)
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        return user
    } catch (err) {
        console.log('cannot set user login', err)
    }
}

async function setLogout() {
    try {
        await axios.post(_getUrlAuth() + 'logout')
        socketService.logout()
        sessionStorage.clear()
        
    } catch (err) {
        console.log('cannot set user login', err)
    }
}

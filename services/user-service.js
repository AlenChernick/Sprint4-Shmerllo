import Axios from 'axios'
const axios = Axios.create({ withCredentials: true })

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
            : '//localhost:3033/api/user/login'

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
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
}


async function setLogin(user) {
    try {
        const res = await axios.post(_getUrlAuth() + 'login', user)
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(res.data))
        return res.data
    } catch (err) {
        console.log('cannot set user login', err)
    }
}

async function setLogout() {
    try {
        const res = await axios.post(_getUrlAuth() + 'logout')
        sessionStorage.clear()
        
    } catch (err) {
        console.log('cannot set user login', err)
    }
}

// import { storageService } from './storage-service.js'

const USER_KEY = 'loggedInUser'

export const userService = {
    login,
    logout,
    getLoggedInUser,
}

function login(credentials) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(credentials))
}

function logout() {
    sessionStorage.removeItem(USER_KEY)
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY))
}
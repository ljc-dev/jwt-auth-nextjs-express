const { v4: uuidV4 } = require("uuid")
const { NOT_AUTHENTICATED, INTERNAL_STORAGE_ERROR, INVALID_CREDENTIALS } = require("./constants")
const bcrypt = require("bcrypt")
const users = []

const findUserById = async (id) => {
    return await users.find(user => user.id === id)
}

const findUserByIdAndIncTV = async (id) => {
    const user = await users.find(user => user.id === id)
    user.tokenVersion += 1
    return true
}

const findUserByUsername = async (username) => {
    return await users.find(user => user.username === username)
}

const comparePasswords = async (password, hashedPassword) => {
    //brcypt compare
    return await bcrypt.compare(password, hashedPassword)
}

const createUser = async (username, password) => {
    if (await findUserByUsername(username)) return { user: null, errorMsg: INVALID_CREDENTIALS }
    try {
        //hash password
        const hashed = await bcrypt.hash(password, 10)
        const user = { id: uuidV4(), username, password: hashed, tokenVersion: 0 }
        //add to db
        const result = await users.push(user)
        if (!result) return { user: null, errorMsg: INTERNAL_STORAGE_ERROR }
        return { user, errorMsg: "" }
    } catch (error) {
        console.log(error)
        return { user: null, errorMsg: INTERNAL_STORAGE_ERROR }
    }
}

module.exports = {
    users, findUserById, findUserByUsername, createUser, comparePasswords, findUserByIdAndIncTV
}
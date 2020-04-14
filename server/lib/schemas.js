const { gql } = require("apollo-server-express")
const { NOT_AUTHENTICATED, INTERNAL_STORAGE_ERROR, INVALID_CREDENTIALS, WRONG_CREDENTIALS } = require("./constants")
const { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken, sendRefreshToken } = require("./tokenFcts")
const { findUserById, findUserByUsername, findUserByIdAndIncTV, createUser, comparePasswords } = require("./user")

const typeDefs = gql`
    type User {
        id: ID
        username: String
        password: String
        tokenVersion: Int
    }

    type GetUserResponse {
        user: User
        errorMsg: String
    }

    type AddUserResponse {
        user: User
        errorMsg: String
    }

    type LoginResponse {
        accessToken: String
        user: User
        errorMsg: String
    }

    type LogoutResponse {
        hasLogout: Boolean
    }

    type Query {
        getUser: GetUserResponse
    }

    type Mutation {
        addUser(username: String!, password: String!): AddUserResponse
        login(username: String!, password: String!): LoginResponse
        logout: LogoutResponse
    }
`

const resolvers = {
    Query: {
        async getUser(_, __, { req }) {
            const authorization = req.headers["authorization"]
            // console.log("auth", authorization)
            if (!authorization) return { user: null, errorMsg: NOT_AUTHENTICATED + "1" }
            try {
                const token = authorization.split(" ")[1]
                const { id } = verifyAccessToken(token)
                if (!id) return { user: null, errorMsg: NOT_AUTHENTICATED + "2" }
                const user = await findUserById(id)
                if (!user) return { user: null, errorMsg: NOT_AUTHENTICATED + "3" }
                return { user, errorMsg: "" }
            } catch (err) {
                console.log(err.message)
                return { user: null, errorMsg: NOT_AUTHENTICATED + "4" }
            }
        }
    },
    Mutation: {
        async addUser(_, { username, password }) {
            //validate data first then
            const { user, errorMsg } = await createUser(username, password)
            if (!user) return { user: null, errorMsg }
            return { user, errorMsg: "" }
        },
        async login(_, { username, password }, { res }) {
            //validate data first then
            const user = await findUserByUsername(username)
            if (!user) return { accessToken: "", user: null, errorMsg: WRONG_CREDENTIALS }
            //compare password
            try {
                // console.log(password, user.password)
                const isSame = await comparePasswords(password, user.password)
                if (!isSame) return { accessToken: "", user: null, errorMsg: WRONG_CREDENTIALS }
            } catch (error) {
                console.log(error)
                return { accessToken: "", user: null, errorMsg: INTERNAL_STORAGE_ERROR }
            }
            //found user and correct password => logged in!
            //send access and refresh token
            const refreshToken = createRefreshToken({ id: user.id, tokenVersion: user.tokenVersion })
            const accessToken = createAccessToken({ id: user.id })
            // console.log("login: acc", accessToken, "ref", refreshToken)
            sendRefreshToken(res, refreshToken)
            return { accessToken, user, errorMsg: "" }
        },
        async logout(_, __, { req, res }) {
            const authorization = req.headers["authorization"]
            let hasLogout = false
            // console.log("logout auth", authorization)
            if (!authorization) return { hasLogout }
            try {
                const token = authorization.split(" ")[1]
                const { id } = verifyAccessToken(token)
                // console.log("logout id", authorization)
                if (!id) return { hasLogout }
                //do logout here
                //replace refresh token with empty string
                //DEBUG TEST: don't reset refresh token so client still has cookie => tokenVersion works!
                sendRefreshToken(res, "")
                //increment token version
                hasLogout = await findUserByIdAndIncTV(id)
                // console.log("logout hasLogOut", hasLogout)
                return { hasLogout }
            } catch (err) {
                console.log(err.message)
                return { hasLogout: false }
            }

        }
    }
}

module.exports = {
    typeDefs, resolvers
}
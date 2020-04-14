const jwt = require("jsonwebtoken")

const sendRefreshToken = (res, token) => {
    res.cookie("refresh", token, {
        httpOnly: true
    })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, "public_access_secret", { expiresIn: "30s" })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, "public_refresh_secret", { expiresIn: "3m" })
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, "public_access_secret")
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, "public_refresh_secret")
}

module.exports = {
    createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken, sendRefreshToken
}


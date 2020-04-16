const express = require("express")
const { RedisCache } = require("apollo-server-cache-redis")
const { ApolloServer } = require("apollo-server-express")
const cookieParser = require("cookie-parser")
const { typeDefs, resolvers } = require("./lib/schemas")
const { verifyRefreshToken, sendRefreshToken, createAccessToken, createRefreshToken } = require("./lib/tokenFcts")
const { findUserById } = require("./lib/user")
const cors = require("cors")

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.post("/refresh-token", async (req, res) => {
    const token = req.cookies["refresh"]
    console.log("refresh", token)
    if (!token) return { ok: false, accessToken: "" }
    try {
        console.log("verifying refreshed")
        const { id, tokenVersion } = verifyRefreshToken(token)
        console.log("verified refreshed")
        if (!id) return res.send({ ok: false, accessToken: "" })
        const user = await findUserById(id)
        if (!user) return res.send({ ok: false, accessToken: "" })
        if (user.tokenVersion !== tokenVersion) {
            // console.log("TV different so aborted, db TV:", user.tokenVersion, "client TV:", tokenVersion)
            return res.send({ ok: false, accessToken: "" })
        }
        //verified token and found user
        //send refresh and access
        const refreshToken = createRefreshToken({ id: user.id, tokenVersion: user.tokenVersion })
        const accessToken = createAccessToken({ id: user.id })
        // console.log("refresh-token: acc", accessToken, "ref", refreshToken)
        sendRefreshToken(res, refreshToken)
        return res.send({ ok: true, accessToken })
    } catch (err) {
        console.log("verify refreshed failed")
        console.log(err.message)
        return res.send({ ok: false, accessToken: "" })
    }
})

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    cache: new RedisCache() //comment this line if you don't have a redis server running
})

server.applyMiddleware({ app, cors: false })
app.listen(4000, console.log(`GraphQL at http://localhost:4000${server.graphqlPath}`))

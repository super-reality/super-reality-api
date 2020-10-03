const express = require('express')
// require('./db/mongoose')
const userRouter = require('./routes/api/v1/user')
const collectionRouter = require('./routes/api/v1/collection')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(collectionRouter)

module.exports = app
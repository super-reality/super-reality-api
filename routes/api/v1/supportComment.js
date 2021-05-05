"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createComment, getCommentsByTicket} = require('../../../controllers/supportCommentController')

router.post("/create", auth(), function (req, res) {

    createComment(req, res)
})

router.get("/:id", auth(), function (req, res) {

    getCommentsByTicket(req, res)

})


module.exports = router

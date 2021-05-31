"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createComment, getCommentsByTicket,deleteCommentsByTicket} = require('../../../controllers/supportComment')

router.post("/create", auth(), function (req, res) {

    createComment(req, res)
})

router.get("/:id", auth(), function (req, res) {

    getCommentsByTicket(req, res)

})
router.delete("/:id", auth(), function (req, res) {

    deleteCommentsByTicket(req, res)

})



module.exports = router

"use strict"
const express = require('express')
var router = express.Router()
const auth = require("../../../middleware/auth")
const {createCardComment, getComments, getCommentById, updateCommentById, deleteCommentById} = require('../../../controllers/cardCommentController')
router.post("/create", auth(), function (req, res) {
    createCardComment(req, res)
})
router.get("/:id", auth(), function (req, res) {
    getCommentById(req, res)
})

router.put("/:id", auth(), function (req, res) {
  updateCommentById(req,res)
})

router.get("/card/:id", auth(), function (req, res) {
    getComments(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteCommentById(req, res)
})

module.exports = router

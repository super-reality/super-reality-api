"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getBoardById, getAllBoards, createBoard,deleteBoardById} = require('../../../controllers/boardController')


router.post("/create", auth(), function (req, res) {
    createBoard(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getBoardById(req, res)
});
router.get("/", auth(), function (req, res) {
    getAllBoards(req, res)
});
router.delete("/:id", auth(), function (req, res) {
    deleteBoardById(req, res)
});

module.exports = router

"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getBoardById, getAllBoards, createBoard, deleteBoardById, createBoardItem, getBoardItemsById, deleteBoardItemByIds, getBoardItemsByBoardId, deleteBoardItemsByBoardId} = require('../../../controllers/boardController')


router.post("/create", auth(), function (req, res) {
    createBoard(req, res)
})
router.post("/item/create", auth(), function (req, res) {
    createBoardItem(req, res)
})
router.get("/item/:id", auth(), function (req, res) {
    getBoardItemsById(req, res)
})
router.get("/items/:boardId", auth(), function (req, res) {
    getBoardItemsByBoardId(req, res)
})
router.delete("/item/:id", auth(), function (req, res) {
    deleteBoardItemByIds(req, res)
})
router.delete("/items/:boardId", auth(), function (req, res) {
    deleteBoardItemsByBoardId(req, res)
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

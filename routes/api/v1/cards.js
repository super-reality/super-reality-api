"use strict"
const express = require('express')
var router = express.Router()
const auth = require("../../../middleware/auth")
const {createCard, getCards, getCardById, updateCardById, deleteCardById, getCardsByBoardId, getCardsByBoardColId, createSharedCard, getSharedCardsWithUser, unshareAllCardsSharedWithUser, updateCardPositionsById} = require('../../../controllers/cardController')
router.post("/create", auth(), function (req, res) {
    createCard(req, res)
})
router.get("/", auth(), function (req, res) {
    getCards(req, res)
})
router.post("/sharedCard", function (req, res) {
    createSharedCard(req, res)
})
router.get("/sharedCard/:id", function (req, res) {
    getSharedCardsWithUser(req, res)
})
router.delete("/sharedCard/:id", function (req, res) {
    unshareAllCardsSharedWithUser(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getCardById(req, res)
})
router.get("/board/:id", auth(), function (req, res) {
    getCardsByBoardId(req, res)
})
router.get("/col/:id", auth(), function (req, res) {
    getCardsByBoardColId(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteCardById(req, res)
})
router.post("/move", function (req, res) {
    updateCardPositionsById(req, res)
})

module.exports = router

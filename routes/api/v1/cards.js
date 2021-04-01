"use strict"
const express = require('express')
var router = express.Router()
const auth = require("../../../middleware/auth")
const { createCard, getCards, getCardById, updateCardById, deleteCardById } = require('../../../controllers/cardController')
router.post("/create", auth(), function (req, res) {
    createCard(req, res)
})
router.get("/", auth(), function (req, res) {
    getCards(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getCardById(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteCardById(req, res)
})

module.exports = router

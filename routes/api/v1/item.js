"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createItem, getItemById, updateItemById, deleteItemById} = require('../../../controllers/itemController')

router.post("/create", auth(), function (req, res) {
    createItem(req, res)
})
router.get("/:id", auth(), function (req, res) {
    getItemById(req, res)
});
router.put("/", auth(), function (req, res) {
    updateItemById(req, res)
});
router.delete("/:id", auth(), function (req, res) {
    deleteItemById(req, res)
})
module.exports = router

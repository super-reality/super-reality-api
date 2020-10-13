"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createItem, searchItem, getItemById, updateItemById, deleteItem} = require('../../../controllers/itemController')

router.post("/create", auth(), function (req, res) {
    createItem(req, res)
})

router.post("/search", auth(), function (req, res) {
    searchItem(req, res)
})

router.get("/:Id", auth(), function (req, res) {
    getItemById(req, res)
});

router.put("/", auth(), function (req, res) {
    updateItemById(req, res)
});
router.delete("/:Id", auth(), function (req, res) {
    deleteItem(req, res)
})
module.exports = router

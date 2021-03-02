"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getCategoryById,getAllCategory,createCategory,getCategoryBySearch} = require('../../../controllers/categoryController')

router.post("/create", auth(), function (req, res) {
    createCategory(req, res)
});
router.get("/:id", auth(), function (req, res) {
    getCategoryById(req, res)
});
router.get("/search/:name", auth(), function (req, res) {
    getCategoryBySearch(req, res)
});
router.get("/", auth(), function (req, res) {
    getAllCategory(req, res)
});



module.exports = router

"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getCategoryById,getAllCategory,createCategory} = require('../../../controllers/categoryController')

router.post("/create", auth(), function (req, res) {
    createCategory(req, res)
});


router.get("/:id", auth(), function (req, res) {
    getCategoryById(req, res)
});

router.get("/search/:name", auth(), function (req, res) {
    getAllCategory(req, res)
});


module.exports = router

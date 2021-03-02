"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getSubCategoryById,getAllSubCategory,createSubCategory} = require('../../../controllers/subCategoryController')

router.post("/create", auth(), function (req, res) {
    createSubCategory(req, res)
});


router.get("/:id", auth(), function (req, res) {
    getSubCategoryById(req, res)
});

router.get("/search/:name", auth(), function (req, res) {
    getAllSubCategory(req, res)
});


module.exports = router

"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getSubCategoryById,getAllSubCategory,createSubCategory,getSubCategoryBySearch,deleteSubCategoryById} = require('../../../controllers/subCategoryController')

router.post("/create", auth(), function (req, res) {
    createSubCategory(req, res)
});


router.get("/:id", auth(), function (req, res) {
    getSubCategoryById(req, res)
});

router.get("/search/:name", auth(), function (req, res) {
    getSubCategoryBySearch(req, res)
});
router.get("/", auth(), function (req, res) {
    getAllSubCategory(req, res)
});
router.delete("/:id", auth(), function (req, res) {
    deleteSubCategoryById(req, res)
});


module.exports = router

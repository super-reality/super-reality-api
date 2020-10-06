"use strict"
const express = require('express')
require('express-group-routes')
var router = express.Router()
const multer  = require('multer');
const fileParser  = multer({ storage: multer.memoryStorage() });
const auth = require("../../../middleware/auth")
const {createLesson, searchParent, updateLesson, createLessonWithForm, searchLesson, lessonDetail, deleteLesson,addChapterToLesson} = require('../../../controllers/lessonController')
router.post("/create", auth(), function (req, res) {
    createLesson(req, res)
})
router.post("/createWithForm", [auth(), fileParser.any()], function (req, res) {
    createLessonWithForm(req, res)
})
router.get("/search-parent/:query", auth(), function (req, res) {
    searchParent(req, res)
})

router.post("/search", auth(), function (req, res) {
    searchLesson(req, res)
})
router.get("/:id", auth(), function (req, res) {
    lessonDetail(req, res)
})
router.put("/update", auth(), function (req, res) {
    updateLesson(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteLesson(req, res)
})
router.post("/addChapterToLesson", auth(), function (req, res) {
    addChapterToLesson(req, res)
})

// router.put("/update/:lesson_id", auth(), lessonController.list)
module.exports = router

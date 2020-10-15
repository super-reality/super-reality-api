"use strict"
const express = require('express')
require('express-group-routes')
var router = express.Router()
const multer  = require('multer');
const fileParser  = multer({ storage: multer.memoryStorage() });
const auth = require("../../../middleware/auth")
const {createLesson, updateLesson, searchLesson, deleteLessonById,addChapterToLesson, getLessonById} = require('../../../controllers/lessonController')
router.post("/create", auth(), function (req, res) {
    createLesson(req, res)
})
router.post("/search", auth(), function (req, res) {
    searchLesson(req, res)
})
router.put("/", auth(), function (req, res) {
    updateLesson(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteLessonById(req, res)
})
router.get("/:id", auth(), function (req, res) {
    getLessonById(req, res)
})
router.post("/addChapterToLesson", auth(), function (req, res) {
    addChapterToLesson(req, res)
})

// router.put("/update/:lesson_id", auth(), lessonController.list)
module.exports = router

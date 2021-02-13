"use strict"
const express = require('express')
var router = express.Router()
const auth = require("../../../middleware/auth")
const {createLesson, updateLesson, searchLesson, deleteLessonById, getPublicOrPrivateLesson, addChapterToLesson, getLessonById,getChaptesByLessonId} = require('../../../controllers/lessonController')
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
router.post("/visibility", auth(), function (req, res) {
    getPublicOrPrivateLesson(req, res)
})
router.get("/chapters/:id", auth(), function (req, res) {
    getChaptesByLessonId(req, res)
})
router.get("/:id", auth(), function (req, res) {
    getLessonById(req, res)
})
router.post("/addChapterToLesson", auth(), function (req, res) {
    addChapterToLesson(req, res)
})

// router.put("/update/:lesson_id", auth(), lessonController.list)
module.exports = router

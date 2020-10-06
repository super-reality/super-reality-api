"use strict"
const express = require('express')
require('express-group-routes')
var router = express.Router()

const auth = require("../../../middleware/auth")
const {createChapter,getChapters,getChaptersById,addStepToChapter} = require('../../../controllers/chapterController')
router.post("/create", auth(), function (req, res) {
    createChapter(req, res)
})
router.get("/", auth(), function (req, res) {
    getChapters(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getChaptersById(req, res)
})
router.post("/addStepToChapter", auth(), function (req, res) {
    addStepToChapter(req, res)
})

// router.put("/update/:lesson_id", auth(), lessonController.list)
module.exports = router

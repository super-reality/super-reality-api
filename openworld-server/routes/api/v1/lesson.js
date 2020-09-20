"use strict"
const express = require('express')
require('express-group-routes')
var router = express.Router()
const auth = require("../../../middleware/auth")
const {createLesson, searchParent} = require('../../../controllers/lessonController')

// create lesson
router.post("/create", auth(), function (req, res) {
    createLesson(req, res)
})
// search parent
router.get("/search-parent/:query", auth(), function (req, res) {
    searchParent(req, res)
})

module.exports = router

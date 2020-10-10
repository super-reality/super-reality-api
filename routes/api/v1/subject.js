"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createSubject, searchSubject, searchParent, deleteSubject, subjectDetail, updateSubject} = require('../../../controllers/subjectController')

router.post("/create", auth(), function (req, res) {
    createSubject(req, res)
})
router.get("/search-parent/:query", auth(), function (req, res) {
    searchParent(req, res)
})
router.post("/search", auth(), function (req, res) {
    searchSubject(req, res)
})
router.get("/:id", auth(), function (req, res) {
    subjectDetail(req, res)
})
router.put("/update", auth(), function (req, res) {
    updateSubject(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteSubject(req, res)
})

module.exports = router

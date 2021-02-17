"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getVibesById, getAllVibes, createVibe} = require('../../../controllers/vibesController')


router.post("/create", auth(), function (req, res) {
    createVibe(req, res)
})
router.get("/:id", auth(), function (req, res) {
    getVibesById(req, res)
});
router.get("/", auth(), function (req, res) {
    getAllVibes(req, res)
});

module.exports = router

"use strict"
const express = require('express')
var router = express.Router()
const auth = require("../../../middleware/auth")
const {createAttachmentForTrello, getAttachmentById} = require('../../../controllers/trelloAttachmentsController')
router.post("/create", auth(), function (req, res) {
    createAttachmentForTrello(req, res)
})
router.get("/:id", auth(), function (req, res) {
    getAttachmentById(req, res)
})

module.exports = router

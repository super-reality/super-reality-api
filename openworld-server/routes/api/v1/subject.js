"use strict"
const express = require('express')
require('express-group-routes')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createSubject} = require('../../../controllers/subjectController')

// create subject
router.post("/create", auth(), function (req, res) {
    createSubject(req, res)
})

module.exports = router

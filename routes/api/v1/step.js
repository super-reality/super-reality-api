"use strict"
const express = require('express')
require('express-group-routes')
var router = express.Router()

const auth = require("../../../middleware/auth")
const {createStep,getsteps,getstepsById} = require('../../../controllers/stepController')
router.post("/create", auth(), function (req, res) {
    createStep(req, res)
})

router.get("/", auth(), function (req, res) {
    getsteps(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getstepsById(req, res)
})

module.exports = router

"use strict"
const express = require('express')
var router = express.Router()
const auth = require("../../../middleware/auth")
const { createStep, getsteps, getstepsById, updateStepById, deleteStepById,getItemsByStepId } = require('../../../controllers/stepController')
router.post("/create", auth(), function (req, res) {
    createStep(req, res)
})
router.get("/", auth(), function (req, res) {
    getsteps(req, res)
})

router.get("/items/:id", auth(), function (req, res) {
    getItemsByStepId(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getstepsById(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteStepById(req, res)
})
router.put("/", auth(), function (req, res) {
    updateStepById(req, res)
})

module.exports = router

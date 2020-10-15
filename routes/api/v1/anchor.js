"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createAnchor, getAnchorById, updateAnchorById, deleteAnchor} = require('../../../controllers/anchorController')

router.post("/create", auth(), function (req, res) {
    
    createAnchor(req, res)
})

router.post("/search", auth(), function (req, res) {
    searchAnchor(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getAnchorById(req, res)
});

router.put("/", auth(), function (req, res) {
    
    updateAnchorById(req, res)
});
router.delete("/:Id", auth(), function (req, res) {
    
    deleteAnchor(req, res)
})
module.exports = router

"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {searchTag} = require('../../../controllers/tagController')

//search query route
router.get("/search/:query", auth(), function (req, res) {
    searchTag(req, res)
})


module.exports = router

"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const multer = require('multer');
const fileParser = multer({storage: multer.memoryStorage()});
const {upload} = require("../../../controllers/fileController")

router.post("/upload", [auth(), fileParser.any()], function (req, res) {
    upload(req, res)
})

module.exports = router

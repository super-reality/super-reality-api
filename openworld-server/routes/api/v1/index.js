"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {findCollection} = require("../../../controllers/collectionController");

//base route
router.get('/', function (req, res) {
    res.json({
        status: 'Welcome to Open World API',
        message: 'Open World Rest Api is now working!',
    })
})
// find collection route
router.get("/find", function(req,res)
{
    findCollection(req,res)
})

// auth routes
router.use("/auth", require("./auth"))

// collection routes
router.use("/collection", require("./collection"))

// subject routes
router.use("/subject", require("./subject"))

//lesson routes
router.use("/lesson", require("./lesson"))

// tag routes
router.use("/tag", require("./tag"))

// user routes
router.use("/user", require("./user"))

// clasroom routes
router.use("/classroom", require("./classroom"))

//file routes
router.use("/file", require("./file"))


module.exports = router

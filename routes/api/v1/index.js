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
router.get("/find", function (req, res) {
    findCollection(req, res)
})

// anchor routes
router.use("/anchor", require("./anchor"))

// auth routes
router.use("/auth", require("./auth"))

// collection routes
router.use("/collection", require("./collection"))

// item routes
router.use("/item", require("./item"))

router.use("/support", require("./support"))

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
router.use("/category", require("./category"))

router.use("/subcategory", require("./subCategory"))
//chapter routes
router.use("/chapter", require("./chapter"))
// skill routes
router.use("/skill", require("./skill"))
// step routes
router.use("/step", require("./step"))
router.use("/vibe", require("./vibe"))


module.exports = router

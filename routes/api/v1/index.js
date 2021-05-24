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
//support routes
router.use("/support", require("./support"))
//board routes
router.use("/boards", require("./boards"))
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
//category
router.use("/category", require("./category"))
//subcategory
router.use("/subcategory", require("./subCategory"))
//chapter routes
router.use("/chapter", require("./chapter"))
// skill routes
router.use("/skill", require("./skill"))
// step routes
router.use("/step", require("./step"))
//vibe routes
router.use("/vibe", require("./vibe"))
//card routes
router.use("/cards", require("./cards"))
//card Comments
router.use("/cardComment", require("./cardComment"))
//attachment router for trello
router.use("/trelloAttachment", require("./trelloAttachments"))
//support comment
router.use("/supportComment",require("./supportCommentChild"))

module.exports = router

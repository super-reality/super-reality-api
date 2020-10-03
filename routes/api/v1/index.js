"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {findCollection} = require("../../../controllers/collectionController");
const {Collection,Subject,Step,Tag}= require("../../../models")

//base route
router.get('/', async function (req, res) {
    try {
        const user = await Collection.find()
        console.log('USER: ', user)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        console.log('ERROR: ', e)
        res.status(404).send()
    }
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

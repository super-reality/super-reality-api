const express = require('express')
require('express-group-routes')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createCollection, findCollection, getCollectionList} = require('../../../controllers/collectionController')

// create collection route
router.post("/create", auth(), function (req, res) {
    createCollection(req, res)
})
// get list route
router.get("/list", auth(), function (req, res) {
    getCollectionList(req, res)
})

module.exports = router

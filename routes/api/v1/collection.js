const express = require('express')
require('express-group-routes')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createCollection, getCollectionList, findCollection, collectionDetail, updateCollection, deleteCollection,search} = require('../../../controllers/collectionController')

// create collection route
router.post("/create", auth(), function (req, res) {
    createCollection(req, res)
})
// get list route
router.get("/list", auth(), function (req, res) {
    getCollectionList(req, res)
})

router.post("/search", auth(), function (req, res) {
    search(req, res)
})
router.get("/:id", auth(), function (req, res) {
    collectionDetail(req, res)
})
router.put("/update", auth(), function (req, res) {
    updateCollection(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteCollection(req, res)
})

module.exports = router

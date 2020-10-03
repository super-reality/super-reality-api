const express = require('express')
require('express-group-routes')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {deleteAllCollection, createCollection, getCollectionList, findCollection, collectionDetail, updateCollection, deleteCollection,search} = require('../../../controllers/collectionController')


// router.get("/matt", (req, res) => {
//     console.log('MATT')
//     res.json({
//         status: 'Matt 1',
//         message: 'Matt 2',
//     })
// })

router.get("/find", auth(), function (req, res) {
    findCollection(req, res)

})
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
router.delete("/delete/all", auth(), function (req, res) {
    deleteAllCollection(req, res)
})

module.exports = router

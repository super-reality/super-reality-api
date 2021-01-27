"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createSupportTicket, getTicketById, getAllSupportTicket ,updateSupportTicketById} = require('../../../controllers/supportController')

router.post("/create", auth(), function (req, res) {

    createSupportTicket(req, res)
})
router.get("/:id", auth(), function (req, res) {
    getTicketById(req, res)
});
router.get("/", auth(), function (req, res) {
    getAllSupportTicket(req, res)
})

router.put("/", auth(), function (req, res) {

    updateSupportTicketById(req, res)
});
module.exports = router

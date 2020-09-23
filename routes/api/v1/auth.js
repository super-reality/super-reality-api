"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {signup, signin, verify} = require('../../../controllers/authController')

//sign in route
router.post("/signin", function (req, res) {
    signin(req, res)
})
//sign up route
router.post("/signup", function (req, res) {
    signup(req, res)
})
//verify route
router.post("/verify", auth(), function (req, res) {
    verify(req, res)
})

module.exports = router

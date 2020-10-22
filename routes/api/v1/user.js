"use strict"
const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth")
const {getUser, createUser, getUserById, deleteUser, updateUser} = require("../../../controllers/userController")

const {bookLesson} = require("../../../controllers/favorController")

router.post("/book-lesson", auth(), function (req, res) {
    bookLesson(req, res)
})

router.get("/", auth(), function (req, res) {
    getUser(req, res)
})

router.post("/", auth(), function (req, res) {
    createUser(req, res)
})

router.get("/:userId", auth(), function (req, res) {
    getUserById(req, res)
})

router.patch("/", auth(), function (req, res) {
    updateUser(req, res)
})

router.delete("/", auth(), function (req, res) {
    deleteUser(req, res)
})


module.exports = router;

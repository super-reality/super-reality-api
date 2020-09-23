"use strict"
const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth")
const {getClassroom, createClassroom, getClassroomById, updateClassroom, deleteClassRoom} = require("../../../controllers/classroomController")

// get classroom route
router.get("/", auth(), function (req, res) {
    getClassroom(req, res)
})
// create classroom route
router.post("/", auth(), function (req, res) {
    createClassroom(req, res)
})

// get classroom by id route
router.get("/:classroomId", auth(), function (req, res) {
    getClassroomById(req, res)
});
// update classroom id
router.patch("/", auth(), function (req, res) {
    updateClassroom(req, res)
})
// delete classroom id
router.delete("/", auth(), function (req, res) {
    deleteClassRoom(req, res)
})


module.exports = router;

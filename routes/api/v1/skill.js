"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getSkillById, getAllSkillBySearch, createSkill,getAllSkill,deleteSkillById} = require('../../../controllers/skillController')


router.post("/create", auth(), function (req, res) {
    createSkill(req, res)
})

router.get("/:id", auth(), function (req, res) {
    getSkillById(req, res)
});

router.get("/search/:name", auth(), function (req, res) {
    getAllSkillBySearch(req, res)
});
router.get("/", auth(), function (req, res) {
    getAllSkill(req, res)
});
router.delete("/:id", auth(), function (req, res) {
    deleteSkillById(req, res)
});

module.exports = router

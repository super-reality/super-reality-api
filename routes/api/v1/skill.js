"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {getSkillById,getAllSkill} = require('../../../controllers/skillController')



router.get("/:id", auth(), function (req, res) {
    getSkillById(req, res)
});

router.get("/search/:name", auth(), function (req, res) {
    getAllSkill(req, res)
});


module.exports = router

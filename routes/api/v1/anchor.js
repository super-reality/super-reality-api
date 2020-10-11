"use strict"
const express = require('express')
const router = express.Router()
const auth = require("../../../middleware/auth")
const {createAnchor, searchAnchor, getAnchorById, updateAnchor, deleteAnchor} = require('../../../controllers/anchorController')
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;
console.log = function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};



router.post("/create", function (req, res) {
    
    createAnchor(req, res)
})

router.post("/search", function (req, res) {
    searchAnchor(req, res)
})

router.get("/:Id", function (req, res) {
    getAnchorById(req, res)
});

router.put("/:Id", function (req, res) {
    
    updateAnchor(req, res)
});
router.delete("/:Id", function (req, res) {
    
    deleteAnchor(req, res)
})
module.exports = router

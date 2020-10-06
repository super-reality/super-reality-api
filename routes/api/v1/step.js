"use strict"
const express = require('express')
const redis = require("redis");
const client = redis.createClient(6379);
var statusCodes = require("http-status-codes")
var router = express.Router()
const stepExistInCache = (request, response, next) => {
   
    client.get(request.params.id, (err, data) => {
        if (err) {
            next(err)
        }
        if (data) {
            response.status(statusCodes.OK).send(JSON.parse(data))
        }
        else {
            next();
        }
    })

}
const getAllStepsFromRedis = (request, response, next) => {
   
    client.get('steps', (err, data) => {
        if (err) {
            next(err)
        }
        if (data) {
            response.status(statusCodes.OK).send(JSON.parse(data))
        }
        else {
            next();
        }
    })

}

const auth = require("../../../middleware/auth")
<<<<<<< HEAD
const { createStep, getsteps, getstepsById, updateStepById, deleteStepById } = require('../../../controllers/stepController')
router.post("/create", auth(), function (req, res) {
    createStep(req, res)
})
router.get("/", auth(), function (req, res) {
=======
const {createStep,getsteps,getstepsById,deleteStepById} = require('../../../controllers/stepController')
router.post("/create", auth(), function (req, res) {
    createStep(req, res)
})

router.get("/", auth(),getAllStepsFromRedis,function (req, res) {
>>>>>>> 622ceef... redis mechanism on hold
    getsteps(req, res)
})

router.get("/:id", auth(),stepExistInCache,function (req, res) {
    getstepsById(req, res)
})
router.delete("/:id", auth(), function (req, res) {
    deleteStepById(req, res)
})
<<<<<<< HEAD
router.put("/", auth(), function (req, res) {
    updateStepById(req, res)
})
=======
>>>>>>> 622ceef... redis mechanism on hold

module.exports = router

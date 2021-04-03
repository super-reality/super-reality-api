const {Vibe} = require("../models");
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createVibe = async function (request, response) {
    const {
        title,
        emoji,
        type,
    } = request.body;

    var vibe = Vibe()
    vibe.title = title
    vibe.emoji = emoji
    vibe.type = type
    vibe.createdBy = request.user._id
    vibe.createdAt = new Date()

    // save subject document
    vibe.save(async function (err, result) {
        if (err != null) {
            response.status(statusCodes.Bad_Request).json({
                error: err
            });
        } else {
            response.status(statusCodes.CREATED).send(result)
        }
    })
}
const getAllVibes = async function (request, response) {
    try {

        result = {}
        positiveVibes = await Vibe.find({type: 'positive'})
        negativeVibes = await Vibe.find({type: 'negative'})
        if (positiveVibes) {
            result.positiveVibes = positiveVibes
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This vibe does not exist"
            })
        }
        if (negativeVibes) {
            result.negativeVibes = negativeVibes
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This skill does not exist"
            })
        }
            if (positiveVibes && negativeVibes) {
                response.status(statusCodes.OK).send({err_code: 0, result})
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "Could not fetch category",
                    internalError: error
                })
            }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch category",
            internalError: error
        })
    }
}
const getVibesById = async function (request, response) {
    try {
        vibe = await Vibe.findById({_id: request.params.id})
        if (vibe) {
            response.status(statusCodes.OK).send({err_code: 0, vibe})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This vibe does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch vibe",
            internalError: error
        })
    }
}
module.exports = {
    getVibesById, getAllVibes, createVibe
}

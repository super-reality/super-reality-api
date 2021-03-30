const {Boards} = require("../models");
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")

const createBoard = async function (request, response) {
    const {
        title,
        lastSeenAt
    } = request.body;

    const board = Boards()
    board.title = title
    board.lastSeenAt = lastSeenAt ? lastSeenAt : null
    board.ownerId = request.user._id
    board.createdAt = new Date()

    // save subject document
    board.save(async function (err, result) {
        if (err != null) {
            response.status(statusCodes.Bad_Request).json({
                error: err
            });
        } else {
            response.status(statusCodes.CREATED).send(result)
        }
    })
}
const getAllBoards = async function (request, response) {
    console.log()
    try {
        const boards = await Boards.find({ownerId: request.user._id}).populate('ownerId',['firstname','lastname'])
        if (boards) {
            response.status(statusCodes.OK).send({err_code: 0, boards})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "No board awas found"
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
const getBoardById = async function (request, response) {
    try {
        const board = await Boards.findById({_id: request.params.id}).populate('ownerId',['firstname','lastname'])
        if (board) {
            response.status(statusCodes.OK).send({err_code: 0, board})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This board does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch board",
            internalError: error
        })
    }
}

const deleteBoardById = async function (request, response) {
    try {
        const board = await Boards.findOne({_id: request.params.id})
        if (board) {
            const deletedBoard = await Boards.deleteOne({_id: request.params.id})
            if (deletedBoard) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The board was deleted successfully"})
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: 0,
                    message: "Could not deleted this board"
                })
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This board does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this board",
            internalError: error
        })
    }
}
module.exports = {
    getBoardById, getAllBoards, createBoard, deleteBoardById
}

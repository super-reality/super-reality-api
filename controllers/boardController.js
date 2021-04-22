const {Boards, BoardIds} = require("../models");
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")

const createBoard = async function (request, response) {
    const {
        title,
        lastSeenAt,
        isPublic,
    } = request.body;

    const board = Boards()
    board.title = title
    board.lastSeenAt = lastSeenAt ? lastSeenAt : null
    board.isPublic = isPublic
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
const createBoardItem = async function (request, response) {
    const {
        boardId,
        col,
        title
    } = request.body;

    const boardIds = BoardIds()
    boardIds.boardId = boardId
    boardIds.col = col ? col : boardIds.col
    boardIds.title = title
    boardIds.createdAt = new Date()

    // save subject document
    boardIds.save(async function (err, result) {
        if (err != null) {
            response.status(statusCodes.Bad_Request).json({
                error: err
            });
        } else {
            response.status(statusCodes.CREATED).send(result)
        }
    })
}
const UpdateBoardItem = async function (request, response) {
    const {
        boardId,
        col,
        title
    } = request.body;

    const boardIds = BoardIds()
    boardIds.boardId = boardId
    boardIds.col = col ? col : boardIds.col
    boardIds.title = title
    boardIds.createdAt = new Date()

    // save subject document
    boardIds.save(async function (err, result) {
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
    try {
        const boards = await Boards.find({ownerId: request.user._id}).populate('ownerId', ['firstname', 'lastname'])
        if (boards) {
            response.status(statusCodes.OK).send({err_code: 0, boards})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "No board was found"
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

const getAllPublicBoards = async function (request, response) {
    try {
        const boards = await Boards.find({isPublic: true}).populate('ownerId', ['firstname', 'lastname'])
        if (boards) {
            response.status(statusCodes.OK).send({err_code: 0, boards})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "No board was found"
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

const getAllBoardItemsById = async function (request, response) {
    try {
        const boardItems = await BoardIds.find({boardId: request.params.boardId}).populate('boardId')
        if (boards) {
            response.status(statusCodes.OK).send({err_code: 0, boardItems})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "No board item was found"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch board item",
            internalError: error
        })
    }
}
const getBoardById = async function (request, response) {
    try {
        const board = await Boards.findById({_id: request.params.id}).populate('ownerId', ['firstname', 'lastname'])
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
const updateBoardById = async function (request, response) {
    try {
        const board = await Boards.findById({_id: request.body.boardId}).populate('ownerId', ['firstname', 'lastname'])
        if (board) {
            board.title = request.body.title ? request.body.title : board.title
            board.lastSeenAt = request.body.lastSeenAt ? request.body.lastSeenAt : board.lastSeenAt
            if (request.body.archived === true) {
                board.archived = true
            } else {
                board.archived = false
            }
            if (request.body.isPublic === true) {
                board.isPublic = true
            } else {
                board.isPublic = false
            }
            board.udpatedAt = new Date()
            const updatedBoard = await board.save({})
            if (updatedBoard) {
                response.status(statusCodes.OK).send(updatedBoard)
            }
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

const getBoardItemsByBoardId = async function (request, response) {
    try {
        const boardItems = await BoardIds.find({boardId: request.params.boardId})
        if (boardItems) {
            response.status(statusCodes.OK).send({err_code: 0, boardItems})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This board does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch board item",
            internalError: error
        })
    }
}

const getBoardItemsById = async function (request, response) {
    try {
        const boardItem = await BoardIds.find({_id: request.params.id})
        if (boardItem) {
            response.status(statusCodes.OK).send({err_code: 0, boardItem})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This board item does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch board item",
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
const deleteBoardItemByIds = async function (request, response) {
    try {
        const boardId = await BoardIds.findOne({_id: request.params.id})
        if (boardId) {
            const deletedBoardIds = await BoardIds.deleteOne({_id: request.params.id})
            if (deletedBoardIds) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The board item was deleted successfully"})
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: 0,
                    message: "Could not deleted this board item"
                })
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This board item does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this board item",
            internalError: error
        })
    }
}
const deleteBoardItemsByBoardId = async function (request, response) {
    try {
        const boardId = await Boards.findOne({_id: request.params.boardId})
        if (boardId) {
            const deletedBoardIds = await BoardIds.deleteMany({boardId: request.params.boardId})
            if (deletedBoardIds) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The board item was deleted successfully"})
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: 0,
                    message: "Could not deleted this board item"
                })
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This board item does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this board item",
            internalError: error
        })
    }
}

module.exports = {
    getBoardById,
    getAllPublicBoards,
    getAllBoards,
    createBoard,
    deleteBoardById,
    updateBoardById,
    createBoardItem,
    deleteBoardItemByIds,
    getBoardItemsById,
    deleteBoardItemsByBoardId,
    getBoardItemsByBoardId,
    getAllBoardItemsById
}

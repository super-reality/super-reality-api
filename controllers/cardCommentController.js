const {CardComments} = require("../models")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createCardComment = async function (request, response) {
    const {
        cardId,
        body
    } = request.body;

    // Name should be atleast 4 character
    if (!cardId || cardId.length < 1) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A vailid card is required"
        })
    }

    if (body.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Description is too short"
        })
    }

    const session = await db.startSession();
    const responses = {};

    const comment = CardComments()

    comment.cardId = cardId
    comment.body = body
    comment.commentedBy = request.user._id
    comment.createdAt = new Date()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const createdComment = await comment.save({session})
            responses['comment'] = createdComment

        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create comment "
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this comment",
            internalError: err

        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}

const updateCommentById = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };

    try {

        var commentUpdated = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentComment = await CardComments.findById({_id: request.params.id, session})
            if (currentComment) {

                currentComment.cardId = request.body.cardId ? request.body.cardId : currentComment.cardId
                currentComment.body = request.body.body ? request.body.body : currentComment.body

                currentComment.updatedAt = new Date()
                updatedComment = await currentComment.save({session})
                if (updatedComment) {
                    commentUpdated = true
                    responses['comment'] = updatedComment
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this comment"
                    })
                }
            } else {
                response.status(statusCodes.NOT_FOUND).send({
                    err_code: statusCodes.NOT_FOUND,
                    "message": "This comment does not exist"
                })
            }
            // save collection document
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)
        } else {

            console.log("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Could not update this comment"
            })

        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this comment",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }

}

const getCommentById = async function (request, response) {
    try {
        comment = await CardComments.findById({_id: request.params.id}).populate('cardId').populate('commentedBy', ['firstname', 'lastname'])
        if (comment) {
            response.status(200).send({err_code: 0, comment})
        } else {
            response.status(200).send({err_code: 0, comment: {}, message: "This comment does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch comment",
            internalError: error
        })
    }
}

const getComments = async function (request, response) {
    try {
        comments = await CardComments.find({cardId: request.params.id}).populate('cardId').populate('commentedBy', ['firstname', 'lastname'])
        if (comments) {
            response.status(200).send({err_code: 0, comments})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch comments",
            internalError: error
        })
        console.error(error)
    }

}
const deleteCommentById = async function (request, response) {
    try {
        comment = await CardComments.findOne({_id: request.params.id})
        if (comment) {
            deletedComment = await CardComments.deleteOne({_id: request.params.id})
            if (deletedComment) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The comment was deleted successfully"})
            } else {
                response.status(statusCodes.OK).send({err_code: 0, message: "Could not delete this comment"})
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This comment does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this comment",
            internalError: error
        })
    }

}
module.exports = {
    createCardComment,
    getCommentById,
    getComments,
    updateCommentById,
    deleteCommentById,
}

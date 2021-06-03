const {SupportChildComment, Support} = require("../models")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createComment = async function (request, response) {
    const {
        parentId,
        timePosted,
        ranking,
        ticketId,
        base,
        child,
        comment,
        nestedCommentsCount,
        nestedComments
    } = request.body;

    const session = await db.startSession();
    const responses = {};

    var supportComment = SupportChildComment()
    supportComment.parentId = parentId
    supportComment.userId = request.user._id
    supportComment.ticketId = ticketId
    supportComment.username = request.user.username
    supportComment.timePosted = timePosted ? timePosted : new Date()
    supportComment.ranking = ranking ? ranking : supportComment.ranking
    supportComment.comment = comment
    supportComment.nestedCommentsCount = nestedCommentsCount ? nestedComments : supportComment.nestedCommentsCount
    supportComment.nestedComments = nestedComments
    supportComment.createdBy = request.user._id

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const createdComment = await supportComment.save({session})
            responses['comment'] = createdComment
            if (createdComment) {
                if (child) {
                    const parentComment = await SupportChildComment.findById({_id: parentId})
                    if (parentComment) {
                        parentComment.nestedCommentsCount = parentComment.nestedCommentsCount + 1
                    }
                    const updateParentComment = await parentComment.save({});
                    if (updateParentComment) {
                        responses['comment'] = createdComment
                    } else {
                        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                            err_code: statusCodes.INTERNAL_SERVER_ERROR,
                            message: "Sorry we were not able to create this comment"
                        })

                    }

                }
                if (base) {
                    const parentComment = await Support.findById({_id: parentId})
                    if (parentComment) {
                        parentComment.nestedCommentsCount = parentComment.nestedCommentsCount + 1
                    }
                    const updateParentComment = await parentComment.save({});
                    if (updateParentComment) {
                        responses['comment'] = createdComment
                    } else {
                        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                            err_code: statusCodes.INTERNAL_SERVER_ERROR,
                            message: "Sorry we were not able to create this comment"
                        })

                    }

                }
            }

        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this comment"
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

            const currentComment = await SupportChildComment.findById({_id: request.params.id, session})
            if (currentComment) {
                currentComment.comment = request.body.comment ? request.body.comment : currentComment.comment
                currentComment.ranking = request.body.ranking ? request.body.ranking : currentComment.ranking
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
                message: "Could not update this step"
            })

        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this step",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }

}

const getCommentsByTicket = async function (request, response) {
    try {
        comments = await SupportChildComment.find({parentId: request.params.id})
        if (comments) {
            response.status(statusCodes.OK).send({err_code: 0, comments})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "These comments does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch comments",
            internalError: error
        })
    }
}

const deleteCommentsByTicket = async function (request, response) {
    try {
        console.log(request.params.id)
        child = await SupportChildComment.find({parentId: request.params.id})
        console.log(child)
        if (child) {
            deleteChilds = await SupportChildComment.deleteMany({parentId: request.params.id})
            if (deleteChilds) {
                parent = await SupportChildComment.deleteOne({_id: request.params.id})
                if (parent) {
                    response.status(statusCodes.OK).send({
                        err_code: 0,
                        message: "All comments were deleted successfully"
                    })
                }
            }

        } else {
            parent = await SupportChildComment.deleteOne({_id: request.params.id})
            if (parent) {
                response.status(statusCodes.OK).send({
                    err_code: 0,
                    message: "All comments were deleted successfully"
                })
            } else {
                response.status(statusCodes.NOT_FOUND).send({
                    err_code: 0,
                    message: "This comment is not found"
                })
            }
        }
    } catch (error) {
        console.log(error);
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch comments",
            internalError: error
        })
    }
}


module.exports = {
    createComment,
    getCommentsByTicket,
    deleteCommentsByTicket,
    updateCommentById

}

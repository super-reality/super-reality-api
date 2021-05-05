const {SupportComments} = require("../models")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createComment = async function (request, response) {
    const {
        userId,
        username,
        timePosted,
        ranking,
        ticketId,
        comment,
        nestedCommentsCount,
        nestedComments
    } = request.body;

    const session = await db.startSession();
    const responses = {};

    var supportComment = SupportComments()

    supportComment.userId = request.user._id
    supportComment.ticketId = ticketId
    supportComment.username = request.user.username
    supportComment.timePosted = timePosted ? timePosted : new Date()
    supportComment.ranking = ranking ? ranking : supportComment.ranking
    supportComment.comment = comment
    supportComment.nestedCommentsCount = nestedCommentsCount ? nestedComments :supportComment.nestedCommentsCount
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
const getCommentsByTicket = async function (request, response) {
    try {
        comments = await SupportComments.find({ticketId: request.params.id}).populate('ticketId')
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

module.exports = {
    createComment,
    getCommentsByTicket

}

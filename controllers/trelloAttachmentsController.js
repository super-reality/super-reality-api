const {TrelloAttachments} = require("../models")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createAttachmentForTrello = async function (request, response) {
    const {
        cardId,
        fileName,
        link,
    } = request.body;

    // Name should be atleast 4 character
    if (!cardId || cardId.length < 1) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A vailid card  is required"
        })
    }
    if (!fileName || fileName.length < 1) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A vailid file is required"
        })
    }
    if (link.length < 5) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A valid link is required"
        })
    }

    const session = await db.startSession();
    const responses = {};

    const attachment = TrelloAttachments()

    attachment.cardId = cardId
    attachment.fileName = fileName
    attachment.link = link
    attachment.uploadedBy = request.user._id
    attachment.createdAt = new Date()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const uploadedAttachment = await attachment.save({session})
            responses['attachment'] = uploadedAttachment

        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to upload this attachment"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to upload this attachment",
            internalError: err

        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}

const getAttachmentById = async function (request, response) {
    try {
        attachment = await TrelloAttachments.findById({_id: request.params.id}).populate('cardId')
        if (attachment) {
            response.status(200).send({err_code: 0, attachment})
        } else {
            response.status(200).send({err_code: 0, attachment: {}, message: "This attachment does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch attachment",
            internalError: error
        })
    }
}
const deleteAttachmentId = async function (request, response) {
    try {
        const attachment = await TrelloAttachments.findOne({_id: request.params.id})
        if (attachment) {
            const deletedAttachment = await TrelloAttachments.deleteOne({_id: request.params.id})
            if (deletedAttachment) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The attachment was deleted successfully"})
            } else {
                response.status(statusCodes.OK).send({err_code: 0, message: "Could not delete this attachment"})
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This attachment does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this card",
            internalError: error
        })
    }
}
module.exports = {
    createAttachmentForTrello,
    getAttachmentById,
    deleteAttachmentId
}

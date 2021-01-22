const {Support,Cate} = require("../models");

const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createSupportTicket = async function (request, response) {

    const {
        title,
        supportType,
        supportCategory,
        description,
        files,
        skills,
    } = request.body;

    if(request.body.newCategory)
    {

    }


    const session = await db.startSession();
    const responses = {};
    var support = Support()
    support.title  = title ? title : support.title
    support.supportType = supportType ? supportType : support.supportType
    support.supportCategory = supportCategory ? supportCategory : support.supportCategory
    support.description = description ? description : support.description
    support.files = files ? files : support.files
    support.skills = skills ? skills : support.skills

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const createdTicket = await support.save({session})
            responses['ticket'] = createdTicket
        }, transactionOptions)

        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {

            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this ticket"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: err,
            internalError: err
        })
    } finally {
        session.endSession();
    }
}
const getTicketById = async function (request, response) {
    try {
        ticket = await Support.findById({_id: request.params.id})
        if (ticket) {
            response.status(statusCodes.OK).send({err_code: 0, ticket})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This ticket does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch ticket",
            internalError: error
        })
    }
}
const updateSupportTicketById = async function (request, response) {
    const {
        title,
        supportType,
        supportCategory,
        description,
        files,
        skills,
    } = request.body;

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        var ticketUpdated = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentSupportTicket = await Support.findById({_id: ticket_id, session})
            if (currentSupportTicket) {
                currentSupportTicket.title = title ? title : support.title
                currentSupportTicket.supportType = supportType ? supportType : support.supportType
                currentSupportTicket.supportCategory = supportCategory ? supportCategory : support.supportCategory
                currentSupportTicket.description = description ? description : support.description
                currentSupportTicket.files = files ? files : support.files
                currentSupportTicket.skills = skills ? skills : support.skills

                updatedTicket = await currentSupportTicket.save({session})
                if (updatedTicket) {
                    ticketUpdated = true
                    responses['ticket'] = updatedTicket
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this ticket"
                    })
                }
            } else {
                response.status(statusCodes.NOT_FOUND).send({
                    err_code: statusCodes.NOT_FOUND,
                    "message": "This ticket does not exist"
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
                message: "Could not update this ticket"
            })

        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this anchor",
            internalError: err
        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}


module.exports = {
    createSupportTicket, getTicketById, updateSupportTicketById
}


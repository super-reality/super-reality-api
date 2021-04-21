const {Support, SupportVoters, Category, Skill} = require("../models");

const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createSupportTicket = async function (request, response) {
    let creatorInfo = {}
    creatorInfo._id = request.user._id
    creatorInfo.firstname = request.user.firstname
    creatorInfo.lastname = request.user.lastname
    creatorInfo.username = request.user.username
    const {
        title,
        supportType,
        vibes,
        vibesLevels,
        description,
        files,
        skills,
    } = request.body;


    const session = await db.startSession();
    const responses = {};

    var support = Support()
    support.title = title ? title : support.title
    support.supportType = supportType ? supportType : support.supportType
    support.description = description ? description : support.description
    support.files = files ? files : support.files
    support.skills = skills ? skills : support.skills
    support.createdBy = request.user._id
    support.vibes = vibes ? vibes : support.vibes
    support.vibesLevels = vibesLevels ? vibesLevels : support.vibesLevels
    support.creatorInfo = creatorInfo
    support.createdAt = new Date()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            if (request.body.newCategory) {
                var category = Category()
                category.name = request.body.newCategoryName
                category.subCategories = request.body.subCategories ? request.body.subCategories : []
                category.createdBy = request.user._id
                category.createdAt = new Date()
                const createdCategory = await category.save({session})
                if (createdCategory) {
                    support.supportCategory = createdCategory._id
                }
            } else {
                support.supportCategory = request.body.supportCategory
                const createdTicket = await support.save({session})
                responses['ticket'] = createdTicket
            }
            if (request.body.newSkill) {
                var newSkills = []
                var skill = Skill()
                skill.name = request.body.newSkillName
                skill.createdBy = request.user._id
                skill.createdAt = new Date()
                skill.subSkills = request.body.subSkills ? request.body.subSkills : []
                const createdSkill = await skill.save({session})
                if (createdSkill) {
                    support.skills = newSkills.concat(createdSkill._id)
                }
            } else {
                support.skills = request.body.skills
            }
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

            category = await Category.findById({_id: ticket.supportCategory})
            skill = await Skill.find({_id: {$in: ticket.skills}})
            response.status(statusCodes.OK).send({err_code: 0, ticket, category, skill})

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
const updateSupportTicketVotesById = async function (request, response) {
    const {
        votes,
        upvote,
        downvote,
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

            const currentSupportTicket = await Support.findById({_id: request.params.id, session})
            if (currentSupportTicket) {
                currentSupportTicket.votes = request.body.votes ? request.body.votes : currentSupportTicket.votes
                getVotingInfoForUser = await SupportVoters.findOne({
                    voter: request.user._id,
                    ticketId: request.params.id
                })
                if (getVotingInfoForUser) {
                    getVotingInfoForUser.upvote = request.body.upvote
                    getVotingInfoForUser.ticketId = request.params.id
                    getVotingInfoForUser.voter = request.user._id
                    getVotingInfoForUser.downvote = request.body.downvote
                    updateVotingInfo = await getVotingInfoForUser.save()
                    if (updateVotingInfo) {
                        console.log("previous vote has been updated")
                    }

                } else {
                    const votingInfoForuser = new SupportVoters()
                    votingInfoForuser.ticketId = request.params.id
                    votingInfoForuser.voter = request.user._id
                    votingInfoForuser.upvote = upvote
                    votingInfoForuser.downvote = downvote
                    newVoteSubmitted = await votingInfoForuser.save()
                    if (newVoteSubmitted) {
                        console.log("new vote added")
                    }
                }
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
            message: "Sorry we were not able to update this ticket",
            internalError: err
        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}

const getVotedTicketsByUser = async function (request, response) {
    try {
        let downvotes = []
        let upvotes = []
        const tickets = await SupportVoters.find({voter: request.user._id})
        tickets.filter((ticket) => {
            if (ticket.downvote === true) {
                downvotes.push(ticket.ticketId)
            }
        })
        tickets.filter((ticket) => {
            if (ticket.upvote === true) {
                upvotes.push(ticket.ticketId)
            }
        })
        if (tickets) {
            response.status(statusCodes.OK).send({err_code: 0, upvotes, downvotes})

        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "No ticket found"
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
const getAllSupportTicket = async function (request, response) {
    try {
        const skipCount = 10 * (parseInt(request.query.page) - 1)
        const tickets = await Support.find({}).skip(parseInt(skipCount)).limit(10)
        if (tickets) {
            response.status(statusCodes.OK).send({err_code: 0, tickets})

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

const getTicketBySearch = async function (request, response) {
    try {
        if (request.body.category && request.body.name) {

            tickets = await Support.find({
                title: {
                    $regex: request.body.name,
                    $options: 'i'
                },
                supportCategory: request.body.category
            }).limit(request.body.limit ? parseInt(request.body.limit) : 10)
        }
        if (!request.body.category) {
            tickets = await Support.find({
                title: {
                    $regex: request.body.name
                }
            }).limit(request.body.limit ? parseInt(request.body.limit) : 10)
        }
        if (!request.body.name) {
            tickets = await Support.find({
                supportCategory: request.body.category
            }).limit(request.body.limit ? parseInt(request.body.limit) : 10)
        }

        if (tickets) {
            response.status(statusCodes.OK).send({err_code: 0, tickets})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This ticket does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch tickets",
            internalError: error
        })
    }
}
module.exports = {
    createSupportTicket,
    getTicketById,
    getAllSupportTicket,
    getVotedTicketsByUser,
    updateSupportTicketById,
    getTicketBySearch,
    updateSupportTicketVotesById
}


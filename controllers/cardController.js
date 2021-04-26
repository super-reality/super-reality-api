const {Cards, SharedCards} = require("../models")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createCard = async function (request, response) {
    const {
        boardId,
        boardColId,
        title,
        row,
        description,
        converImage,
    } = request.body;

    // Name should be atleast 4 character
    if (!boardId || boardId.length < 1) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A vailid board  is required"
        })
    }
    if (!boardColId || boardColId.length < 1) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A vailid board item is required"
        })
    }
    if (title.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Title is too short"
        })
    }

    const session = await db.startSession();
    const responses = {};

    const card = Cards()

    card.boardId = boardId
    card.boardColId = boardColId
    card.title = title
    card.row = row ? row : card.row
    card.description = description ? description : card.description
    card.coverImage = converImage ? converImage : card.coverImage
    card.createdBy = request.user._id
    card.createdAt = new Date()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const createdCard = await card.save({session})
            responses['card'] = createdCard

        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this card"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this card",
            internalError: err

        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}

const createSharedCard = async function (request, response) {
    const {
        cardId,
        sharedUserId
    } = request.body;

    // Name should be atleast 4 character
    if (!cardId || cardId.length < 1) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A vailid card  is required"
        })
    }
    if (!sharedUserId || sharedUserId.length < 1) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "A vailid user is required"
        })
    }

    const session = await db.startSession();
    const responses = {};

    const sharedCard = SharedCards()

    sharedCard.cardId = cardId
    sharedCard.sharedUserId = sharedUserId
    sharedCard.createdAt = new Date()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const sharedCardItem = await sharedCard.save({session})
            responses['card'] = sharedCardItem

        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to share this card"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to share this card",
            internalError: err

        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}

const updateCardById = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };

    try {

        var cardUpdated = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentCard = await Cards.findById({_id: request.body.card_id, session})
            if (currentCard) {

                currentCard.boardId = request.body.boardId ? request.body.boardId : currentCard.boardId
                currentCard.boardColId = request.body.boardColId ? request.body.boardColId : currentCard.boardColId
                currentCard.title = request.body.title ? request.body.title : currentCard.title
                currentCard.subtitle = request.body.subTitle ? request.body.subTitle : currentCard.recordingId
                currentCard.row = request.body.row ? request.body.row : currentCard.row
                currentCard.description = request.body.description ? request.body.description : currentCard.description
                currentCard.coverImage = request.body.coverImage ? request.body.coverImage : currentCard.coverImage
                currentCard.summary = request.body.summary ? request.body.summary : currentStep.summary
                if (request.body.archived === true) {
                    currentCard.archived = true
                } else {
                    currentCard.archived = false
                }
                currentCard.updatedAt = new Date()
                currentCard.updatedBy = request.user._id
                currentCard.updatedAt = new Date()
                updatedCard = await currentCard.save({session})
                if (updatedCard) {
                    cardUpdated = true
                    responses['card'] = updatedCard
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this card"
                    })
                }
            } else {
                response.status(statusCodes.NOT_FOUND).send({
                    err_code: statusCodes.NOT_FOUND,
                    "message": "This card does not exist"
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


//update bulk card positions
const updateCardPositionsById = async function (request, response) {
    try {

        var cardUpdated = false
        const responseResult = request.body.cards.map(async (cardItem, i) => {

            const currentCard = await Cards.findById({_id: cardItem.id})
            if (currentCard) {

                currentCard.row = cardItem.position.order ? cardItem.position.order : currentCard.row
                currentCard.boardColId = cardItem.position.columnId ? cardItem.position.columnId : currentCard.boardColId
                currentCard.updatedAt = new Date()
                currentCard.updatedAt = new Date()
                let updatedCard = currentCard.save({})
                if (updatedCard) {
                    cardUpdated = true
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this card"
                    })
                }
            } else {
                response.status(statusCodes.NOT_FOUND).send({
                    err_code: statusCodes.NOT_FOUND,
                    "message": "This card does not exist"
                })
            }

        })
        if (responseResult) {
            response.status(statusCodes.OK).send({
                err_code: statusCodes.OK,
                message: "All the positions updated",

            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this step",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    }

}

const getCardById = async function (request, response) {
    try {
        card = await Cards.findById({_id: request.params.id}).populate('boardId').populate('boardColId').populate('createdBy', ['firstname', 'lastname'])
        if (card) {
            response.status(200).send({err_code: 0, card})
        } else {
            response.status(200).send({err_code: 0, card: {}, message: "This card does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch card",
            internalError: error
        })
    }
}

const getCards = async function (request, response) {
    try {
        const cards = await Cards.find({}).populate('boardId').populate('boardColId').populate('createdBy', ['firstname', 'lastname'])
        if (cards) {
            response.status(200).send({err_code: 0, cards})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch cards",
            internalError: error
        })
        console.error(error)
    }

}

const getSharedCardsWithUser = async function (request, response) {
    try {
        const cards = await SharedCards.find({sharedUserId: request.params.id}).populate('cardId').populate('sharedUserId', ['firstname', 'lastname'])
        if (cards) {
            response.status(200).send({err_code: 0, cards})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch cards",
            internalError: error
        })
        console.error(error)
    }

}
const getCardsByBoardId = async function (request, response) {
    try {
        cards = await Cards.find({boardId: request.params.id}).populate('boardId').populate('boardColId').populate('createdBy', ['firstname', 'lastname'])
        if (cards) {
            response.status(200).send({err_code: 0, cards})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch cards",
            internalError: error
        })
        console.error(error)
    }
}
const getCardsByBoardColId = async function (request, response) {
    try {
        cards = await Cards.find({boardColId: request.params.id}).populate('boardId').populate('createdBy', ['firstname', 'lastname'])
        if (cards) {
            response.status(200).send({err_code: 0, cards})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch cards",
            internalError: error
        })
        console.error(error)
    }

}
const deleteCardById = async function (request, response) {
    try {
        card = await Cards.findOne({_id: request.params.id})
        if (card) {
            deletedCard = await Cards.deleteOne({_id: request.params.id})
            if (deletedCard) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The card was deleted successfully"})
            } else {
                response.status(statusCodes.OK).send({err_code: 0, message: "Could not delete this card"})
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This card does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this card",
            internalError: error
        })
    }
}
const unshareAllCardsSharedWithUser = async function (request, response) {
    try {
        card = await SharedCards.find({sharedUserId: request.params.id})
        if (card) {
            deletedCard = await SharedCards.deleteMany({sharedUserId: request.params.id})
            if (deletedCard) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The cards was unshared successfully"})
            } else {
                response.status(statusCodes.OK).send({err_code: 0, message: "Could not delete this card"})
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This card does not exist"})
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
    createCard,
    createSharedCard,
    getSharedCardsWithUser,
    getCardById,
    getCards,
    updateCardById,
    getCardsByBoardId,
    unshareAllCardsSharedWithUser,
    updateCardPositionsById,
    getCardsByBoardColId,
    deleteCardById,
}

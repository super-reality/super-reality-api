const {Item, Anchor} = require("../models");
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createItem = async function (request, response) {
    const {
        name,
        anchor,
        description,
        relativePos,
        trigger,
        destination,
        transition,
        type,
        endOn
    } = request.body;
    const itemTypes = ['audio', 'video', 'focus_highlight', 'image', 'fx', 'dialog', 'youtube']

    if (type == undefined) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            msg: "Item type is required"
        })
    } else {
        const validItemType = itemTypes.find(element => element === type);
        if (!validItemType) {
            response.status(statusCodes.BAD_REQUEST).send({
                err_code: statusCodes.BAD_REQUEST,
                msg: "Item type is not valid"
            })
        }
    }
    const session = await db.startSession();
    const responses = {};

    const item = Item()
    item.type = type;
    item.name = name ? name : item.name;
    item.anchor = anchor
    item.description = description ? description : item.description
    item.relativePos = relativePos ? relativePos : item.relativePos
    item.trigger = trigger ? trigger : item.trigger
    item.destination = destination ? destination : item.destination
    item.transition = transition ? transition : item.transition
    item.endOn = endOn ? endOn : item.endOn

    if (type == 'audio') {
        item.showPopup = request.body.showPopup ? request.body.showPopup : false;
        item.url = request.body.url ? request.body.url : '';
        item.text = request.body.text ? request.body.text : '';
    }
    if (type == 'focus_highlight') {
        item.focus = request.body.focus ? request.body.focus : 'Area Highlight';
    }
    if (type == 'image') {
        item.url = request.body.url ? request.body.url : '';
    }
    if (type == 'video') {
        item.url = request.body.url ? request.body.url : '';
        item.loop = request.body.loop ? request.body.loop : false;
        item.muted = request.body.muted
        item.source = request.body.source ? request.body.source : ''
    }
    if (type == 'youtube') {
        item.url = request.body.url ? request.body.url : '';
    }
    if (type == 'dialog') {
        item.text = request.body.text ? request.body.text : '';
    }
    if (type == 'fx') {
        item.effect = request.body.effect ? request.body.effect : 'id_1';
        item.parameters = request.body.parameters ? request.body.parameters : {}
        item.fullScreen = request.body.fullScreen

    }
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {

        const transactionResults = await session.withTransaction(async () => {
            const createdItem = await item.save({session})
            responses['item'] = createdItem
        }, transactionOptions)

        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this item"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this item",
            internalError: err
        })

    } finally {
        session.endSession();
    }
}
const getItemById = async function (request, response) {
    try {
        item = await Item.findById({_id: request.params.id})
        if (item) {
            response.status(statusCodes.OK).send({err_code: 0, item})

        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                item: {},
                message: "This item does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch item",
            internalError: error
        })
    }
}
const updateItemById = async function (request, response) {

    if (request.body.item_id == undefined) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            msg: "Provide an id to update"
        })
    } else {
        const session = await db.startSession();
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: {level: 'local'},
            writeConcern: {w: 'majority'}
        };
        try {
            var itemUpdated = false
            const responses = {}

            const transactionResults = await session.withTransaction(async () => {

                const currentItem = await Item.findById({_id: request.body.item_id, session})
                if (currentItem) {

                    currentItem.type = request.body.type ? request.body.type : currentItem.type;
                    currentItem.name = request.body.name ? request.body.name : currentItem.name;
                    if (request.body.anchor) {
                        currentItem.anchor = request.body.anchor
                    } else {
                        currentItem.anchor = currentItem.anchor
                    }
                    currentItem.description = request.body.description ? request.body.description : currentItem.description
                    currentItem.relativePos = request.body.relativePos ? request.body.relativePos : currentItem.relativePos
                    currentItem.trigger = request.body.trigger
                    currentItem.destination = request.body.destination ? request.body.destination : currentItem.destination
                    currentItem.transition = request.body.transition ? request.body.transition : currentItem.transition
                    currentItem.endOn = request.body.endOn ? request.body.endOn : currentItem.endOn
                    currentItem.updatedAt = new Date()
                    if (currentItem.type == 'audio') {
                        currentItem.showPopup = request.body.showPopup ? request.body.showPopup : currentItem.showPopup;
                        currentItem.url = request.body.url ? request.body.url : currentItem.url;
                        currentItem.text = request.body.text ? request.body.text : currentItem.text;
                    }
                    if (currentItem.type == 'focus_highlight') {
                        currentItem.focus = request.body.focus ? request.body.focus : currentItem.focus;
                    }
                    if (currentItem.type == 'image') {
                        currentItem.url = request.body.url ? request.body.url : currentItem.url;
                    }
                    if (currentItem.type == 'video') {
                        currentItem.url = request.body.url ? request.body.url : currentItem.url;
                        currentItem.loop = request.body.loop ? request.body.loop : currentItem.loop;
                        currentItem.muted = request.body.muted
                        currentItem.source = request.body.source ? request.body.source : currentItem.source
                    }
                    if (currentItem.type == 'youtube') {
                        currentItem.url = request.body.url ? request.body.url : '';
                    }
                    if (currentItem.type == 'dialog') {
                        currentItem.text = request.body.text ? request.body.text : currentItem.text;
                    }
                    if (currentItem.type == 'fx') {
                        currentItem.effect = request.body.effect ? request.body.effect : currentItem.effect;
                        currentItem.parameters = request.body.parameters ? request.body.parameters : {}
                        currentItem.fullScreen = request.body.fullScreen
                    }
                    updatedItem = await currentItem.save({session})
                    if (updatedItem) {
                        itemUpdated = true
                        responses['item'] = updatedItem
                    } else {
                        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                            err_code: statusCodes.INTERNAL_SERVER_ERROR,
                            message: "Could not update this item"
                        })
                    }
                } else {
                    response.status(200).send({err_code: 0, "message": "This item does not exist"})
                }
            }, transactionOptions)
            if (transactionResults) {
                responses['err_code'] = 0
                response.status(statusCodes.OK).send(responses)
            } else {
                console.error("The transaction was intentionally aborted.");
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "Could not update this item"
                })
            }
        } catch (err) {
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to update this item",
                internalError: err

            })
            console.error("The transaction was aborted due to an unexpected error: " + err);
        } finally {
            session.endSession();
        }
    }
}
const deleteItemById = async function (request, response) {
    try {
        item = await Item.findOne({_id: request.params.id})
        if (item) {
            deletedItem = await Item.deleteOne({_id: request.params.id})
            if (deletedItem) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The item was deleted successfully"})
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: 0,
                    message: "Could not delete this item"
                })
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This item does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this item",
            internalError: error
        })
    }
}
module.exports = {
    createItem, getItemById, updateItemById, deleteItemById
}




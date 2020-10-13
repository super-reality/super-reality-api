const Item = require("../models/item");

const {ERR_STATUS, ERR_CODE, Lesson_Sort} = require("../constants/constant")

const fileupload = require("../utilities/upload")
const path = require('path')
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

// var fs = require('fs');
// var util = require('util');
// var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
// var log_stdout = process.stdout;
// console.log = function (d) { //
//     log_file.write(util.format(d) + '\n');
//     log_stdout.write(util.format(d) + '\n');
// };


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
    } = request.body;
    const itemTypes = ['audio', 'video', 'focus_highlight', 'image']

    if (type == undefined) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            msg: "Item type does not match"
        })
    } else {
        const validItemType = itemTypes.find(element => element === type);
        if (!validItemType) {
            response.status(statusCodes.BAD_REQUEST).send({
                err_code: statusCodes.BAD_REQUEST,
                msg: "Item type is required"
            })

        }
    }

    const session = await db.startSession();

    const responses = {};

    const item = Item()
    item.type = type;
    item.name = name ? name : item.name;
    item.anchor = anchor ? anchor : item.anchor;
    item.description = description ? description : item.description
    item.relativePos = relativePos ? relativePos : item.relativePos
    item.trigger = trigger ? trigger : item.trigger
    item.destination = destination ? destination : item.destination
    item.transition = transition ? transition : item.transition

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
            response.status(statusCodes.OK).send(responses)

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

const searchItem = async function (request, response) {
    var {
        //the term to search against 'name'
        query,
        //ascending / decs
        sort,
        //what fields to return 
        fields,
    } = request.body;

    var condition = {}
    // Add more query options - name, description, type, etc..
    // Currently only searching against name
    if (query && query != "") {
        condition["name"] = {$regex: query, $options: 'i'}
    }

    // Add sort options
    sortField = sort;

    Item.find(condition, fields, {sort: sortField}).limit(100).find(function (err, lessons) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                lessons
            });
        }
    });

}

const getItemById = async function (request, response) {
    // 
    const {Id} = request.params;

    Item.findById(Id, async function (err, item) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                item
            });
        }
    })

}

const updateItemById = async function (request, response) {

    if (request.body.item_id == undefined) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            msg: "Provide an id to update"
        })
    }
    else {
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
                    currentItem.anchor = request.body.anchor ? request.body.anchor : currentItem.anchor;
                    currentItem.description = request.body.description ? request.body.description : currentItem.description
                    currentItem.relativePos = request.body.relativePos ? request.body.relativePos : currentItem.relativePos
                    currentItem.trigger = request.body.trigger ? request.body.trigger : currentItem.trigger
                    currentItem.destination = request.body.destination ? request.body.destination : currentItem.destination
                    currentItem.transition = request.body.transition ? request.body.transition : currentItem.transition
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
                    }
                    updatedItem = await currentItem.save({session})
                    if (updatedItem) {
                        itemUpdated = true
                        responses['chapter'] = updatedItem
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

const deleteItem = function (request, response) {

    const {Id} = request.params;

    Item.deleteOne({_id: Id}, function (err) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                msg: "Item deleted successfully"
            });
        }
    });
}

module.exports = {
    createItem, searchItem, getItemById, updateItemById, deleteItem
}




const Item = require("../models/item");

const { ERR_STATUS, ERR_CODE, Lesson_Sort } = require("../constants/constant")

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
        type,
        showPopup,
        name,
        description,
        relativePos,
        time,
        startTime,
        endTime,
        autoStart,
        loop,
        sourceMedia,
        textContent,
        textSize,
        textFont,
        textColor,
        textStrength,
        trigger,
        createdBy,
        createdAt,
        updatedAt,
    } = request.body;

    // if (type != 'anchor' || 'video' || 'audio') {
    //     errorStatus = true
    //     response.status(statusCodes.BAD_REQUEST).send({
    //         err_code: statusCodes.BAD_REQUEST,
    //         message: "Type is not valid"
    //     })
    // }

    const session = await db.startSession();
    
    const responses = {};

    var item = Item()
    item.type = type;
    item.showPopup = showPopup;

    item.name = name
    item.description = description
    item.relativePos = relativePos
    item.time = time
    item.startTime = startTime
    item.endTime = endTime
    item.autoStart = autoStart
    item.loop = loop
    item.sourceMedia = sourceMedia
    item.textContent = textContent
    item.textSize = textSize
    item.textFont = textFont
    item.textColor = textColor
    item.textStrength = textStrength
    item.trigger = trigger
    item.createdBy = createdBy
    item.createdAt = createdAt
    item.updatedAt = updatedAt


    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        
        try {
            const transactionResults = await session.withTransaction(async () => {
                const createdItem = await item.save({ session })
                responses['item'] = createdItem


            }, transactionOptions)
        } catch (e) {
            
        }

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
        condition["name"] = { $regex: query, $options: 'i' }
    }

    // Add sort options
    sortField = sort;

    Item.find(condition, fields, { sort: sortField }).limit(100).find(function (err, lessons) {
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
    const { Id } = request.params;

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

const updateItem = function (request, response) {

    const {
        type,
        showPopup,
        name,
        description,
        relativePos,
        time,
        startTime,
        endTime,
        autoStart,
        loop,
        sourceMedia,
        textContent,
        textSize,
        textFont,
        textColor,
        textStrength,
        trigger,
        createdBy,
        createdAt,
        updatedAt,
    } = request.body;



    const { Id } = request.params;

    Item.findById(Id, async function (err, item) {
        

        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            item.type = type;
            item.showPopup = showPopup;
            item.name = name
            item.description = description
            item.relativePos = relativePos
            item.time = time
            item.startTime = startTime
            item.endTime = endTime
            item.autoStart = autoStart
            item.loop = loop
            item.sourceMedia = sourceMedia
            item.textContent = textContent
            item.textSize = textSize
            item.textFont = textFont
            item.textColor = textColor
            item.textStrength = textStrength
            item.trigger = trigger
            item.createdBy = createdBy
            item.createdAt = createdAt
            item.updatedAt = updatedAt
            item.save(async function (err) {
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
    })

}

const deleteItem = function (request, response) {
    
    const { Id } = request.params;
    
    Item.deleteOne({ _id: Id }, function (err) {
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
    createItem, searchItem, getItemById, updateItem, deleteItem
}




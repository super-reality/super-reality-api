const Anchor = require("../models/anchor");

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

const createAnchor = async function (request, response) {
console.log(request)
    const {
        name,
        type,
        templates,
        anchorFunction,
        x,
        y,
        width,
        height,
        cvMatchValue,
        cvCanvas,
        cvDelay,
        cvGrayscale,
        cvApplyThreshold,
        cvThreshold,
        createdBy,
        createdAt,
        updatedAt,
    } = request.body;

    const session = await db.startSession();


    const responses = {};
    var anchor = Anchor()
    anchor.name = name
    anchor.type = type
    anchor.templates = templates
    anchor.anchorFunction = anchorFunction
    anchor.x = x
    anchor.y = y
    anchor.width = width
    anchor.height = height
    anchor.cvMatchValue = cvMatchValue
    anchor.cvCanvas = cvCanvas
    anchor.cvDelay = cvDelay
    anchor.cvGrayscale = cvGrayscale
    anchor.cvApplyThreshold = cvApplyThreshold
    anchor.cvThreshold = cvThreshold
    anchor.createdBy = createdBy
    anchor.createdAt = new Date()
    anchor.updatedAt = new Date()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {

        const transactionResults = await session.withTransaction(async () => {
            const createdAnchor = await anchor.save({ session })
            responses['anchor'] = createdAnchor
        }, transactionOptions)

        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)

        } else {

            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this anchor  111"
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

const searchAnchor = async function (request, response) {
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

    Anchor.find(condition, fields, { sort: sortField }).limit(100).find(function (err, lessons) {
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

const getAnchorById = async function (request, response) {
    // 
    const { Id } = request.params;

    Anchor.findById(Id, async function (err, anchor) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                anchor
            });
        }
    })

}

const updateAnchor = function (request, response) {
    // 
    const {
        name,
        type,
        templates,
        anchorFunction,
        x,
        y,
        width,
        height,
        cvMatchValue,
        cvCanvas,
        cvDelay,
        cvGrayscale,
        cvApplyThreshold,
        cvThreshold,
        createdBy,
        createdAt,
        updatedAt,
    } = request.body;


    const { Id } = request.params;
    
    
    
    

    Anchor.findById(Id, async function (err, anchor) {
        
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            anchor.name = name
            anchor.type = type
            anchor.templates = templates
            anchor.anchorFunction = anchorFunction
            anchor.x = x
            anchor.y = y
            anchor.width = width
            anchor.height = height
            anchor.cvMatchValue = cvMatchValue
            anchor.cvCanvas = cvCanvas
            anchor.cvDelay = cvDelay
            anchor.cvGrayscale = cvGrayscale
            anchor.cvApplyThreshold = cvApplyThreshold
            anchor.cvThreshold = cvThreshold
            anchor.createdBy = createdBy
            anchor.createdAt = createdAt
            anchor.updatedAt = updatedAt
            anchor.save(async function (err) {
                if (err != null) {
                    response.status(ERR_STATUS.Bad_Request).json({
                        error: err
                    });
                } else {
                    response.json({
                        err_code: ERR_CODE.success,
                        anchor
                    });
                }
            })
        }
    })

}

const deleteAnchor = function (request, response) {
    const { Id } = request.params;
    Anchor.deleteOne({ _id: Id }, function (err) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                msg: "Anchor deleted successfully"
            });
        }
    });
}

module.exports = {
    createAnchor, searchAnchor, getAnchorById, updateAnchor, deleteAnchor
}


















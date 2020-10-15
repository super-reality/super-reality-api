const {Anchor} = require("../models");

const {ERR_STATUS, ERR_CODE} = require("../constants/constant")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createAnchor = async function (request, response) {

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
    anchor.createdAt = createdAt
    anchor.updatedAt = updatedAt

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };

    try {

        const transactionResults = await session.withTransaction(async () => {
            const createdAnchor = await anchor.save({session})
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
        condition["name"] = {$regex: query, $options: 'i'}
    }

    // Add sort options
    sortField = sort;

    Anchor.find(condition, fields, {sort: sortField}).limit(100).find(function (err, lessons) {
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
    const {Id} = request.params;

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

const updateAnchorById = async function (request, response) {
    const {
        name,
        anchor_id,
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
    } = request.body;

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };

    try {
        var anchorUpdated = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentAnchor = await Anchor.findById({_id: anchor_id, session})
            if (currentAnchor) {
                currentAnchor.name = name ? name : currentAnchor.name
                currentAnchor.type = type ? type : currentAnchor.type
                currentAnchor.templates = templates ? templates : currentAnchor.templates
                currentAnchor.anchorFunction = anchorFunction ? anchorFunction : currentAnchor.anchorFunction
                currentAnchor.x = x ? x : currentAnchor.x
                currentAnchor.y = y ? y : currentAnchor.y
                currentAnchor.width = width ? width : currentAnchor.width
                currentAnchor.height = height ? height : currentAnchor.height
                currentAnchor.cvMatchValue = cvMatchValue ? cvMatchValue : currentAnchor.cvMatchValue
                currentAnchor.cvCanvas = cvCanvas ? cvCanvas : currentAnchor.cvCanvas
                currentAnchor.cvDelay = cvDelay ? cvDelay : currentAnchor.cvDelay
                currentAnchor.cvGrayscale = cvGrayscale ? cvGrayscale : currentAnchor.cvGrayscale
                currentAnchor.cvApplyThreshold = cvApplyThreshold ? cvApplyThreshold : currentAnchor.cvApplyThreshold
                currentAnchor.cvThreshold = cvThreshold ? cvThreshold : currentAnchor.cvThreshold
                currentAnchor.updatedAt = new Date()

                updatedAnchor = await currentAnchor.save({session})
                if (updatedAnchor) {
                    anchorUpdated = true
                    responses['anchor'] = updatedAnchor
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this anchor"
                    })
                }
            } else {
                response.status(200).send({err_code: 0, "message": "This anchor does not exist"})
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
                message: "Could not update this anchor"
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
const deleteAnchor = function (request, response) {
    const {Id} = request.params;
    Anchor.deleteOne({_id: Id}, function (err) {
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
    createAnchor, searchAnchor, getAnchorById, updateAnchorById, deleteAnchor
}


















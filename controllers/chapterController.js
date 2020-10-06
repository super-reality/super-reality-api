const { Chapter } = require("../models")

const path = require('path')
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const chapter = require("../models/chapter")
const { ChainableTemporaryCredentials } = require("aws-sdk")
const db = mongoose.connection

const createChapter = async function (request, response) {
    const {
        name
    } = request.body;

    // Name should be atleast 4 character
    if (name.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Name should be atleast 4 character"
        })
    }


    const session = await db.startSession();
    const responses = {};

    var chapter = Chapter()

    chapter.name = name
    chapter.createdBy = request.user._id

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            // save collection document
            const createdChapter = await chapter.save({ session })
            responses['chapter'] = createdChapter

        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)

        } else {
            console.log("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this chapter"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this chapter",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}

const getChapters = async function (request, response) {
    try {
        chapters = await Chapter.find({})
        if (chapters) {
            response.status(200).send({ err_code: 0, chapters })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not fetch chapters", internalError: error })
    }

}


const getChaptersById = async function (request, response) {
    try {
        chapters = await Chapter.findById({ _id: request.params.id })
        if (chapters) {
            response.status(200).send({ err_code: 0, chapters })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not fetch chapters", internalError: error })
    }

}
const addStepToChapter = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    responses = {}

    try {

        var stepExistFlag = false
        const transactionResults = await session.withTransaction(async () => {

            const currentChapter = await Chapter.findById({ _id: request.body.chapter_id, session })
            if (currentChapter) {
                step = request.body.step_id
                const stepExist = currentChapter.steps.find(element => element === request.body.step_id);

                if (stepExist) {
                    stepExistFlag = true
                    session.endSession()
                    return
                }
                else {
                    currentChapter.steps = currentChapter.steps.concat(step)
                    updatedChapter = await currentChapter.save({ session });
                    if (updatedChapter) {
                        responses['chapter'] = updatedChapter
                    }
                }
            }
            else {
                response.status(200).send({ err_code: 0, "message": "This chapter does not exist" })
            }
            // save collection document
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)
        } else {
            if (stepExistFlag) {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "This chapter already added to this chapter"

                })

            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "Sorry we were not able to update this chapter"
                })
            }

            console.log("The transaction was intentionally aborted.");

        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this chapter",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}


module.exports = {
    createChapter,
    getChapters,
    getChaptersById,
    addStepToChapter

} 

const { Chapter,Step } = require("../models")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
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

    const chapter = Chapter()

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
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
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
        console.error("The transaction was aborted due to an unexpected error: " + err);
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
        else {
            response.status(200).send({ err_code: 0, chapters: {}, message: "No chapter found" })
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
        else {
            response.status(200).send({ err_code: 0, chapters: {}, message: "This chapter does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not fetch chapters", internalError: error })
    }
}
const updateChapterById = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try {

        var chapterUpdated = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentChapter = await Chapter.findById({ _id: request.body.chapter_id, session })
            if (currentChapter) {

                currentChapter.steps = request.body.steps ? request.body.steps : currentChapter.steps
                currentChapter.name = request.body.name ? request.body.name : currentChapter.name
                currentChapter.updatedAt = new Date()

                updatedChapter = await currentChapter.save({ session })
                if (updatedChapter) {
                    chapterUpdated = true
                    responses['chapter'] = updatedChapter
                }
                else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not update this chapter" })
                }
            }
            else {
                response.status(200).send({ err_code: 0, "message": "This chapter does not exist" })
            }}, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)
        } else {
            console.error("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not update this chapter" })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this chapter",
            internalError: err
        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const getStepsByChapterId = async function (request, response) {
    try {
        allStepsId = []
        chapter = await Chapter.findById({_id: request.params.id})
        if (chapter) {
            allSteps = chapter.steps
            for (i = 0; i < allSteps.length; i++) {
                if (allSteps[i]._id !== undefined) {
                    allStepsId.push(allSteps[i]._id)
                }
            }
            steps = await Step.find({_id: {$in: allStepsId}})
            if (steps) {
                response.status(200).send({err_code: 0, steps})
            }
        } else {
            response.status(200).send({err_code: 0, lessons: {}, message: "This chapter does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch steps",
            internalError: error
        })
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
            }}, transactionOptions)
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
            console.error("The transaction was intentionally aborted.");
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this chapter",
            internalError: err
        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const deleteChapterById = async function (request, response) {
    try {
        chapters = await Chapter.findOne({ _id: request.params.id })
        if (chapters) {
            deletedChapter = await Chapter.deleteOne({ _id: request.params.id })
            if (deletedChapter) {
                response.status(statusCodes.OK).send({ err_code: 0, message: "The chapter was deleted successfully" })
            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: 0, message: "Could not delete this chapter" })
            }
        }
        else {
            response.status(statusCodes.NOT_FOUND).send({ err_code: 0, message: "This chapter does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not delete this chapter", internalError: error })
    }
}
module.exports = {
    createChapter,
    getChapters,
    getChaptersById,
    getStepsByChapterId,
    updateChapterById,
    addStepToChapter,
    deleteChapterById

} 

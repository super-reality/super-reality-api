const {Step, Item} = require("../models")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createStep = async function (request, response) {
    const {
        name,
        anchor,
        recordingId,
        recordingTimestamp,
        snapShot,
        startWhen,
        canvas,
        summary
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

    var step = Step()

    step.name = name
    step.anchor = anchor ? anchor : step.anchor
    step.recordingId = recordingId ? recordingId : step.recordingId
    step.recordingTimestamp = recordingTimestamp ? recordingTimestamp : step.recordingTimestamp
    step.startWhen = startWhen ? startWhen : step.startWhen
    step.canvas = canvas ? canvas : step.canvas
    step.summary = summary ? summary : step.summary
    step.snapShot = snapShot
    step.createdBy = request.user._id

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const createdStep = await step.save({session})
            responses['steps'] = createdStep

        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this step"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this step",
            internalError: err

        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}

const updateStepById = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };

    try {

        var stepUpdated = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentStep = await Step.findById({_id: request.body.step_id, session})
            if (currentStep) {

                currentStep.items = request.body.items ? request.body.items : currentStep.items
                currentStep.name = request.body.name ? request.body.name : currentStep.name
                currentStep.anchor = request.body.anchor ? request.body.anchor : currentStep.anchor
                currentStep.recordingId = request.body.recordingId ? request.body.recordingId : currentStep.recordingId
                currentStep.snapShot = request.body.snapShot ? request.body.snapShot : currentStep.snapShot
                currentStep.recordingTimestamp = request.body.recordingTimestamp ? request.body.recordingTimestamp : currentStep.recordingTimestamp
                currentStep.startWhen = request.body.startWhen ? request.body.startWhen : currentStep.startWhen
                currentStep.summary = request.body.summary ? request.body.summary : currentStep.summary
                currentStep.canvas = request.body.canvas ? request.body.canvas : currentStep.canvas
                currentStep.updatedAt = new Date()
                updatedStep = await currentStep.save({session})
                if (updatedStep) {
                    stepUpdated = true
                    responses['step'] = updatedStep
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this step"
                    })
                }
            } else {
                response.status(statusCodes.NOT_FOUND).send({
                    err_code: statusCodes.NOT_FOUND,
                    "message": "This step does not exist"
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

const getItemsByStepId = async function (request, response) {
    try {
        allItemsId = []
        step = await Step.findById({_id: request.params.id})
        if (step) {
            allItems = step.items
            for (i = 0; i < allItems.length; i++) {
                if (allItems[i]._id !== undefined) {
                    allItemsId.push(allItems[i]._id)
                }
            }
            items = await Item.find({_id: {$in: allItemsId}})
            if (items) {
                response.status(200).send({err_code: 0, items})
            }
        } else {
            response.status(200).send({err_code: 0, lessons: {}, message: "This Step does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch items",
            internalError: error
        })
    }
}

const getsteps = async function (request, response) {
    try {
        steps = await Step.find({})
        if (steps) {
            response.status(200).send({err_code: 0, steps})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch steps",
            internalError: error
        })
        console.error(error)
    }

}
const deleteStepById = async function (request, response) {
    try {
        steps = await Step.findOne({_id: request.params.id})
        if (steps) {
            deletedStep = await Step.deleteOne({_id: request.params.id})
            if (deletedStep) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The step was deleted successfully"})
            } else {
                response.status(statusCodes.OK).send({err_code: 0, message: "Could not delete this step"})
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This step does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this chapter",
            internalError: error
        })
    }

}

const getstepsById = async function (request, response) {
    try {
        steps = await Step.findOne({_id: request.params.id})
        if (steps) {
            response.status(200).send({err_code: 0, steps})
        } else {
            response.status(200).send({err_code: 0, steps: {}, message: "This step does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch chapters",
            internalError: error
        })
        console.error(error)
    }
}
module.exports = {
    createStep,
    getsteps,
    getstepsById,
    updateStepById,
    deleteStepById,
    getItemsByStepId

} 

const { Step } = require("../models")
<<<<<<< HEAD
=======
const redis = require("redis");
const client = redis.createClient(6379);
const path = require('path')
>>>>>>> 622ceef... redis mechanism on hold
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createStep = async function (request, response) {
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

    var step = Step()

    step.name = name
    step.createdBy = request.user._id

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            // save collection document
            const createdStep = await step.save({ session })
            responses['steps'] = createdStep

        }, transactionOptions)
        if (transactionResults) {
            response.status(statusCodes.OK).send(responses)
            responses['err_code'] = 0
            
            client.setex(responses.steps._id.toString(), 60000000, JSON.stringify(responses), function (err) {
                if (err) {
                    console.error("could not store in redis");
                }
                else {
                    console.log("stored in redis");
                }
            })
           

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
         readConcern: { level: 'local' },
         writeConcern: { w: 'majority' }
     };
 
     try {
 
         var stepUpdated = false
         var responses ={}
 
         const transactionResults = await session.withTransaction(async () => {
 
             const currentStep = await Step.findById({ _id: request.body.step_id, session })
             if (currentStep) {
                
                 currentStep.items = request.body.items ? request.body.items : currentStep.items
                 currentStep.name = request.body.name ? request.body.name : currentStep.name
                
                 currentStep.updatedAt =new Date()
                 updatedStep = await currentStep.save({session})
                 if (updatedStep) {
                     stepUpdated = true
                     responses['step']=updatedStep
                 }
                 else {
                     response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not update this step" })
                 }
             }
             else {
                 response.status(200).send({ err_code: 0, "message": "This step does not exist" })
             }
             // save collection document
         }, transactionOptions)
         if (transactionResults) {
             responses['err_code'] = 0
             response.status(statusCodes.OK).send(responses)
         } else {
 
             console.log("The transaction was intentionally aborted.");
             response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not update this step" })
 
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
const getsteps = async function (request, response) {
    try {
        steps = await Step.find({})
        if (steps) {
            client.setex('steps', 60000, JSON.stringify({ err_code: 0, steps }), function (err) {
                if (err) {
                    console.error("could not store in redis");
                }
                else {
                    console.log("stored in redis");
                }
            })

            response.status(200).send({ err_code: 0, steps })
        }
        else {
            response.status(200).send({ err_code: 0, steps: {}, message: "No steps found" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not fetch steps", internalError: error })
        console.error(error)
    }

}
const deleteStepById = async function (request, response) {
    try {
        steps = await Step.findOne({ _id: request.params.id })
        if (steps) {
            deletedStep = await Step.deleteOne({ _id: request.params.id })
            if (deletedStep) {
                response.status(statusCodes.OK).send({ err_code: 0, message: "The step was deleted successfully" })
            }
            else {
                response.status(statusCodes.OK).send({ err_code: 0, message: "Could not delete this step" })
            }
        }
        else {
            response.status(statusCodes.NOT_FOUND).send({ err_code: 0, message: "This step does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not delete this chapter", internalError: error })
    }

}

const deleteStepById = async function (request, response) {
    try {
        steps = await Step.findOne({ _id: request.params.id })
        if (steps) {
            deletedStep = await Step.deleteOne({ _id: request.params.id })
            if (deletedStep) {
                client.del(request.params.id, 60000, JSON.stringify(steps), function (err, response) {
                    if (err) {
                        console.error("could not delete from store");
                    }
                    else {
                        console.log("deletd from store");
                    }
                })
                response.status(statusCodes.OK).send({ err_code: 0, message: "The step was deleted successfully" })
            }
            else {
                response.status(statusCodes.OK).send({ err_code: 0, message: "Could not delete this step" })
            }
        }
        else {
            response.status(statusCodes.NOT_FOUND).send({ err_code: 0, message: "This step does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not delete this chapter", internalError: error })
    }

}

const getstepsById = async function (request, response) {
    try {
        steps = await Step.findOne({ _id: request.params.id })
        if (steps) {
<<<<<<< HEAD
        
=======

            client.setex(request.params.id, 60000, JSON.stringify({ err_code: 0, steps }), function (err, response) {
                if (err) {
                    console.error("could not store in redis");
                }
                else {
                    console.log("stored in redis");
                }
            })
>>>>>>> 622ceef... redis mechanism on hold
            response.status(200).send({ err_code: 0, steps })
        }
        else {
            response.status(200).send({ err_code: 0, steps: {}, message: "This step does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not fetch chapters", internalError: error })
        console.error(error)
    }
}
module.exports = {
    createStep,
    getsteps,
    getstepsById,
<<<<<<< HEAD
    updateStepById,
=======
>>>>>>> 622ceef... redis mechanism on hold
    deleteStepById

} 

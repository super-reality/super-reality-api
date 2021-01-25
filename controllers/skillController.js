const {Skill} = require("../models");

const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const getSkillById = async function (request, response) {
    try {
        skill = await Skill.findById({_id: request.params.id})
        if (skill) {
            response.status(statusCodes.OK).send({err_code: 0, skill})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This skill does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch category",
            internalError: error
        })
    }
}

const getAllSkill = async function (request, response) {
    try {
        skill = await Skill.find({
            name: {
                $regex: request.params.name,
                $options: 'i'
            }
        }, 'name').sort({'name': "asc"}).limit(10)

        if (skill) {
            response.status(statusCodes.OK).send({err_code: 0, skill})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This skill does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch skill",
            internalError: error
        })
    }
}


module.exports = {
    getSkillById, getAllSkill
}


















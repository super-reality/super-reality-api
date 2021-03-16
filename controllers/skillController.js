const {Skill} = require("../models");
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createSkill = async function (request, response) {
    const {
        name,
        subSkills,
    } = request.body;

    var skill = Skill()
    skill.name = name ? name : skill.name
    skill.subSkills = subSkills ? subSkills : skill.subSkills
    skill.createdBy = request.user._id
    skill.rating = skill.rating
    skill.createdAt = new Date()

    // save subject document
    skill.save(async function (err, result) {
        if (err != null) {
            response.status(statusCodes.Bad_Request).json({
                error: err
            });
        } else {
            response.status(statusCodes.CREATED).send(result)
        }
    })
}
const getAllSkill = async function (request, response) {
    try {
        skill = await Skill.find({})
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
const getAllSkillBySearch = async function (request, response) {
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
const deleteSkillById = async function (request, response) {
    try {
        skill = await Skill.findOne({_id: request.params.id})
        if (skill) {
            deletedSkill = await Skill.deleteOne({_id: request.params.id})
            if (deletedSkill) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The skill was deleted successfully"})
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: 0,
                    message: "Could not delete this skill"
                })
            }
        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This skill does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this skill",
            internalError: error
        })
    }
}
module.exports = {
    getSkillById, getAllSkillBySearch,createSkill,getAllSkill,deleteSkillById
}

const {Subcategory} = require("../models");

const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createSubCategory = async function (request, response) {
    const {
        name,
        skills
    } = request.body;

    var subcategory = Subcategory()
    subcategory.name = name ? name : subcategory.name
    subcategory.createdBy = request.user._id
    subcategory.rating = Subcategory.rating
    subcategory.skills = skills ? skills : subcategory.skills
    subcategory.createdAt = new Date()

    // save subject document
    subcategory.save(async function (err, result) {
        if (err != null) {
            response.status(statusCodes.Bad_Request).json({
                error: err
            });
        } else {
            response.status(statusCodes.CREATED).send(result)
        }
    })
}


const getSubCategoryById = async function (request, response) {
    try {
        subcategory = await Subcategory.findById({_id: request.params.id}).populate('skills')
        if (subcategory) {
            response.status(statusCodes.OK).send({err_code: 0, subcategory})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This sub category does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch sub category",
            internalError: error
        })
    }
}

const getSubCategoryBySearch = async function (request, response) {
    try {
        const subcategories = await Subcategory.find({
            name: {
                $regex: request.params.name,
                $options: 'i'
            }
        }, 'name').populate('skills').sort({'name': "asc"}).limit(10)

        if (subcategories) {
            response.status(statusCodes.OK).send({err_code: 0, subcategories})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This sub category does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch sub category",
            internalError: error
        })
    }
}

const getAllSubCategory = async function (request, response) {
    try {
        const subcategories = await Subcategory.find({}).populate('skills')

        if (subcategories) {
            response.status(statusCodes.OK).send({err_code: 0, subcategories})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This sub category does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch sub category",
            internalError: error
        })
    }
}

const deleteSubCategoryById = async function (request, response) {
    try {
        subCategory = await Subcategory.findOne({ _id: request.params.id })
        if (subCategory) {
            deletedsubCategory = await Subcategory.deleteOne({ _id: request.params.id })
            if (deletedsubCategory) {
                response.status(statusCodes.OK).send({ err_code: 0, message: "The sub category was deleted successfully" })
            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: 0, message: "Could not delete this sub category" })
            }
        }
        else {
            response.status(statusCodes.NOT_FOUND).send({ err_code: 0, message: "This sub category does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not delete this sub category", internalError: error })
    }
}


module.exports = {
    getSubCategoryById, getAllSubCategory, createSubCategory,getSubCategoryBySearch,deleteSubCategoryById
}


















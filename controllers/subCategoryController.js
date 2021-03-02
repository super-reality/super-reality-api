const {Subcategory} = require("../models");

const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createSubCategory = async function (request, response) {
    const {
        name,
    } = request.body;

    var subcategory = Subcategory()
    subcategory.name = name ? name : subcategory.name
    subcategory.createdBy = request.user._id
    subcategory.rating = Subcategory.rating
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
        subcategory = await Subcategory.findById({_id: request.params.id})
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
        }, 'name').sort({'name': "asc"}).limit(10)

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
        const subcategories = await Subcategory.find({})

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


module.exports = {
    getSubCategoryById, getAllSubCategory, createSubCategory,getSubCategoryBySearch
}


















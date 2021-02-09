const {Category} = require("../models");

const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const getCategoryById = async function (request, response) {
    try {
        category = await Category.findById({_id: request.params.id})
        if (category) {
            console.log(category)
            response.status(statusCodes.OK).send({err_code: 0, category})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This category does not exist"
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

const getAllCategory = async function (request, response) {
    try {
        category = await Category.find({
            name: {
                $regex: request.params.name,
                $options: 'i'
            }
        }, 'name').sort({'name': "asc"}).limit(10)

        if (category) {
            response.status(statusCodes.OK).send({err_code: 0, category})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                message: "This category does not exist"
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


module.exports = {
    getCategoryById, getAllCategory
}


















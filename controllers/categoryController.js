const {Category, Skill} = require("../models");

const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createCategory = async function (request, response) {
    const {
        name,
        subcategories,
    } = request.body;

    var category = Category()
    category.name = name ? name : category.name
    category.subcategories = subcategories ? subcategories : category.subcategories
    category.createdBy = request.user._id
    category.rating = category.rating
    category.createdAt = new Date()
    // save subject document
    category.save(async function (err, result) {
        if (err != null) {
            response.status(statusCodes.Bad_Request).json({
                error: err
            });
        } else {
            response.status(statusCodes.CREATED).send(result)
        }
    })
}

const getCategoryById = async function (request, response) {
    try {
        category = await Category.findById({_id: request.params.id}).populate('subcategories')
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

const getCategoryBySearch = async function (request, response) {
    try {
        category = await Category.find({
            name: {
                $regex: request.params.name,
                $options: 'i'
            }
        }).sort({'name': "asc"}).limit(10).populate('subcategories')

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


const getCategoryByIdWithSkills = async function (request, response) {
    try {
        category = await Category.findById({_id: request.params.id}).populate('subcategories').populate('subcategories.skills')

        for (i = 0; i < category.subcategories.length; i++) {
            skillset = await Skill.find({_id: {$in: category.subcategories[i].skills}},'name')
            if (skillset) {
                category.subcategories[i]['skills'] = skillset
            }
        }
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

const getAllCategory = async function (request, response) {
    try {
        category = await Category.find({}).populate('subcategories').limit(parseInt(request.query.limit))

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
const deleteCategoryById = async function (request, response) {
    try {
        category = await Category.findOne({ _id: request.params.id })
        if (category) {
            deletedCategory = await Category.deleteOne({ _id: request.params.id })
            if (deletedCategory) {
                response.status(statusCodes.OK).send({ err_code: 0, message: "The category was deleted successfully" })
            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: 0, message: "Could not delete this category" })
            }
        }
        else {
            response.status(statusCodes.NOT_FOUND).send({ err_code: 0, message: "This category does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not delete this category", internalError: error })
    }
}


module.exports = {
    getCategoryById, getAllCategory, createCategory, getCategoryBySearch, getCategoryByIdWithSkills,deleteCategoryById
}


















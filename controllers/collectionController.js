// 'user strict';

const {Collection, Subject, Step, Tag} = require("../models")

const {ERR_STATUS, ERR_CODE, Category, Collection_Sort} = require('../constants/constant')

const statusCodes = require("http-status-codes")
const mongoose = require("mongoose")
const client = mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
let errorStatus = false
const createCollection = async function (request, response) {
    const {
        icon,
        name,
        shortDescription,
        description,
        medias,
        tags,
        visibility,
        entry
    } = request.body;

    if (name.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Name should be atleast 4 character"
        })
    }
    if (description.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Description should be atleast 4 character"
        })
    }
    if (shortDescription.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Short description should be atleast 4 character"
        })
    }
    if (icon.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Icon url should be atleast 4 character"
        })
    }
    if (medias.length == 0) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Atleast one media is required"
        })
    }
    const session = await db.startSession();
    const responses = {};
    if (!errorStatus) {
        const collection = Collection()

        collection.icon = icon
        collection.name = name
        collection.description = description
        collection.medias = medias
        collection.tags = tags
        collection.visibility = visibility
        collection.entry = entry
        collection.rating = 0
        collection.ratingCount = 0
        collection.numberOfShares = 0
        collection.numberOfActivations = 0
        collection.numberOfCompletions = 0
        collection.createdBy = request.user._id
        collection.created_at = new Date()

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: {level: 'local'},
            writeConcern: {w: 'majority'}
        };
        try {
            const transactionResults = await session.withTransaction(async () => {
                // save collection document
                const createdCollection = await collection.save({session})
                responses['collection'] = createdCollection

                for (var i = 0; i < tags.length; i++) {
                    const tagName = tags[i]
                    result = await Tag.findOne({name: tagName})

                    if (result) {
                    } else {
                        var tag = Tag()
                        tag.name = tags[i]
                        tag.type = "collection"
                        createdTags = await tag.save({session})
                    }

                }
            }, transactionOptions)
            if (transactionResults) {
                responses['err_code'] = 0
                response.status(statusCodes.CREATED).send(responses)

            } else {
                console.log("The transaction was intentionally aborted.");
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "Sorry we were not able to save this collection"
                })
            }
        } catch (err) {
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to save this collection"
            })
            console.log("The transaction was aborted due to an unexpected error: " + err);
        } finally {
            session.endSession();
        }
    }
}
const collectionDetail = function (request, response) {
    const {id} = request.params;
    Collection.findById(id, async function (err, collection) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            if (collection) {
                // find child subject who have this collection as their parent
                Subject.find({parent: {_id: id, type: "collection"}}).find(function (err, subjects) {
                    if (err != null) {
                        response.json({
                            err_code: ERR_CODE.success,
                            collection,
                            subjects: []
                        });
                    } else {
                        response.json({
                            err_code: ERR_CODE.success,
                            collection,
                            subjects
                        });
                    }
                });
            } else {
                response.json({
                    err_code: ERR_CODE.collection_not_exist,
                    msg: "Collection is not exist"
                });
            }

        }
    });
}
const findCollection = function (request, response) {
    const {search, category} = request.query

    if (category == null || category == Category.All) {

    } else if (category == Category.collection) {


    } else if (category == Category.Subject) {

    } else if (category == Category.Organization) {

    } else if (category == Category.Collection) {

    } else if (category == Category.Teacher) {

    } else if (category == Category.Student) {

    } else if (category == Category.JobPost) {

    } else if (category == Category.Project) {

    } else if (category == Category.Resource) {

    } else if (category == Category.TeacherBot) {

    }

    if (search == null || search == "") {

    } else {

    }
    response.json({search, category})
    // eventModel.getEventByEventId(eventid, function(err, result){
    //   if (err) {
    //     console.log("error ocurred",err);
    //     return res.json({
    //       success: false,
    //       msg: err.message,
    //       code: constants.ErrorCode
    //     })
    //   } else {
    //     if(result.length>0){
    //       return res.json({
    //         success: true,
    //         msg: 'Success',
    //         code: constants.SuccessCode,
    //         result: result[0]
    //       });
    //     } else {
    //       return res.json({
    //         success: false,
    //         msg: 'There is no Event',
    //         code: constants.NoRecodeError,
    //       });
    //     }
    //   }
    //   console.log('success', result);
    // });
}

const updateCollection = function (request, response) {
    const {
        _id,
        icon,
        name,
        shortDescription,
        description,
        medias,
        tags,
        visibility,
        entry
    } = request.body;

    Collection.findById(_id, async function (err, collection) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            if (collection) {
                collection.icon = icon
                collection.name = name
                collection.shortDescription = shortDescription
                collection.description = description
                collection.medias = medias
                collection.tags = tags
                collection.visibility = visibility
                collection.entry = entry

                // save collection document
                collection.save(function (err) {
                    if (err != null) {
                        response.status(ERR_STATUS.Bad_Request).json({
                            error: err
                        });
                    } else {
                        // save tags to Tag table
                        for (var i = 0; i < tags.length; i++) {
                            const tagName = tags[i]
                            Tag.findOne({name: tagName})
                                .then(result => {
                                    if (result) {
                                    } else {
                                        var tag = Tag()
                                        tag.name = tagName
                                        tag.type = "collection"
                                        tag.save()
                                    }
                                })
                                .catch(error => {
                                })
                        }

                        response.json({
                            err_code: ERR_CODE.success,
                            collection
                        })
                    }
                })
            } else {
                response.json({
                    err_code: ERR_CODE.collection_not_exist,
                    msg: "Collection is not exist"
                });
            }

        }
    });
}

const getCollectionList = function (request, response) {
    const {query} = request.query;
    response.json({query})
}
const deleteCollection = function (request, response) {
    const {id} = request.params;

    Collection.deleteOne({_id: id}, function (err) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                msg: "Collection deleted successfully"
            });
        }
    });
}

const search = function (request, response) {
    console.log(request.body)
    var {
        query,
        sort,
        fields,
    } = request.body;

    var sortField = {"name": 1}
    if (sort == null) {
        sort = Collection_Sort.Newest
    }

    switch (sort) {
        case Collection_Sort.Most_Popular:
            break
        case Collection_Sort.Most_Lesson:
            break
        case Collection_Sort.Newest:
            sortField = {"createdAt": -1}
            break
        case Collection_Sort.Oldest:
            sortField = {"createdAt": 1}
            break
        case Collection_Sort.My_Teacher:
            break
        case Collection_Sort.Highest_Avg:
            break
        case Collection_Sort.Highest_Score:
            break
        case Collection_Sort.Highest_Trans:
            break
    }

    var condition = {}
    if (query && query != "") {
        condition["name"] = {$regex: query, $options: 'i'}
    }
    if (fields == null || fields == "") {
        fields = 'name shortDescription icon medias createdAt'
    }

    Collection.find(condition, fields, {sort: sortField}).limit(100).find(async function (err, collections) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            var result = []
            for (var i = 0; i < collections.length; i++) {
                var item = JSON.parse(JSON.stringify(collections[i]))
                const subjectCount = await Subject.countDocuments({parent: {_id: item._id, type: "collection"}})
                item.subjectCount = subjectCount
                result.push(item)
            }

            response.json({
                err_code: ERR_CODE.success,
                collections: result
            });
        }
    });
}
module.exports = {
    createCollection,
    findCollection,
    getCollectionList,
    deleteCollection,
    collectionDetail,
    updateCollection,
    search
}

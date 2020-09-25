// 'user strict';

const {Collection,Subject,Step,Tag}= require("../models")

const {ERR_STATUS,ERR_CODE,Category,Collection_Sort} = require('../constants/constant')

const createCollection = function (request, response) {
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

    var collection = Collection()
    collection.icon = icon
    collection.name = name
    collection.shortDescription = shortDescription
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
}


const collectionDetail = function(request, response){
    const { id } = request.params;

    Collection.findById(id, async function(err, collection) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            if (collection) {
                // find child subject who have this collection as their parent
                Subject.find({parent: {_id: id, type: "collection"}}).find(function(err, subjects) {
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

const updateCollection = function(request, response){
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

    Collection.findById(_id, async function(err, collection) {
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
                        for (var i = 0; i < tags.length; i++){
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
                            .catch(error => {})
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
const deleteCollection = function(request, response){
    const { id } = request.params;

    Collection.deleteOne({_id: id}, function(err) {
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

const search = function(request, response){
    var { 
        query,
        sort,
        fields,
    } = request.body;

    var sortField = {"name" : 1}
    if (sort == null) {
        sort = Collection_Sort.Newest
    }

    switch (sort) {
        case Collection_Sort.Most_Popular:
            break
        case Collection_Sort.Most_Lesson:
            break
        case Collection_Sort.Newest:
            sortField = {"createdAt" : -1}
            break
        case Collection_Sort.Oldest:
            sortField = {"createdAt" : 1}
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
    
    Collection.find(condition, fields, { sort: sortField}).limit(100).find(async function(err, collections) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            var result = []
            for (var i = 0; i < collections.length; i++){
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

module.exports = {createCollection, findCollection, getCollectionList,deleteCollection,collectionDetail,updateCollection}

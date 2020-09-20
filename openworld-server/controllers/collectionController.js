// 'user strict';

const {Collection,Subject,Step,Tag}= require("../models")

const {ERR_STATUS,ERR_CODE,Category} = require('../constants/constant')

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

const getCollectionList = function (request, response) {
    const {query} = request.query;
    response.json({query})
}

module.exports = {createCollection, findCollection, getCollectionList}

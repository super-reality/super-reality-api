
const {Subject,Tag} = require("../models")
const {ERR_STATUS,ERR_CODE}  = require("../constants/constant")

const createSubject = function(request, response){
    const { 
        parent, 
        icon, 
        name, 
        shortDescription, 
        description, 
        medias, 
        tags, 
        visibility, 
        entry 
    } = request.body;

    var subject = Subject()
    subject.parent = parent
    subject.icon = icon
    subject.name = name
    subject.shortDescription = shortDescription
    subject.description = description
    subject.medias = medias
    subject.tags = tags
    subject.visibility = visibility
    subject.entry = entry
    subject.rating = 0
    subject.ratingCount = 0
    subject.numberOfShares = 0
    subject.numberOfActivations = 0
    subject.numberOfCompletions = 0
    subject.createdBy = request.user._id

    // save subject document
    subject.save(async function (err) {
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
                        tag.type = "subject"
                        tag.save()
                    }
                })
                .catch(error => {})
            }

            response.json({
                err_code: ERR_CODE.success,
                subject
            });
        }
    })
}
module.exports ={createSubject}

const {Tag}  = require("../models")
const {ERR_CODE,ERR_STATUS}  = require("../constants/constant")

const searchTag = function(request, response){
    const { query } = request.params;
    
    Tag.find({name: {$regex: query, $options: 'i'}}, 'name').sort({'name': "asc"}).limit(20).exec(function(err, tags) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            var tagArray = []
            for (var i = 0; i < tags.length; i++) {
                tagArray.push(tags[i].name)
            }
            response.json({
                err_code: ERR_CODE.success,
                tags : tagArray
            });
        }
    });
}
module.exports = {searchTag}

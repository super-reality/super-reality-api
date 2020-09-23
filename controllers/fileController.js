const {S3_ENDPOINT, ERR_CODE} = require("../constants/constant")

const fileupload = require("../utilities/upload")
const path = require('path')

const upload = async function (request, response) {
    const files = request.files

    // check there are parent values
    if (files.length < 1) {
        response.status(ERR_STATUS.Bad_Request).json({
            err_code: ERR_CODE.require_field_missing,
            msg: "There is no file"
        });
        return
    }

    var urls = []
    files.forEach(element => {
        const key = element.fieldname + "-" + Date.now() + path.extname(element.originalname)
        fileupload(element, key, (success, data) => {
        })
        urls.push(S3_ENDPOINT + key)
    });

    response.json({
        err_code: ERR_CODE.success,
        urls
    });
}
module.exports = {upload}

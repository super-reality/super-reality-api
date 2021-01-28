const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define project schema *** */
const supportSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    supportType: {
        type: String,
        required: true,

    },
    supportCategory: {
        type: ObjectId,
        required: false
    },
    description: {
        type: String,
        required: true,
    },
    files: {
        type: Array,
        required: false,
        default: []
    },
    skills: {
        type: Array,
        required: true
    },

    // user id that created this project
    createdBy: {type: ObjectId},
    // created date
    createdAt: {type: Date, default: Date.now}
});

const support = new model("support", supportSchema);

module.exports = support;

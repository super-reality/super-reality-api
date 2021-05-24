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
    vibes: {
        type: Array,
        default: []
    },
    votes: {
        type: Number,
        default: 0
    },
    vibesLevels: {
        type: Array,
        default: []
    },
    // user id that created this project
    creatorInfo: {
        type: Object,
        default: {}
    },
    nestedCommentsCount: {
        type: Number,
        default: 0
    },
    createdBy: {type: ObjectId},
    // created date
    createdAt: {type: Date, default: Date.now}
});

const support = new model("support", supportSchema);

module.exports = support;

const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define project schema *** */
const supportCommentSchema = new Schema({
    ticketId : [{type: ObjectId, ref: 'support'}],
    userId: {
        type: String,
        index:true,
    },
    username: {
        type: String,
        index:true
    },
    timePostted: {
        type: Date, default: Date.now,
        index:true
    },
    ranking: {
        type: Number,
        required: true,
        default: 0
    },
    comment: {
        type: String,
        required: true,
        index:true
    },
    nestedCommentsCount: {
            type: Number,
            default: 0
        },
    nestedComments: {
        type: Array,
        default: []
    },
    createdBy: [{type: ObjectId, ref: 'User'}],
    // created date
    createdAt: {type: Date, default: Date.now}
});

const supportComment = new model("supportComment", supportCommentSchema);

module.exports = supportComment;

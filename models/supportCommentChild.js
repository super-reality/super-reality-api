const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define project schema *** */
const supportCommentChildSchema = new Schema({
    parentId: {type: ObjectId},
    userId: {
        type: String,
        index: true,
    },
    username: {
        type: String,
        index: true
    },
    timePostted: {
        type: Date, default: Date.now,
        index: true
    },
    ranking: {
        type: Number,
        required: true,
        default: 0
    },
    comment: {
        type: String,
        required: true,
        index: true
    },
    nestedCommentsCount: {
        type: Number,
        default: 0
    },
    createdBy: [{type: ObjectId, ref: 'User'}],
    // created date
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type:Date}
});

const supportChildComment = new model("supportCommentChild", supportCommentChildSchema);

module.exports = supportChildComment;

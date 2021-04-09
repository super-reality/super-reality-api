const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const sharedCardSchema = new Schema({
    cardId: {
        type: ObjectId, ref: 'cards',
        required:true,
        index:true
    },
    body: {
        type: String,
        required:true
    },
    commentedBy: {
        type: ObjectId, ref: 'User'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});

const sharedCardSchema = new model("sharedCard", cardCommentSchema);

module.exports = cardComments;

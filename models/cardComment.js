const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const cardCommentSchema = new Schema({
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

const cardComments = new model("cardComments", cardCommentSchema);

module.exports = cardComments;

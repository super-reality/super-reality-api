const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const boardSchema = new Schema({
    // tag name
    title: {
        type: String,
        required: true,
        index: true
    },
    ownerId: {
        type: ObjectId, ref: 'User'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    lastSeenAt: {
        type: Date
    },
    archived: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});

const Boards = new model("boards", boardSchema);

module.exports = Boards;

const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const cardSchema = new Schema({
    boardId: {
        type: ObjectId, ref: 'boards'
    },
    boardColId: {
        type: ObjectId, ref: 'boardIds'
    },

    title: {
        type: String,
        required: true,
        index: true
    },
    subTitle: {
        type: String,
        index: true
    },
    row: {
        type: Number,
        deafult: 0
    },
    description: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: null
    },
    archived: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: ObjectId, ref: 'User'
    },
    updatedBy: {
        type: ObjectId, ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});
const Cards = new model("cards", cardSchema);

module.exports = Cards;

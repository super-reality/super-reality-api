const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const boardIdsSchema = new Schema({
    // tag nam
    boardId: {
        type: ObjectId, ref: 'boards'
    },
    col: {
        type: Number,
        default: 0
    },
    title :{
        type: String,
        allowNull:false,
        required:true
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

const BoardIds = new model("boardIds", boardIdsSchema);

module.exports = BoardIds ;

const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const sharedCardSchema = new Schema({
    cardId: {
        type: ObjectId, ref: 'cards',
        required: true,
        index: true
    },
    sharedUserId: {
        type: ObjectId, ref: 'User',
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});

const sharedCards = new model("sharedCard", sharedCardSchema);

module.exports = sharedCards;

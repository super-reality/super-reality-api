const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const vibeSchema = new Schema({
    // skill name
    title: {
        type: String,
        required: true,
        index: true
    },
    emoji: {
        type: String,
        required: true
    },
    type: {
        type: String,
        index: true
    },
    createdBy: {
        type: ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
    }
});

const Vibe = new model("vibe", vibeSchema);

module.exports = Vibe;

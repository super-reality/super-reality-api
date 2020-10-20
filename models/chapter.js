const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define collection schema *** */
const chapterSchema = new Schema({

    name: {
        type: String,
        required: true,
        index: true
    },
    createdBy: { type: ObjectId },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    steps: { type: Array }

});

const chapter = new model("chapter", chapterSchema);
module.exports = chapter;

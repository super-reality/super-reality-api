const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

const anchorSchema = new Schema({

    name: {
        type: String,

    },
    type: {
        type: String,
        //“record” | “crop” | “url”

    },
    templates: {
        type: Array,
    },
    anchorFunction: {
        type: String,
    },
    x: {
        type: Number,
    },
    y: {
        type: Number,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    cvMatchValue: {
        type: Number,

    },
    cvCanvas: {
        type: Number,
    },
    cvDelay: {
        type: Number,
    },
    cvGrayscale: {
        type: Boolean,
    },
    cvApplyThreshold: {
        type: Boolean,
    },
    cvThreshold: {
        type: Number,
    },
    createdBy: { type: ObjectId },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },


});

const Anchor = new model("Anchor", anchorSchema);

module.exports = Anchor;

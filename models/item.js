const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

const itemSchema = new Schema({

    type: {
        type: String,
        // required: true,
    },
    showPopup: {
        type: Boolean
    },
    name: {
        type: String,
        // required: true,
        index: true
    },
    description: {
        type: String
    },
    relativePos: {
        vertical: {
            type: Number
        },
        horizontal: {
            type: Number
        },
        x: {
            type: Number
        },
        y: {
            type: Number
        }
    },
    time: {
        type: Number
    },
    startTime: {
        type: Number
    },
    endTime: {
        type: Number
    },
    autoStart: {
        type: Boolean
    },
    loop: {

    },

    sourceMedia: {
        type: String
    },

    textContent: {
        type: String
    },
    textSize: {
        type: Number
    },
    textFont: {
        type: String
    },
    textColor: {
        type: String
    },
    textStrength: {
        type: String
    },

    trigger: {
        type: String
    },

    createdBy: { type: ObjectId },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },


});

const Item = new model("Item", itemSchema);

module.exports = Item;

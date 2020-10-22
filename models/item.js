const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

const itemSchema = new Schema({


    name: {
        type: String,
        // required: true,

        default: null,
        index: true
    },
    anchor: {
        type: String,
        default: null
    },
    description: {
        type: String
    },
    relativePos: {
        vertical: {
            type: Number,
            default: 50,
        },
        horizontal: {
            type: Number,
            default: 50,
        },
        x: {
            type: Number,
            default: 0,
        },
        y: {
            type: Number,
            default: 0,
        },
        width: {
            type: Number,
            default: 100,
        },
        height: {
            type: Number,
            default: 100,
        }


    },
    trigger: {
        type: Number,
        default: null
    },
    destination: {
        type: ObjectId,
        default: null,
    },
    transition: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true
    },
    showPopup: {
        type: Boolean,
    },
    url: {
        type: String,
    },
    text: {
        type: String,
    },
    focus: {
        type: String,
    },
    loop: {
        type: Boolean,

    },
    createdBy: {type: ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},


});

const Item = new model("Item", itemSchema);

module.exports = Item;

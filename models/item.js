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
        type: Boolean,
        default: true
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
    effect: {
        type: String,
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
    fullScreen: {
        type: Boolean,
    },
    loop: {
        type: Boolean,

    },
    parameters: {
        type: Object,
        default: {}
    },
    createdBy: {type: ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},


},{ minimize: false });

const Item = new model("Item", itemSchema);


module.exports = Item;

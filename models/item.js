const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId
const enumType = {
    values: ['focus_highlight', 'audio', 'video', 'image', 'dialogue']
    , message: 'Type must have value of focus_highlight, audio, video or dialogue.'
}
const enumFocus = {
    values: ['Mouse Point', 'Rectangle', 'Area Highlight']
    , message: 'Type must have value of Mouse Point, Rectangle or Area Highlight.'
}

const itemSchema = new Schema({

    type: {
        type: String,
        enum: enumType,
        required: [true, 'You must provide a Type value']
    },
    showPopup: {
        type: Boolean,
        required: [
            function (value) {
                if (this.type === 'audio') {
                    return true;
                } else {
                    return false;
                }
            }, "You must provide a showPopup value for Audio items."
        ]
    },
    name: {
        type: String,
        required: [true, 'You must provide a Name value']
    },
    description: {
        type: String
    },
    focus: {
        type: String,
        enum: enumFocus,
        required: [
            function (value) {
                if (this.type === 'video') {
                    return true;
                } else {
                    return false;
                }
            },"You must provide a Focus Value for a video item"
        ]
    },
    relativePos: {
        vertical: {
            type: Number,
            default: 50
        },
        horizontal: {
            type: Number,
            default: 50
        },
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        }
    },
    time: {
        type: Number,
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
        type: Boolean,
        required: [
            function (value) {
                if (this.type === 'image' || 'video') {
                    return true;
                } else {
                    return false;
                }
            },"You must provide a Loop value for a video or image item"
        ]
    },

    url: {
        type: String,
        required: [
            function (value) {
                if (this.type === 'image' || 'video') {
                    return true;
                } else {
                    return false;
                }
            },"You must provide a URL value for a video or image item"
        ]
    },

    text: {
        type: String,
        required: [
            function (value) {
                if (this.type === 'dialogue') {
                    return true;
                } else {
                    return false;
                }
            },"You must provide a text value for a dialogue item"
        ]
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

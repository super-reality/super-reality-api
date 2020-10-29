const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define step schema *** */
const stepSchema = new Schema({


    name: {
        type: String,
        required: true,
        index: true
    },
    items: {
        type: Array
    },
    anchor: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: ObjectId
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},

});

const Step = new model("Step", stepSchema);

module.exports = Step;

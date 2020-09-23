const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define step schema *** */
const stepSchema = new Schema({
    // step Image
    image: {type: String},
    // image function
    imageFunction: {type: Number},
    // additional image function
    additionalFunctions: {type: Array},
    // step name
    name: {
        type: String,
        required: true
    },
    // step long description
    description: {
        type: String,
        required: true
    },
    // trigger
    trigger: {type: Number},
    // next Step action
    next: {type: Number},

    cvMatchValue: {type: Number},
    cvCanvas: {type: Number},
    cvDelay: {type: Number},

    cvGrayscale: {type: Boolean},

    cvApplyThreshold: {type: Boolean},

    cvThreshold: {type: Number},


    // user id that created this step
    createdBy: {type: ObjectId},
    // created date
    createdAt: {type: Date, default: Date.now}
});

const Step = new model("Step", stepSchema);

module.exports = Step;

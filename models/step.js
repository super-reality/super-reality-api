const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define step schema *** */
const stepSchema = new Schema({
    // step Image
    images: { type: Array },
    // image function: ex: [1, 3, 2]
    functions: { type: Array },
    // step name
    name: { 
        type: String, 
        required: true,
        index: true
    },
    // step long description
    description: { 
        type: String, 
        required: true 
    },
    // trigger
    trigger: { type: Number },
    // next Step action
    next: { type: Number },
    // user id that created this step
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now },
    cvMatchValue: { type: Number, default: 990},
    cvCanvas: { type: Number, default: 50},
    cvDelay: { type: Number, default: 100},
    cvGrayscale: { type: Boolean, default: true},
    cvApplyThreshold: { type: Boolean, default: false},
    cvThreshold: { type: Number, default: 127},
  
    
});

const Step = new model("Step", stepSchema);

module.exports = Step;
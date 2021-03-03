const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const subCategorySchema = new Schema({
    // tag name
    name: {
        type: String,
        required: true,
        index: true
    },
    createdBy: {
        type: ObjectId,
        required: true,
    },
    skills : [{type: ObjectId, ref :'Skill'}],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
    }
});

const Subcategory = new model("Subcategory", subCategorySchema);
module.exports = Subcategory;

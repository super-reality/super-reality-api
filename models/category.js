const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const categorySchema = new Schema({
    // tag name
    name: {
        type: String,
        required: true,
        index: true
    },
    subCategories: {
        type: Array,
        default: []
    },
    createdBy: {
        type: ObjectId,
        required: true,
    },
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

const Category = new model("Category", categorySchema);

module.exports = Category;

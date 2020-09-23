const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const tagSchema = new Schema({
    // tag name
    name: { 
        type: String, 
        required: true
    },
    // tag type : either of collection, subject, lesson, organization
    type: { 
        type: String
    },
});

const Tag = new model("Tag", tagSchema);

module.exports = Tag;

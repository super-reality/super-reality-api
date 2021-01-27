const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const skillSchema = new Schema({
    // skill name
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    subSkills: {
        type: Array,
        default: []
    },
    rating: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Skill = new model("Skill", skillSchema);

module.exports = Skill;

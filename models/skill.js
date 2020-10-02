const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const skillSchema = new Schema({
    // skill name
    name: { 
        type: String, 
        required: true,
        index: true
    },
   
    type: { 
        type: String
    },
});

const Skill = new model("Skill", skillSchema);

module.exports = Skill;
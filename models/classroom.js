const {Schema, model} = require("mongoose");

const classroomSchema = new Schema({
    name: {
        type: String,
    }
});

const Classroom = new model("Classroom", classroomSchema);

module.exports = Classroom;

const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define lesson schema *** */
const lessonSchema = new Schema({
    // parent subject id or lesson id
    subject: {
        type: Array,
    },
    // lesson icon url
    icon: {
        type: String,
    },
    // lesson name
    name: {
        type: String,
        required: true,
        index: true,
    },
    // lesson long description
    description: {
        type: String,
        required: true,
    },
    cost: { type: Number },
    // difficulty
    difficulty: { type: Number },
    // medias urls
    medias: { type: Array },
    // tag Array
    skills: { type: Array },
    // visibility
    visibility: { type: Array },

    entry: { type: Number },
    chapters: {
        type: Array
    },
    // lesson Rating
    rating: { type: Number },
    setupScreenshots: {
        type: Array
    },
    setupInstructions: {
        type: String
    },

    setupFiles: {
        type: Array
    },
    // user id that created this lesson
    createdBy: { type: ObjectId },
    // created date
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
const Lesson = new model("Lesson", lessonSchema);

module.exports = Lesson;

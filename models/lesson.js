const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define lesson schema *** */
const lessonSchema = new Schema({
    // parent subject id or lesson id
    subject: {
        type: Array,
        default: []
    },
    // lesson icon url
    icon: {
        type: String,
        default: ''
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
        default: ''
    },
    cost: {
        type: Number,
        default: 0
    },
    // difficulty
    difficulty: {type: Number, default: 0},
    // medias urls
    medias: {type: Array, default: []},
    // tag Array
    skills: {type: Array, default: []},
    // visibility
    visibility: {type: Boolean , default : false},

    entry: {type: Number, default: 0},
    chapters: {
        type: Array, default: []
    },
    // lesson Rating
    rating: {type: Number, default: 0},
    setupScreenshots: {
        type: Array,
        default: []
    },
    setupInstructions: {
        type: String,
        default: ''
    },

    setupFiles: {
        type: Array,
        default: []
    },
    // user id that created this lesson
    createdBy: {type: ObjectId},
    // created date
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date}
});
const Lesson = new model("Lesson", lessonSchema);

module.exports = Lesson;

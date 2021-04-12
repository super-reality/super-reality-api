const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const trelloAttachmentsSchema = new Schema({
    cardId: {
        type: ObjectId, ref: 'cards',
        required: true,
        index: true
    },
    fileName: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date
    }
});

const trelloAttachments = new model("trelloAttachment", trelloAttachmentsSchema);

module.exports = trelloAttachments;

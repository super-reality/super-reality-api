const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

/* *** define tag schema *** */
const supportvotersSchema = new Schema({
    // tag name
    voter: {type: ObjectId, ref: 'user'},
    ticketId: {
        type: ObjectId, ref: 'support'

    },
    upvote: {
        type: Boolean,
        default: false,
    },
    downvote: {
        type: Boolean,
        default: false
    }
})

const SupportTicketVoter = new model("supportVoters", supportvotersSchema);

module.exports = SupportTicketVoter;

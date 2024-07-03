const mongoose = require('mongoose');

const messagescheam = new mongoose.Schema({
    sender: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content: {
        type: String,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    }
}, {
    timestamps:true
})

const message = mongoose.model("message", messagescheam);

module.exports = message;
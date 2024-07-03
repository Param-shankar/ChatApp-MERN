const mongoose = require("mongoose");

const chat = new mongoose.Schema(
  {
    chatname: {
      type: String,
      require: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    GroupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chat);
module.exports = Chat;
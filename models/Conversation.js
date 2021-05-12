const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Messages'
  }],
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
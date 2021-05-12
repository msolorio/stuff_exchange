const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

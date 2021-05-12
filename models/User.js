const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  conversations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

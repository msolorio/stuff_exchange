const mongoose = require('mongoose');

// TODO: timestamps
const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  img: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

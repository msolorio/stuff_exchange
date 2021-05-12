const mongoose = require('mongoose');
const User = require('./User');
const Item = require('./Item');
const Conversation = require('./Conversation');
const Message = require('./Message');

const connectionString = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(connectionString, mongooseOptions);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${connectionString}`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose disconnected to ${connectionString}`);
});
mongoose.connection.on('error', (err) => {
  console.log('Error on mongoose connection:', err);
});

module.exports = {
  User,
  Item,
  Conversation,
  Message,
};


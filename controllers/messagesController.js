const express = require('express');
const db = require('../models');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('req body =>', req.body);
  // conversation id
  // sender
  // body

  const newMessage = {
    sender: req.body.sender,
    body: req.body.message
  };

  db.Message.create(newMessage, (err, createdMessage) => {
    if (err) return console.log(err);

    db.Conversation.findByIdAndUpdate(
      req.body.conversationid,
      { $push: { messages: createdMessage._id } },
      { new: true },
      (err, updatedConvo) => {
        if (err) return console.log(err);
  
        res.redirect(`/conversations/${req.body.conversationid}`);
      }
    )
  });
})

module.exports = router;

const express = require('express');
const db = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {

  const newMessage = {
    sender: req.body.senderid,
    body: req.body.message
  };

  try {
    const createdMessage = await db.Message.create(newMessage);

    await db.Conversation.findByIdAndUpdate(
      req.body.conversationid,
      { $push: { messages: createdMessage._id } },
      { new: true }
    );

    return res.redirect(`/conversations/${req.body.conversationid}`);

  } catch(err) {
    return console.log(err);
  }
});

module.exports = router;

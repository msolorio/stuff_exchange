const express = require('express');
const db = require('../models');
const router = express.Router();





////////////////////////////////////////////////////////
// SHOW A CONVERSATION
////////////////////////////////////////////////////////
function renderConvoShow(req, res, convo, item) {
  return res.render('./conversations/conversationsShow', {
    currentUser: req.session.currentUser,
    conversation: convo,
    item: item
  });
}





router.get('/new', (req, res) => {
  db.Item.findById(req.query.itemid, (err, foundItem) => {
    if (err) return console.log(err);

    res.render('./conversations/conversationsNew', {
      currentUser: req.session.currentUser,
      item: foundItem
    });
  });
})





function findMessageRecipient(req, convo) {
  return convo.members.find((member) => {
    return member.id !== req.session.currentUser._id
  });
}





router.get('/:conversationId', (req, res) => {
  db.Conversation.findById(req.params.conversationId)
    .populate('members')
    .populate({
      path: 'messages',
      populate: { path: 'sender' }
    })
    .populate('item')
    .exec((err, foundConvo) => {
      if (err) return console.log(err);

      // TODO: RENDER CONVO INFO AND MESSAGES TO TEMPLATE
      console.log('found convo ==>', foundConvo);

      const recipient = findMessageRecipient(req, foundConvo);

      console.log('recipient:', recipient);

      // GET MESSAGE RECIPIENT

  
      res.render('./conversations/conversationsShow', {
        currentUser: req.session.currentUser,
        conversation: foundConvo,
        recipient: recipient,
      })
    }
  );
});





////////////////////////////////////////////////////////
// CREATE A NEW CONVERSATION
////////////////////////////////////////////////////////
router.post('/', (req, res) => {
  console.log('req body ==>', req.body)

  // The sender
  // The receiver
  // The message
  // The item associated

  // CREATE MESSAGE
  const newMessage = {
    sender: req.body.sender,
    body: req.body.message
  };

  db.Message.create(newMessage, (err, createdMessage) => {
    if (err) return console.log(err);

    const newConversation = {
      members: [req.body.sender, req.body.receiver],
      messages: [createdMessage],
      item: req.body.item
    };

    db.Conversation.create(newConversation, (err, createdConvo) => {
      if (err) return console.log(err);

      res.redirect(`/conversations/${createdConvo._id}`);
    });
  });
});

module.exports = router;

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





// TODO: BREAK OUT INTO 2 SEPARATE TEMPLATES,
// 1 FOR NEW CONVO AND ONE FOR EXISTING CONVO
router.get('/:conversationId', (req, res) => {
  
  // Render new convo
  if (req.params.conversationId === 'new') {

    db.Item.findById(req.query.itemid, (err, foundItem) => {
      if (err) return console.log(err);

      return renderConvoShow(req, res, null, foundItem);
    });

  // Find existing convo and render
  } else {

    db.Conversation.findById(req.params.conversationId)
      .populate('members messages item')
      .exec((err, foundConvo) => {
        if (err) return console.log(err);

        // TODO: RENDER CONVO INFO AND MESSAGES TO TEMPLATE
        console.log('found convo ==>', foundConvo);
    
        return renderConvoShow(req, res, foundConvo, null);
      }
    );
  } 
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

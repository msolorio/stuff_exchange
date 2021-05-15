const express = require('express');
const db = require('../models');
const router = express.Router();



// IF DECIDE TO HAVE MORE THAN 2 PEOPLE PER CONVO
// UPDATE TO RETURN AN ARRAY OF OPPOSITE MEMBERS
function findOppositeConvoMember(req, convo) {
  return convo.members.find((member) => {
    return member.id !== req.session.currentUser._id
  });
}



////////////////////////////////////////////////////////
// CONVERSATION INDEX
////////////////////////////////////////////////////////
router.get('/', async (req, res) => {
  try {
    const allUsersConvos = await db.Conversation.find({
      members: req.session.currentUser._id
    })
    .populate({
      path: 'messages',
      populate: { path: 'sender' }
    })
    .populate('members')
    .populate('item');

    const modifiedConvos = allUsersConvos.map((convo) => {
      convo.oppositeMember = findOppositeConvoMember(req, convo);
      convo.lastMessage = convo.messages[convo.messages.length - 1];
      convo.lastSender = (
        convo.lastMessage.sender.id === req.session.currentUser._id
        ? 'You'
        : convo.lastMessage.sender.username
      );
      
      return convo;
    });

    res.render('./conversations/conversationsIndex', {
      modifiedConvos,
      currentUser: req.session.currentUser
    });

  } catch (err) {
    return console.log(err);
  }
});





////////////////////////////////////////////////////////
// SHOW NEW CONVERSATION CREATOR FORM
////////////////////////////////////////////////////////
router.get('/new', async (req, res) => {
  try {
    const foundItem = await db.Item.findById(req.query.itemid);

    res.render('./conversations/conversationsNew', {
      currentUser: req.session.currentUser,
      item: foundItem
    });

  } catch (err) {
    return console.log(err);
  }
});






////////////////////////////////////////////////////////
// SHOW A CONVERSATION
////////////////////////////////////////////////////////
router.get('/:conversationId', async (req, res) => {
  try {
    const foundConvo = await db.Conversation
      .findById(req.params.conversationId)
      .populate({
        path: 'messages',
        populate: { path: 'sender' }
      })
      .populate('members')
      .populate('item')
      .exec();

    if (!foundConvo) return res.redirect(`/users/myaccount`);

    const recipient = findOppositeConvoMember(req, foundConvo);

    console.log('foundConvo:', foundConvo);

    res.render('./conversations/conversationsShow', {
      currentUser: req.session.currentUser,
      conversation: foundConvo,
      recipient: recipient,
    });

  } catch (err) {
    console.log(err);
  }
});





////////////////////////////////////////////////////////
// CREATE A NEW CONVERSATION
////////////////////////////////////////////////////////
router.post('/', async (req, res) => {
  console.log('req body ==>', req.body)

// On Convo create add convo to User
// On Item create add item to User

  // CREATE MESSAGE
  const newMessage = {
    sender: req.body.sender,
    body: req.body.message
  };

  try {
    const createdMessage = await db.Message.create(newMessage);

    const newConversation = {
      members: [req.body.sender, req.body.receiver],
      messages: [createdMessage],
      item: req.body.item
    };

    const createdConvo = await db.Conversation.create(newConversation);

    console.log('created convo ==>', createdConvo);

    await db.User.findByIdAndUpdate(
      req.session.currentUser._id,
      { $push: { conversations: createdConvo._id } }
    );

    await db.User.findByIdAndUpdate(
      req.body.receiver,
      { $push: { conversations: createdConvo._id } }
    );

    return res.redirect(`/conversations/${createdConvo._id}`);

  } catch(err) {
    
    return console.log(err);

  }
});

module.exports = router;

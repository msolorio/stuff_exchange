const express = require('express');
require('dotenv').config();
const router = express.Router();
const protectRoute = require('../utilities/protectRoute');
const db = require('../models');



// Items Index Route ===========================================//
router.get('/', protectRoute, async (req, res) => {
  const allItems = await db.Item.find({});

  res.render('./items/itemsIndex', {
    allItems: allItems,
    currentUser: req.session.currentUser
  });
});




// My Items ===================================================//
router.get('/myitems', protectRoute, async (req, res) => {
  // Get the logged in user's items
  db.Item.find({ seller: req.session.currentUser._id }, (err, usersItems) => {
    // Render template passing in items data
    res.render('./items/itemsMyItems', {
      usersItems: usersItems,
      currentUser: req.session.currentUser
    });
  });
});



// Items New Route ============================================//
router.get('/new', protectRoute, (req, res) => {
  res.render('./items/itemsNew', {
    currentUser: req.session.currentUser,
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY
  });
});



// Items Show Route ===========================================//
router.get('/:itemId', protectRoute, async (req, res) => {
  const foundItem = await db.Item.findById(req.params.itemId).populate('seller').exec();

  const userIsSeller = req.session.currentUser._id === foundItem.seller.id;

  res.render('./items/itemsShow', {
    item: foundItem,
    userIsSeller: userIsSeller,
    currentUser: req.session.currentUser
  });
});




router.post('/', protectRoute, async (req, res) => {
  const newItem = {
    itemName: req.body.itemName,
    description: req.body.description,
    img: req.body.img,
    price: Number(req.body.price),
    seller: req.session.currentUser._id
  }

  try {
    const createdItem = await db.Item.create(newItem);

    res.redirect(`/items/${createdItem._id}`);
  } catch(err) {
    console.log(err);
    res.redirect('/items/new?message=There was an error creating your item in the database');
  }
});




router.get('/:itemId/edit', protectRoute, async (req, res) => {
  // Get data for item by id
  const item = await db.Item.findById(req.params.itemId);

  // Serve up edit template
  res.render('./items/itemsEdit', { item });
});




router.put('/:itemId', protectRoute, async (req, res) => {
  db.Item.findByIdAndUpdate(
    req.params.itemId,
    req.body,
    { new: true },
    (err, updatedItem) => {
      if (err) return console.log(err);

      res.redirect(`/items/${req.params.itemId}`);
    }
  )
});




router.delete('/:itemId', protectRoute, async (req, res) => {  
  await db.Item.findByIdAndDelete(req.params.itemId);

  res.redirect('/items');
});

module.exports = router;

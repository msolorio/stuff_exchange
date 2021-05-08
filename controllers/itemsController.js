const express = require('express');
const router = express.Router();
const protectRoute = require('../utilities/protectRoute');
const db = require('../models');



// Items Index Route ===========================================//
router.get('/', protectRoute, async (req, res) => {
  const allItems = await db.Item.find({});

  console.log('allItems ==>', allItems);

  res.render('./items/itemsIndex', { allItems });
});



// Items New Route ============================================//
router.get('/new', protectRoute, (req, res) => {
  console.log('Made GET to /items/new');
  res.render('./items/itemsNew');
});



// Items Show Route ===========================================//
router.get('/:itemId', protectRoute, async (req, res) => {

  // Get Item by id
  const itemById = await db.Item.findById(req.params.itemId).populate('seller').exec();

  console.log('itemById:', itemById);
  // pass item data to template
  res.render('./items/itemsShow', {
    item: itemById
  });
});




router.post('/', protectRoute, async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.session.currentUser:', req.session.currentUser);

  console.log('Hit POST to /item');

  const newItem = {
    itemName: req.body.itemName,
    description: req.body.description,
    img: req.body.img,
    price: Number(req.body.price),
    seller: req.session.currentUser._id
  }

  try {
    // Create new item
    const createdItem = await db.Item.create(newItem);

    res.redirect(`/items/${createdItem._id}`);
  } catch(err) {
    console.log(err);
    res.redirect('/items/new?message=There was an error creating your item in the database');
  }

  // Direct to Item show page
});



router.delete('/:itemId', protectRoute, async (req, res) => {
  console.log(`hit DELETE on /item/${req.params.itemId}`);
  
  res.redirect('/items');
});

module.exports = router;

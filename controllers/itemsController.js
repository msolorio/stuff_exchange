const express = require('express');
const router = express.Router();
const protectRoute = require('../utilities/protectRoute');
const db = require('../models');


router.get('/new', protectRoute, (req, res) => {
  console.log('Made GET to /items/new');
  res.render('items/newItem');
});

router.get('/:itemId', protectRoute, async (req, res) => {
  // Get Item by id
  const itemById = await db.Item.findById(req.params.itemId).populate('seller').exec();

  console.log('itemById:', itemById);
  // pass item data to template
  res.render('items/showItem', {
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

    console.log('createdItem:', createdItem);

    res.redirect(`/items/${createdItem._id}`);
  } catch(err) {
    console.log(err);
    res.redirect('/items/new?message=There was an error creating your item in the database');
  }

  // Direct to Item show page
});

module.exports = router;

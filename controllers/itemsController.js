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




// My Items ===================================================//
router.get('/myitems', protectRoute, async (req, res) => {
  // Get the logged in user's items
  db.Item.find({ seller: req.session.currentUser._id }, (err, usersItems) => {
    // Render template passing in items data
    res.render('./items/itemsMyItems', { usersItems });
  });
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




router.get('/:itemId/edit', protectRoute, async (req, res) => {
  // Get data for item by id
  const item = await db.Item.findById(req.params.itemId);

  // Serve up edit template
  res.render('./items/itemsEdit', { item });
});




router.put('/:itemId', protectRoute, async (req, res) => {
  // Update item
  console.log(req.body);
  // 
  db.Item.findByIdAndUpdate(
    req.params.itemId,
    req.body,
    { new: true },
    (err, updatedItem) => {
      if (err) return console.log(err);

      res.redirect(`/items/${req.params.itemId}`);
    }
  )

})




router.delete('/:itemId', protectRoute, async (req, res) => {
  console.log(`hit DELETE on /item/${req.params.itemId}`);
  
  await db.Item.findByIdAndDelete(req.params.itemId);

  res.redirect('/items');
});

module.exports = router;

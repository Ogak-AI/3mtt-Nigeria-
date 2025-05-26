const express = require('express');
const router = express.Router();
let items = require('../data/store');

// GET all items
router.get('/', (req, res) => {
  res.json(items);
});

// GET item by ID
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id == req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST new item
router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const newItem = {
    id: items.length + 1,
    name,
    description
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item
router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  const item = items.find(i => i.id == req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  item.name = name;
  item.description = description;
  res.json(item);
});

// DELETE item
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  const deleted = items.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;

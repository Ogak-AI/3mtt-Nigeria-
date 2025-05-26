const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
let items = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop for development' },
  { id: 2, name: 'Mouse', description: 'Wireless optical mouse' },
  { id: 3, name: 'Keyboard', description: 'Mechanical keyboard with RGB lighting' }
];

let nextId = 4;

// Root route - Hello World
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello, World!',
    api: 'Items REST API'
  });
});

// GET /items - Get all items
app.get('/items', (req, res) => {
  res.json({
    success: true,
    data: items
  });
});

// GET /items/:id - Get single item
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  res.json({
    success: true,
    data: item
  });
});

// POST /items - Create new item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name and description are required'
    });
  }
  
  const newItem = {
    id: nextId++,
    name,
    description
  };
  
  items.push(newItem);
  
  res.status(201).json({
    success: true,
    data: newItem
  });
});

// PUT /items/:id - Update item
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name and description are required'
    });
  }
  
  item.name = name;
  item.description = description;
  
  res.json({
    success: true,
    data: item
  });
});

// DELETE /items/:id - Delete item
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }
  
  const deletedItem = items.splice(itemIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedItem
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

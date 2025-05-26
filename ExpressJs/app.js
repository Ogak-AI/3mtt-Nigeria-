const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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

// Validation middleware
const validateItem = (req, res, next) => {
  const { name, description } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name is required and must be a non-empty string'
    });
  }
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Description is required and must be a non-empty string'
    });
  }
  
  // Trim whitespace
  req.body.name = name.trim();
  req.body.description = description.trim();
  
  next();
};

// Helper function to find item by ID
const findItemById = (id) => {
  return items.find(item => item.id === parseInt(id));
};

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello, World!',
    info: 'Simple REST API with Express.js',
    version: '1.0.0',
    endpoints: {
      'GET /': 'This message',
      'GET /items': 'Get all items',
      'GET /items/:id': 'Get item by ID',
      'POST /items': 'Create new item',
      'PUT /items/:id': 'Update item by ID',
      'DELETE /items/:id': 'Delete item by ID'
    }
  });
});

// GET /items - Retrieve all items
app.get('/items', (req, res) => {
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// GET /items/:id - Retrieve a single item by ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'ID must be a valid number'
    });
  }
  
  const item = findItemById(id);
  
  if (!item) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with ID ${id} not found`
    });
  }
  
  res.json({
    success: true,
    data: item
  });
});

// POST /items - Create a new item
app.post('/items', validateItem, (req, res) => {
  const { name, description } = req.body;
  
  // Check if item with same name already exists
  const existingItem = items.find(item => 
    item.name.toLowerCase() === name.toLowerCase()
  );
  
  if (existingItem) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Item with this name already exists'
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
    message: 'Item created successfully',
    data: newItem
  });
});

// PUT /items/:id - Update an item by ID
app.put('/items/:id', validateItem, (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'ID must be a valid number'
    });
  }
  
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with ID ${id} not found`
    });
  }
  
  const { name, description } = req.body;
  
  // Check if another item with same name exists (excluding current item)
  const existingItem = items.find(item => 
    item.name.toLowerCase() === name.toLowerCase() && item.id !== id
  );
  
  if (existingItem) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Another item with this name already exists'
    });
  }
  
  // Update the item
  items[itemIndex] = {
    ...items[itemIndex],
    name,
    description
  };
  
  res.json({
    success: true,
    message: 'Item updated successfully',
    data: items[itemIndex]
  });
});

// DELETE /items/:id - Delete an item by ID
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'ID must be a valid number'
    });
  }
  
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with ID ${id} not found`
    });
  }
  
  const deletedItem = items.splice(itemIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Item deleted successfully',
    data: deletedItem
  });
});

// Error handling middleware for invalid routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /items',
      'GET /items/:id',
      'POST /items',
      'PUT /items/:id',
      'DELETE /items/:id'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON format'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('- GET    /');
  console.log('- GET    /items');
  console.log('- GET    /items/:id');
  console.log('- POST   /items');
  console.log('- PUT    /items/:id');
  console.log('- DELETE /items/:id');
});

module.exports = app;

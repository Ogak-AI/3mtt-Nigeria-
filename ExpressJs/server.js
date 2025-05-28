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

// Validation middleware
const validateItem = (req, res, next) => {
  const { name, description } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Name is required and must be a non-empty string'
    });
  }
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Description is required and must be a non-empty string'
    });
  }
  
  next();
};

// Helper function to find item by ID
const findItemById = (id) => {
  return items.find(item => item.id === parseInt(id));
};

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello, World!',
    apiVersion: '1.0.0',
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
  try {
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve items'
    });
  }
});

// GET /items/:id - Retrieve a single item by ID
app.get('/items/:id', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve item'
    });
  }
});

// POST /items - Create a new item
app.post('/items', validateItem, (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newItem = {
      id: nextId++,
      name: name.trim(),
      description: description.trim()
    };
    
    items.push(newItem);
    
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create item'
    });
  }
});

// PUT /items/:id - Update an item by ID
app.put('/items/:id', validateItem, (req, res) => {
  try {
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
    
    items[itemIndex] = {
      id: id,
      name: name.trim(),
      description: description.trim()
    };
    
    res.json({
      success: true,
      message: 'Item updated successfully',
      data: items[itemIndex]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update item'
    });
  }
});

// DELETE /items/:id - Delete an item by ID
app.delete('/items/:id', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete item'
    });
  }
});

// Error handling for invalid routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
});

module.exports = app;

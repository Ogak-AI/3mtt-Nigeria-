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

// Validation helper function
const validateItem = (item) => {
  const errors = [];
  
  if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!item.description || typeof item.description !== 'string' || item.description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  return errors;
};

// Helper function to find item by ID
const findItemById = (id) => {
  const numId = parseInt(id);
  if (isNaN(numId)) return null;
  return items.find(item => item.id === numId);
};

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello, World!',
    info: 'Welcome to the Items REST API',
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
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /items/:id - Retrieve a single item by ID
app.get('/items/:id', (req, res) => {
  try {
    const item = findItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${req.params.id} not found`
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST /items - Create a new item
app.post('/items', (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate input
    const validationErrors = validateItem({ name, description });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Create new item
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
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT /items/:id - Update an item by ID
app.put('/items/:id', (req, res) => {
  try {
    const item = findItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${req.params.id} not found`
      });
    }
    
    const { name, description } = req.body;
    
    // Validate input
    const validationErrors = validateItem({ name, description });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Update item
    item.name = name.trim();
    item.description = description.trim();
    
    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE /items/:id - Delete an item by ID
app.delete('/items/:id', (req, res) => {
  try {
    const itemIndex = items.findIndex(item => item.id === parseInt(req.params.id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${req.params.id} not found`
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
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Error handling for invalid routes (404)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
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

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/`);
});

module.exports = app;

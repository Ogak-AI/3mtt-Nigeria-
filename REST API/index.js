// index.js - Entry point for our Express REST API
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
const items = [
  { id: 1, name: 'Item 1', description: 'This is the first item' },
  { id: 2, name: 'Item 2', description: 'This is the second item' },
  { id: 3, name: 'Item 3', description: 'This is the third item' }
];

// Helper function to find the next available ID
const getNextId = () => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// GET all items
app.get('/items', (req, res) => {
  res.json(items);
});

// GET single item by ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// POST new item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  
  // Validate request body
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  
  const newItem = {
    id: getNextId(),
    name,
    description
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const { name, description } = req.body;
  
  // Validate request body
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  // Update the item
  items[itemIndex] = {
    id,
    name,
    description
  };
  
  res.json(items[itemIndex]);
});

// DELETE item
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  // Remove the item
  const deletedItem = items.splice(itemIndex, 1)[0];
  
  res.json({ message: 'Item deleted successfully', item: deletedItem });
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

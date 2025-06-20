const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
let items = [
    { id: 1, name: 'Laptop', description: 'High-performance laptop for work and gaming' },
    { id: 2, name: 'Smartphone', description: 'Latest model smartphone with advanced features' },
    { id: 3, name: 'Headphones', description: 'Noise-cancelling wireless headphones' }
];

let nextId = 4;

// Helper function to validate item data
const validateItem = (item) => {
    const errors = [];
    
    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
        errors.push('Name is required and must be a non-empty string');
    }
    
    if (!item.description || typeof item.description !== 'string' || item.description.trim() === '') {
        errors.push('Description is required and must be a non-empty string');
    }
    
    return errors;
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
            error: 'Internal server error'
        });
    }
});

// GET /items/:id - Retrieve a single item by ID
app.get('/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format. ID must be a number.'
            });
        }
        
        const item = findItemById(id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        
        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// POST /items - Create a new item
app.post('/items', (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Validate input data
        const validationErrors = validateItem({ name, description });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
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
            error: 'Internal server error'
        });
    }
});

// PUT /items/:id - Update an item by ID
app.put('/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format. ID must be a number.'
            });
        }
        
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        
        const { name, description } = req.body;
        
        // Validate input data
        const validationErrors = validateItem({ name, description });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
            });
        }
        
        // Update item
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
            success: false,
            error: 'Internal server error'
        });
    }
});

// DELETE /items/:id - Delete an item by ID
app.delete('/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format. ID must be a number.'
            });
        }
        
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
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
            error: 'Internal server error'
        });
    }
});

// Error handling for invalid routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: 'Internal server error'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Visit http://localhost:${port} to see the API`);
});

module.exports = app;

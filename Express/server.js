const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-Memory Data Store
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

let nextId = 4;

// Validation Helpers
const validateUser = (user) => {
  const errors = [];
  
  if (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!user.email || typeof user.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('Email must be a valid email address');
  }
  
  if (user.age !== undefined) {
    if (typeof user.age !== 'number' || user.age < 0 || user.age > 150) {
      errors.push('Age must be a number between 0 and 150');
    }
  }
  
  return errors;
};

const validateUserId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
};

// Error Handler
const handleError = (res, statusCode, message, details = null) => {
  const errorResponse = {
    error: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    errorResponse.details = details;
  }
  
  return res.status(statusCode).json(errorResponse);
};

// Routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the RESTful API',
    version: '1.0.0',
    endpoints: {
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create a new user',
      'PUT /api/users/:id': 'Update user by ID',
      'DELETE /api/users/:id': 'Delete user by ID'
    }
  });
});

// GET /api/users - Get all users with optional filtering and pagination
app.get('/api/users', (req, res) => {
  try {
    let filteredUsers = [...users];
    const { name, email, minAge, maxAge, page = 1, limit = 10 } = req.query;
    
    // Apply filters
    if (name) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    if (email) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(email.toLowerCase())
      );
    }
    
    if (minAge) {
      const min = parseInt(minAge);
      if (!isNaN(min)) {
        filteredUsers = filteredUsers.filter(user => user.age >= min);
      }
    }
    
    if (maxAge) {
      const max = parseInt(maxAge);
      if (!isNaN(max)) {
        filteredUsers = filteredUsers.filter(user => user.age <= max);
      }
    }
    
    // Apply pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limitNum)
      }
    });
  } catch (error) {
    handleError(res, 500, 'Internal server error', error.message);
  }
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateUserId(id)) {
      return handleError(res, 400, 'Invalid user ID format');
    }
    
    const userId = parseInt(id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return handleError(res, 404, 'User not found');
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    handleError(res, 500, 'Internal server error', error.message);
  }
});

// POST /api/users - Create a new user
app.post('/api/users', (req, res) => {
  try {
    const { name, email, age } = req.body;
    const userData = { name, email, age };
    
    // Validate input
    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
      return handleError(res, 400, 'Validation failed', validationErrors);
    }
    
    // Check for duplicate email
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return handleError(res, 409, 'User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: nextId++,
      name: name.trim(),
      email: email.toLowerCase(),
      age: age || null
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    handleError(res, 500, 'Internal server error', error.message);
  }
});

// PUT /api/users/:id - Update user by ID
app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    
    if (!validateUserId(id)) {
      return handleError(res, 400, 'Invalid user ID format');
    }
    
    const userId = parseInt(id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return handleError(res, 404, 'User not found');
    }
    
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    
    // Validate update data
    const validationErrors = validateUser({ ...users[userIndex], ...updateData });
    if (validationErrors.length > 0) {
      return handleError(res, 400, 'Validation failed', validationErrors);
    }
    
    // Check for duplicate email (excluding current user)
    if (email) {
      const existingUser = users.find(u => 
        u.id !== userId && u.email.toLowerCase() === email.toLowerCase()
      );
      if (existingUser) {
        return handleError(res, 409, 'User with this email already exists');
      }
    }
    
    // Update user
    if (name !== undefined) users[userIndex].name = name.trim();
    if (email !== undefined) users[userIndex].email = email.toLowerCase();
    if (age !== undefined) users[userIndex].age = age;
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: users[userIndex]
    });
  } catch (error) {
    handleError(res, 500, 'Internal server error', error.message);
  }
});

// DELETE /api/users/:id - Delete user by ID
app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateUserId(id)) {
      return handleError(res, 400, 'Invalid user ID format');
    }
    
    const userId = parseInt(id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return handleError(res, 404, 'User not found');
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    handleError(res, 500, 'Internal server error', error.message);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    totalUsers: users.length
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  handleError(res, 404, 'Endpoint not found', `${req.method} ${req.originalUrl} is not a valid endpoint`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  handleError(res, 500, 'Internal server error', 'Something went wrong');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;

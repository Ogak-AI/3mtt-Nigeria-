# Express.js REST API Assignment

## Overview
This is a simple REST API built with Express.js that implements CRUD operations for managing items. Each item has an `id`, `name`, and `description`.

## Setup Instructions

### Prerequisites
- Node.js (version 14+)
- npm

### Installation
1. Save the provided files (`app.js` and `package.json`) in a project folder
2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Root Route - Hello World
**GET** `/`
- Returns welcome message and API information

### 2. Get All Items
**GET** `/items`
- Retrieves all items from the data store

### 3. Get Item by ID
**GET** `/items/:id`
- Retrieves a specific item by ID
- Returns 404 if item not found

### 4. Create New Item
**POST** `/items`
- Creates a new item
- Requires JSON body with `name` and `description`
- Returns 400 for validation errors

### 5. Update Item
**PUT** `/items/:id`
- Updates an existing item
- Requires JSON body with `name` and `description`
- Returns 404 if item not found

### 6. Delete Item
**DELETE** `/items/:id`
- Deletes an item by ID
- Returns 404 if item not found

## Testing Examples

### Using cURL

**1. Get Hello World message:**
```bash
curl http://localhost:3000/
```

**2. Get all items:**
```bash
curl http://localhost:3000/items
```

**3. Get specific item:**
```bash
curl http://localhost:3000/items/1
```

**4. Create new item:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Smartphone", "description": "Latest model smartphone"}'
```

**5. Update item:**
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Gaming Laptop", "description": "High-end gaming laptop"}'
```

**6. Delete item:**
```bash
curl -X DELETE http://localhost:3000/items/1
```

### Using Postman

**Create Item Example:**
- Method: POST
- URL: `http://localhost:3000/items`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Tablet",
  "description": "10-inch tablet for reading"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": 4,
    "name": "Tablet",
    "description": "10-inch tablet for reading"
  }
}
```

## Error Handling

The API implements proper error handling with appropriate HTTP status codes:

- **200** - Success (GET, PUT, DELETE)
- **201** - Created (POST)
- **400** - Bad Request (validation errors)
- **404** - Not Found (item or route not found)
- **500** - Internal Server Error

### Error Response Format:
```json
{
  "error": "Error Type",
  "message": "Detailed error description"
}
```

## Data Validation

The API validates:
- Required fields (`name` and `description`)
- Data types (must be strings)
- Non-empty values (after trimming whitespace)
- Duplicate names (prevents creating items with same name)
- Valid ID parameters (must be numbers)

## Features Implemented

✅ **API Setup and Middleware**
- Express.js application initialization
- `express.json()` middleware for parsing JSON
- `express.urlencoded()` middleware for form data
- Root route returning "Hello, World!" message

✅ **RESTful Route Implementation**
- All CRUD endpoints implemented
- Proper HTTP methods and status codes
- RESTful URL structure

✅ **CRUD Functionality**
- In-memory data store (array)
- Create, Read, Update, Delete operations
- Auto-incrementing ID system

✅ **Code Structure and Best Practices**
- Modular validation middleware
- Helper functions for reusability
- Consistent response format
- Proper error handling

✅ **Error Handling and Validation**
- Input validation middleware
- Appropriate HTTP status codes
- Meaningful error messages
- 404 handling for invalid routes

✅ **API Testing & Documentation**
- Complete setup instructions
- Example requests for all endpoints
- Sample responses provided
- cURL and Postman examples included

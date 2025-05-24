# Express.js REST API

A simple REST API built with Express.js for managing items. This API demonstrates CRUD operations with proper error handling and validation.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ In-memory data storage
- ✅ Input validation
- ✅ Comprehensive error handling
- ✅ RESTful API design
- ✅ JSON responses with consistent structure

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone or download the project files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## API Documentation

### Base URL
```
http://localhost:3000
```

### Data Structure
Each item has the following structure:
```json
{
  "id": 1,
  "name": "Item Name",
  "description": "Item Description"
}
```

### Endpoints

#### 1. Root Endpoint
- **URL:** `GET /`
- **Description:** Returns welcome message and available endpoints
- **Response:**
```json
{
  "message": "Hello, World!",
  "info": "Welcome to the Items REST API",
  "endpoints": {
    "GET /": "This message",
    "GET /items": "Get all items",
    "GET /items/:id": "Get item by ID",
    "POST /items": "Create new item",
    "PUT /items/:id": "Update item by ID",
    "DELETE /items/:id": "Delete item by ID"
  }
}
```

#### 2. Get All Items
- **URL:** `GET /items`
- **Description:** Retrieve all items
- **Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop for development"
    },
    {
      "id": 2,
      "name": "Mouse",
      "description": "Wireless optical mouse"
    }
  ]
}
```

#### 3. Get Single Item
- **URL:** `GET /items/:id`
- **Description:** Retrieve a single item by ID
- **Parameters:** `id` (integer) - Item ID
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop for development"
  }
}
```
- **Error Response (404):**
```json
{
  "success": false,
  "message": "Item with ID 999 not found"
}
```

#### 4. Create New Item
- **URL:** `POST /items`
- **Description:** Create a new item
- **Request Body:**
```json
{
  "name": "New Item",
  "description": "Description of the new item"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": 4,
    "name": "New Item",
    "description": "Description of the new item"
  }
}
```
- **Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required and must be a non-empty string",
    "Description is required and must be a non-empty string"
  ]
}
```

#### 5. Update Item
- **URL:** `PUT /items/:id`
- **Description:** Update an existing item
- **Parameters:** `id` (integer) - Item ID
- **Request Body:**
```json
{
  "name": "Updated Item Name",
  "description": "Updated description"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Item Name",
    "description": "Updated description"
  }
}
```

#### 6. Delete Item
- **URL:** `DELETE /items/:id`
- **Description:** Delete an item by ID
- **Parameters:** `id` (integer) - Item ID
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": {
    "id": 1,
    "name": "Deleted Item",
    "description": "This item was deleted"
  }
}
```

## Error Handling

The API implements comprehensive error handling:

- **400 Bad Request:** Invalid input data or validation errors
- **404 Not Found:** Item not found or invalid route
- **500 Internal Server Error:** Server-side errors

All error responses follow this structure:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Only for validation errors
}
```

## Example API Requests

### Using cURL

#### Get all items:
```bash
curl -X GET http://localhost:3000/items
```

#### Get single item:
```bash
curl -X GET http://localhost:3000/items/1
```

#### Create new item:
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Smartphone","description":"Latest model smartphone"}'
```

#### Update item:
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Gaming Laptop","description":"High-end gaming laptop"}'
```

#### Delete item:
```bash
curl -X DELETE http://localhost:3000/items/1
```

### Using JavaScript (fetch)

#### Get all items:
```javascript
fetch('http://localhost:3000/items')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Create new item:
```javascript
fetch('http://localhost:3000/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Tablet',
    description: '10-inch tablet for productivity'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Testing with Postman

### Collection Setup
1. Create a new collection in Postman
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:3000`

### Test Requests

#### 1. GET All Items
- Method: GET
- URL: `{{baseUrl}}/items`

#### 2. GET Single Item
- Method: GET
- URL: `{{baseUrl}}/items/1`

#### 3. POST Create Item
- Method: POST
- URL: `{{baseUrl}}/items`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Test Item",
  "description": "This is a test item"
}
```

#### 4. PUT Update Item
- Method: PUT
- URL: `{{baseUrl}}/items/1`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Updated Test Item",
  "description": "This item has been updated"
}
```

#### 5. DELETE Item
- Method: DELETE
- URL: `{{baseUrl}}/items/1`

### Expected Status Codes
- GET requests: 200 (success) or 404 (not found)
- POST requests: 201 (created) or 400 (validation error)
- PUT requests: 200 (success), 404 (not found), or 400 (validation error)
- DELETE requests: 200 (success) or 404 (not found)

## Project Structure

```
ExpressJs REST API/
├── server.js          # Main application file
├── package.json       # Project dependencies and scripts
└── README.md         # This documentation file
```

## Validation Rules

- **name**: Required, must be a non-empty string
- **description**: Required, must be a non-empty string
- **id**: Auto-generated, integer value

## Notes

- This API uses in-memory storage, so data will be lost when the server restarts
- The API starts with 3 sample items pre-loaded
- All responses use JSON format
- The API follows RESTful conventions

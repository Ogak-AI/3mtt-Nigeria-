# Simple REST API with Express.js

A basic REST API built with Express.js that provides CRUD operations for managing items. This project demonstrates fundamental concepts of Node.js, Express.js, and RESTful API design.

## Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ In-memory data storage
- ✅ Input validation and error handling
- ✅ Proper HTTP status codes
- ✅ JSON response format
- ✅ Middleware implementation
- ✅ Route parameter validation

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

### Production Mode
```bash
npm start
```

### Development Mode (with auto-restart)
```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Available Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message and API documentation |
| GET | `/items` | Retrieve all items |
| GET | `/items/:id` | Retrieve a specific item by ID |
| POST | `/items` | Create a new item |
| PUT | `/items/:id` | Update an existing item |
| DELETE | `/items/:id` | Delete an item |

## API Documentation

### 1. Welcome Message
**GET** `/`

Returns a welcome message and available endpoints.

**Response:**
```json
{
  "message": "Hello, World!",
  "info": "Simple REST API with Express.js",
  "version": "1.0.0",
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

### 2. Get All Items
**GET** `/items`

Retrieves all items from the data store.

**Response:**
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

### 3. Get Item by ID
**GET** `/items/:id`

Retrieves a specific item by its ID.

**Parameters:**
- `id` (number): The ID of the item

**Success Response (200):**
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

**Error Response (404):**
```json
{
  "error": "Not Found",
  "message": "Item with ID 999 not found"
}
```

### 4. Create New Item
**POST** `/items`

Creates a new item.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Description of the new item"
}
```

**Success Response (201):**
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

**Validation Error (400):**
```json
{
  "error": "Bad Request",
  "message": "Name is required and must be a non-empty string"
}
```

### 5. Update Item
**PUT** `/items/:id`

Updates an existing item.

**Parameters:**
- `id` (number): The ID of the item to update

**Request Body:**
```json
{
  "name": "Updated Item Name",
  "description": "Updated description"
}
```

**Success Response (200):**
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

### 6. Delete Item
**DELETE** `/items/:id`

Deletes an item by ID.

**Parameters:**
- `id` (number): The ID of the item to delete

**Success Response (200):**
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

## Testing with Postman

### 1. Get All Items
- Method: `GET`
- URL: `http://localhost:3000/items`

### 2. Get Single Item
- Method: `GET`
- URL: `http://localhost:3000/items/1`

### 3. Create New Item
- Method: `POST`
- URL: `http://localhost:3000/items`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Smartphone",
  "description": "Latest model smartphone with advanced features"
}
```

### 4. Update Item
- Method: `PUT`
- URL: `http://localhost:3000/items/1`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX graphics"
}
```

### 5. Delete Item
- Method: `DELETE`
- URL: `http://localhost:3000/items/1`

## Testing with cURL

### Get All Items
```bash
curl -X GET http://localhost:3000/items
```

### Get Single Item
```bash
curl -X GET http://localhost:3000/items/1
```

### Create New Item
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Tablet", "description": "10-inch tablet for reading and browsing"}'
```

### Update Item
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Laptop", "description": "Updated description"}'
```

### Delete Item
```bash
curl -X DELETE http://localhost:3000/items/1
```

## Error Handling

The API implements comprehensive error handling:

### Status Codes Used
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors, invalid data)
- `404` - Not Found (item or route not found)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## Data Validation

### Item Schema
- `name`: Required, non-empty string
- `description`: Required, non-empty string

### Validation Rules
- Both `name` and `description` are required
- Strings are trimmed of whitespace
- Duplicate names are not allowed
- IDs must be valid numbers

## Project Structure

```
project/
├── app.js          - Main application file
├── package.json    - Project dependencies and scripts
└── README.md       - This documentation
```

## Key Features Implemented

### Middleware
- `express.json()` - Parse JSON request bodies
- `express.urlencoded()` - Parse URL-encoded data
- Custom validation middleware
- Error handling middleware

### Data Management
- In-memory array storage
- Auto-incrementing IDs
- Data persistence during application lifecycle

### Error Handling
- Input validation
- Route validation
- Proper HTTP status codes
- Meaningful error messages

## Development Notes

- The application uses in-memory storage, so data will be lost when the server restarts
- For production use, consider integrating with a database
- The API follows RESTful conventions
- All responses are in JSON format
- CORS is not configured (add if needed for browser requests)

## Future Enhancements

- Database integration (MongoDB, PostgreSQL, etc.)
- Authentication and authorization
- Request logging
- Rate limiting
- CORS support
- Unit and integration tests
- API versioning
- Pagination for large datasets

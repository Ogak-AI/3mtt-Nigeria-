# Express.js REST API

A simple REST API built with Express.js for managing items. This API provides full CRUD (Create, Read, Update, Delete) operations for item management.

## Features

- ✅ Full CRUD operations
- ✅ Input validation
- ✅ Error handling
- ✅ In-memory data storage
- ✅ RESTful endpoints
- ✅ JSON responses
- ✅ Proper HTTP status codes

## Setup Instructions

### Prerequisites

- Node.js (version 14.0.0 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download the project files**
   ```bash
   # Create a new directory
   mkdir express-rest-api
   cd express-rest-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-restart)
   npm run dev
   ```

4. **Verify the server is running**
   - Open your browser and go to `http://localhost:3000`
   - You should see a welcome message with API information

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Root Endpoint
- **GET** `/`
- **Description**: Returns welcome message and API information
- **Response**: 200 OK

#### 2. Get All Items
- **GET** `/items`
- **Description**: Retrieve all items
- **Response**: 200 OK

#### 3. Get Single Item
- **GET** `/items/:id`
- **Description**: Retrieve a specific item by ID
- **Parameters**: 
  - `id` (number): Item ID
- **Response**: 200 OK | 404 Not Found | 400 Bad Request

#### 4. Create New Item
- **POST** `/items`
- **Description**: Create a new item
- **Request Body**:
  ```json
  {
    "name": "Item Name",
    "description": "Item Description"
  }
  ```
- **Response**: 201 Created | 400 Bad Request

#### 5. Update Item
- **PUT** `/items/:id`
- **Description**: Update an existing item
- **Parameters**: 
  - `id` (number): Item ID
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "description": "Updated Description"
  }
  ```
- **Response**: 200 OK | 404 Not Found | 400 Bad Request

#### 6. Delete Item
- **DELETE** `/items/:id`
- **Description**: Delete an item
- **Parameters**: 
  - `id` (number): Item ID
- **Response**: 200 OK | 404 Not Found | 400 Bad Request

## Example API Requests

### 1. Get Welcome Message
```bash
curl -X GET http://localhost:3000/
```

**Response:**
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

### 2. Get All Items
```bash
curl -X GET http://localhost:3000/items
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop for work and gaming"
    },
    {
      "id": 2,
      "name": "Smartphone",
      "description": "Latest model smartphone with advanced features"
    },
    {
      "id": 3,
      "name": "Headphones",
      "description": "Noise-cancelling wireless headphones"
    }
  ]
}
```

### 3. Get Single Item
```bash
curl -X GET http://localhost:3000/items/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop for work and gaming"
  }
}
```

### 4. Create New Item
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tablet",
    "description": "Lightweight tablet for reading and browsing"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": 4,
    "name": "Tablet",
    "description": "Lightweight tablet for reading and browsing"
  }
}
```

### 5. Update Item
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-end gaming laptop with RGB lighting"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "name": "Gaming Laptop",
    "description": "High-end gaming laptop with RGB lighting"
  }
}
```

### 6. Delete Item
```bash
curl -X DELETE http://localhost:3000/items/1
```

**Response:**
```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": {
    "id": 1,
    "name": "Gaming Laptop",
    "description": "High-end gaming laptop with RGB lighting"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name is required and must be a non-empty string"
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Item not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Testing with Postman

### Collection Setup
1. Open Postman
2. Create a new collection called "Express REST API"
3. Set the base URL as `http://localhost:3000`

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
  "description": "This is an updated test item"
}
```

#### 5. DELETE Item
- Method: DELETE
- URL: `{{baseUrl}}/items/1`

## Data Structure

Each item has the following structure:
```json
{
  "id": 1,
  "name": "Item Name",
  "description": "Item Description"
}
```

## Validation Rules

- **name**: Required, must be a non-empty string
- **description**: Required, must be a non-empty string
- **id**: Auto-generated, must be a positive integer

## Technical Details

- **Framework**: Express.js
- **Data Storage**: In-memory array (resets when server restarts)
- **Response Format**: JSON
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes
- **Middleware**: express.json() for parsing JSON request bodies

## Development Notes

- The API uses in-memory storage, so data will be lost when the server restarts
- For production use, consider implementing persistent storage (database)
- CORS is not enabled by default - add cors middleware if needed for frontend integration
- No authentication implemented - add authentication middleware for production use

## License

MIT License

# Express.js REST API

A simple REST API built with Express.js that demonstrates CRUD operations for managing items.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ In-memory data storage
- ✅ Input validation and error handling
- ✅ RESTful API design
- ✅ JSON response format
- ✅ Proper HTTP status codes

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone or download the project files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on port 3000 by default. You can access it at:
`http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Root Endpoint
- **GET** `/`
- **Description**: Returns a welcome message and API information
- **Response**: 200 OK

```json
{
  "message": "Hello, World!",
  "apiVersion": "1.0.0",
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
- **GET** `/items`
- **Description**: Retrieve all items
- **Response**: 200 OK

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

#### 3. Get Item by ID
- **GET** `/items/:id`
- **Description**: Retrieve a single item by its ID
- **Parameters**: `id` (number) - Item ID
- **Response**: 200 OK | 404 Not Found | 400 Bad Request

**Success Response:**
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

#### 4. Create New Item
- **POST** `/items`
- **Description**: Create a new item
- **Request Body**:

```json
{
  "name": "New Item",
  "description": "Description of the new item"
}
```

- **Response**: 201 Created | 400 Bad Request

**Success Response:**
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

#### 5. Update Item
- **PUT** `/items/:id`
- **Description**: Update an existing item by ID
- **Parameters**: `id` (number) - Item ID
- **Request Body**:

```json
{
  "name": "Updated Item Name",
  "description": "Updated description"
}
```

- **Response**: 200 OK | 404 Not Found | 400 Bad Request

**Success Response:**
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
- **DELETE** `/items/:id`
- **Description**: Delete an item by ID
- **Parameters**: `id` (number) - Item ID
- **Response**: 200 OK | 404 Not Found | 400 Bad Request

**Success Response:**
```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop for development"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "ID must be a valid number"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Item with ID 999 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong!"
}
```

## Example API Requests

### Using cURL

#### Get all items
```bash
curl -X GET http://localhost:3000/items
```

#### Get item by ID
```bash
curl -X GET http://localhost:3000/items/1
```

#### Create new item
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Smartphone", "description": "Latest model smartphone"}'
```

#### Update item
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Gaming Laptop", "description": "High-end gaming laptop"}'
```

#### Delete item
```bash
curl -X DELETE http://localhost:3000/items/1
```

### Using Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: `http://localhost:3000`
3. **Create requests** for each endpoint using the examples above
4. **Set Headers**: For POST/PUT requests, add `Content-Type: application/json`
5. **Add Request Body**: For POST/PUT requests, use raw JSON format

### Postman Collection Example

```json
{
  "info": {
    "name": "Express REST API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Items",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/items"
      }
    },
    {
      "name": "Get Item by ID",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/items/1"
      }
    },
    {
      "name": "Create Item",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/items",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Item\",\n  \"description\": \"This is a test item\"\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## Data Validation

The API includes validation for:
- **Name**: Required, must be a non-empty string
- **Description**: Required, must be a non-empty string
- **ID**: Must be a valid number for URL parameters

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Built-in middleware**: JSON parsing, URL encoding

## Project Structure

```
express-rest-api/
├── server.js          # Main application file
├── package.json       # Project dependencies and scripts
└── README.md         # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

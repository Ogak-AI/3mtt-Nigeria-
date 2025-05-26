# Express.js REST API

A simple REST API built with Express.js for managing items.

## Setup Instructions

1. Install dependencies:
bash
npm install


2. Start the server:
bash
npm start


3. The API will be available at `http://localhost:3000`

## API Endpoints

### GET /
Returns "Hello, World!" message

### GET /items
Get all items

### GET /items/:id
Get single item by ID

### POST /items
Create new item
- Body: `{"name": "Item Name", "description": "Item Description"}`

### PUT /items/:id
Update item by ID
- Body: `{"name": "Updated Name", "description": "Updated Description"}`

### DELETE /items/:id
Delete item by ID

## Testing Examples

### Get all items:
```bash
curl http://localhost:3000/items
```

### Create new item:
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Test Description"}'
```

### Update item:
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item","description":"Updated Description"}'
```

### Delete item:
```bash
curl -X DELETE http://localhost:3000/items/1
```

## Features

- Express.js server setup
- RESTful routes
- In-memory data storage
- Input validation
- Error handling (400, 404, 500)
- CRUD operations
```

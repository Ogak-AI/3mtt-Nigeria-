# Express.js REST API

This project is a simple REST API built using Node.js and Express.js.

## Setup Instructions

1. Clone the repository
2. Install dependencies:

npm install

3. Start the server:

npm start

4. API runs on: `http://localhost:3000`

## API Endpoints

### Root
- `GET /`  
Returns: `Hello, World!`

### Items

- `GET /items`  
Returns all items

- `GET /items/:id`  
Get item by ID

- `POST /items`  
Body: `{ "name": "Item", "description": "Details" }`  
Adds a new item

- `PUT /items/:id`  
Body: `{ "name": "Updated", "description": "Updated desc" }`  
Updates item

- `DELETE /items/:id`  
Deletes item by ID

## Example Postman Requests

### Get all items
GET `http://localhost:3000/items`

### Create item
POST `http://localhost:3000/items`  
Body:
```json
{
"name": "New Item",
"description": "New Description"
}

Get single item

GET http://localhost:3000/items/1

Update item

PUT http://localhost:3000/items/1
Body:

{
  "name": "Updated Item",
  "description": "Updated Description"
}

Delete item

DELETE http://localhost:3000/items/1

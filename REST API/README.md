# Simple REST API with Express.js

This is a simple REST API implementation using Express.js that provides CRUD operations for managing items.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

5. The server will start on port 3000 (by default) or the port specified in the PORT environment variable

## API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

#### Root Endpoint
- **GET /** - Returns a welcome message
  - Response: `{ "message": "Hello, World!" }`

#### Items Endpoints

1. **GET /items** - Retrieve all items
   - Response: Array of item objects
   ```json
   [
     { "id": 1, "name": "Item 1", "description": "This is the first item" },
     { "id": 2, "name": "Item 2", "description": "This is the second item" }
   ]
   ```

2. **GET /items/:id** - Retrieve a single item by ID
   - Parameters: `id` - ID of the item to retrieve
   - Response: Single item object
   ```json
   { "id": 1, "name": "Item 1", "description": "This is the first item" }
   ```
   - Error responses:
     - 400: Invalid ID format
     - 404: Item not found

3. **POST /items** - Create a new item
   - Request body:
   ```json
   {
     "name": "New Item",
     "description": "Description of the new item"
   }
   ```
   - Response (201 Created): The created item
   ```json
   { "id": 4, "name": "New Item", "description": "Description of the new item" }
   ```
   - Error response:
     - 400: Missing required fields

4. **PUT /items/:id** - Update an item by ID
   - Parameters: `id` - ID of the item to update
   - Request body:
   ```json
   {
     "name": "Updated Item",
     "description": "Updated description"
   }
   ```
   - Response: The updated item
   ```json
   { "id": 1, "name": "Updated Item", "description": "Updated description" }
   ```
   - Error responses:
     - 400: Invalid ID format or missing required fields
     - 404: Item not found

5. **DELETE /items/:id** - Delete an item by ID
   - Parameters: `id` - ID of the item to delete
   - Response: Success message and deleted item
   ```json
   { 
     "message": "Item deleted successfully", 
     "item": { "id": 1, "name": "Item 1", "description": "This is the first item" } 
   }
   ```
   - Error responses:
     - 400: Invalid ID format
     - 404: Item not found

### Error Handling
- 400 Bad Request: Invalid input or missing required fields
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side error

## Example API Requests

### Using cURL

1. Get all items:
```bash
curl -X GET http://localhost:3000/items
```

2. Get a specific item:
```bash
curl -X GET http://localhost:3000/items/1
```

3. Create a new item:
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item", "description": "Description of the new item"}'
```

4. Update an item:
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Item", "description": "Updated description"}'
```

5. Delete an item:
```bash
curl -X DELETE http://localhost:3000/items/1
```

### Using Postman

1. **GET All Items**
   - Method: GET
   - URL: http://localhost:3000/items

2. **GET Single Item**
   - Method: GET
   - URL: http://localhost:3000/items/1

3. **Create New Item**
   - Method: POST
   - URL: http://localhost:3000/items
   - Headers: Content-Type: application/json
   - Body (raw JSON):
   ```json
   {
     "name": "New Item",
     "description": "Description of the new item"
   }
   ```

4. **Update Item**
   - Method: PUT
   - URL: http://localhost:3000/items/1
   - Headers: Content-Type: application/json
   - Body (raw JSON):
   ```json
   {
     "name": "Updated Item",
     "description": "Updated description"
   }
   ```

5. **Delete Item**
   - Method: DELETE
   - URL: http://localhost:3000/items/1

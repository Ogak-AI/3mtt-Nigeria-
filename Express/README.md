# Express.js RESTful API

A comprehensive RESTful API built with Express.js featuring full CRUD operations, input validation, error handling, and in-memory data storage.

## Features

- **RESTful Design**: Follows REST principles with proper HTTP methods and status codes
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Consistent error responses with detailed messages
- **In-Memory Storage**: Fast data operations without external dependencies
- **Filtering & Pagination**: Advanced query capabilities
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Monitoring**: Built-in health check endpoint
- **Comprehensive Testing**: Full test suite with Jest and Supertest

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd express-restful-api

# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Authentication
This API currently does not require authentication (suitable for development/demo purposes).

## Endpoints Documentation

### 1. Root Endpoint
**GET /** - Get API information

**Response:**
```json
{
  "message": "Welcome to the RESTful API",
  "version": "1.0.0",
  "endpoints": {
    "GET /api/users": "Get all users",
    "GET /api/users/:id": "Get user by ID",
    "POST /api/users": "Create a new user",
    "PUT /api/users/:id": "Update user by ID",
    "DELETE /api/users/:id": "Delete user by ID"
  }
}
```

### 2. Health Check
**GET /health** - Check API health status

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.123,
  "memory": {
    "rss": 50331648,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1048576
  },
  "totalUsers": 3
}
```

### 3. Get All Users
**GET /api/users** - Retrieve all users with optional filtering and pagination

**Query Parameters:**
- `name` (string): Filter by name (case-insensitive partial match)
- `email` (string): Filter by email (case-insensitive partial match)
- `minAge` (number): Filter users with age greater than or equal to this value
- `maxAge` (number): Filter users with age less than or equal to this value
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of users per page (default: 10)

**Examples:**
```bash
# Get all users
GET /api/users

# Filter by name
GET /api/users?name=john

# Filter by age range
GET /api/users?minAge=25&maxAge=35

# Pagination
GET /api/users?page=2&limit=5

# Combined filters
GET /api/users?name=john&minAge=25&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

### 4. Get User by ID
**GET /api/users/:id** - Retrieve a specific user

**Parameters:**
- `id` (number): User ID

**Example:**
```bash
GET /api/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}
```

### 5. Create New User
**POST /api/users** - Create a new user

**Request Body:**
```json
{
  "name": "John Doe",      // Required: string, non-empty
  "email": "john@example.com",  // Required: valid email format
  "age": 30               // Optional: number between 0-150
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28
  }
}
```

### 6. Update User
**PUT /api/users/:id** - Update an existing user

**Parameters:**
- `id` (number): User ID

**Request Body:** (all fields optional)
```json

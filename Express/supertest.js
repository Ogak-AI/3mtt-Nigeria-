const request = require('supertest');
const app = require('./server');

describe('RESTful API Tests', () => {
  
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('totalUsers');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users with pagination', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter users by name', async () => {
      const response = await request(app)
        .get('/api/users?name=John')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
      if (response.body.data.length > 0) {
        expect(response.body.data[0].name).toContain('John');
      }
    });

    it('should apply pagination correctly', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=2')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect(400);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Invalid user ID format');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: 28
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('name', newUser.name);
      expect(response.body.data).toHaveProperty('email', newUser.email.toLowerCase());
      expect(response.body.data).toHaveProperty('age', newUser.age);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should create a user without age', async () => {
      const newUser = {
        name: 'No Age User',
        email: 'noage@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.age).toBeNull();
    });

    it('should return 400 for missing required fields', async () => {
      const invalidUser = {
        email: 'incomplete@example.com'
        // missing name
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toContain('Name is required and must be a non-empty string');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.details).toContain('Email must be a valid email address');
    });

    it('should return 400 for invalid age', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: -5
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.details).toContain('Age must be a number between 0 and 150');
    });

    it('should return 409 for duplicate email', async () => {
      // First, create a user
      const newUser = {
        name: 'First User',
        email: 'duplicate@example.com'
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      // Try to create another user with same email
      const duplicateUser = {
        name: 'Second User',
        email: 'duplicate@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(duplicateUser)
        .expect(409);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'User with this email already exists');
    });
  });

  describe('PUT /api/users/:id', () => {
    let testUserId;

    beforeEach(async () => {
      // Create a test user
      const testUser = {
        name: 'Update Test User',
        email: 'updatetest@example.com',
        age: 25
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser);
      
      testUserId = response.body.data.id;
    });

    it('should update user with valid data', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 30
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('age', updateData.age);
    });

    it('should update only provided fields', async () => {
      const updateData = {
        name: 'Only Name Updated'
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe('updatetest@example.com'); // Should remain unchanged
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = { name: 'Not Found' };

      const response = await request(app)
        .put('/api/users/999')
        .send(updateData)
        .expect(404);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '', // empty name
        age: 200 // invalid age
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(invalidData)
        .expect(400);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('details');
    });
  });

  describe('DELETE /api/users/:id', () => {
    let testUserId;

    beforeEach(async () => {
      // Create a test user
      const testUser = {
        name: 'Delete Test User',
        email: 'deletetest@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser);
      
      testUserId = response.body.data.id;
    });

    it('should delete an existing user', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
      expect(response.body.data).toHaveProperty('id', testUserId);

      // Verify user is actually deleted
      await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .delete('/api/users/invalid')
        .expect(400);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Invalid user ID format');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Endpoint not found');
    });
  });
});

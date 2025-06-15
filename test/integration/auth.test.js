const { expect } = require('chai');
const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

describe('Authentication API', () => {
  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'client',
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('token');
      expect(res.body.user).to.have.property('email', 'test@example.com');
      expect(res.body.user).to.not.have.property('password');
      
      // Verify user was saved to database
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).to.exist;
      expect(user.email).to.equal('test@example.com');
      expect(user.role).to.equal('client');
    });

    it('should not register with duplicate email', async () => {
      // Create a user first
      await new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'client'
      }).save();
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'client'
        });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email already in use');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors.some(e => e.param === 'email')).to.be.true;
      expect(res.body.errors.some(e => e.param === 'password')).to.be.true;
      expect(res.body.errors.some(e => e.param === 'role')).to.be.true;
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      role: 'client'
    };

    beforeEach(async () => {
      // Create a test user
      await new User(testUser).save();
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body.user).to.have.property('email', testUser.email);
      expect(res.body.user).to.not.have.property('password');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      role: 'client',
      firstName: 'Test',
      lastName: 'User'
    };

    beforeEach(async () => {
      // Create and login a test user
      const user = new User(testUser);
      await user.save();
      
      // Get auth token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      token = res.body.token;
    });

    it('should get current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('email', testUser.email);
      expect(res.body).to.have.property('firstName', testUser.firstName);
      expect(res.body).to.have.property('lastName', testUser.lastName);
      expect(res.body).to.not.have.property('password');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'No token, authorization denied');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Token is not valid');
    });
  });
});

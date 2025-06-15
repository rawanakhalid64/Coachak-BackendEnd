const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const User = require('../../models/User');
const Rating = require('../../models/Rating');

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '+1234567890',
  dateOfBirth: '1990-01-01',
  role: 'client'
};

const testTrainer = {
  email: 'trainer@example.com',
  password: 'password123',
  firstName: 'Trainer',
  lastName: 'User',
  phoneNumber: '+1234567891',
  dateOfBirth: '1985-01-01',
  role: 'trainer',
  specialization: 'Fitness',
  experience: 5,
  bio: 'Professional trainer'
};

describe('Rating System API', () => {
  let userToken;
  let trainerId;
  let userId;

  // Create test user and trainer before tests
  before(async () => {
    // Create test user
    const userRes = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
    
    userId = userRes.body.user._id;
    userToken = userRes.body.token;

    // Create test trainer
    const trainerRes = await request(app)
      .post('/api/v1/auth/register')
      .send(testTrainer);
    
    trainerId = trainerRes.body.user._id;
  });

  // Clean up after tests
  after(async () => {
    await User.deleteMany({});
    await Rating.deleteMany({});
  });

  describe('POST /api/v1/ratings', () => {
    it('should create a new rating', async () => {
      const ratingData = {
        trainer: trainerId,
        rating: 4.5,
        comment: 'Great trainer!'
      };

      const res = await request(app)
        .post('/api/v1/ratings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(ratingData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Rating created successfully');
      expect(res.body.rating).to.have.property('trainer', trainerId);
      expect(res.body.rating).to.have.property('user', userId);
      expect(res.body.rating).to.have.property('rating', 4.5);
      expect(res.body.rating).to.have.property('comment', 'Great trainer!');
    });

    it('should return 400 for invalid rating value', async () => {
      const ratingData = {
        trainer: trainerId,
        rating: 6, // Invalid rating (should be between 0-5)
        comment: 'Invalid rating test'
      };

      const res = await request(app)
        .post('/api/v1/ratings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(ratingData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('GET /api/v1/ratings/trainer/:trainerId', () => {
    it('should get all ratings for a trainer', async () => {
      // First, create a test rating
      await Rating.create({
        user: userId,
        trainer: trainerId,
        rating: 4.5,
        comment: 'Test rating'
      });

      const res = await request(app)
        .get(`/api/v1/ratings/trainer/${trainerId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.ratings).to.be.an('array');
      expect(res.body.ratings[0]).to.have.property('trainer', trainerId);
    });
  });
});

const { expect } = require('chai');
const request = require('supertest');
const app = require('../../index');
const TrainingPlan = require('../../models/TrainingPlan');
const { createAndLoginUser, testData } = require('../helpers/testHelpers');

describe('Training Plan API', () => {
  let authToken;
  let trainer;
  let testTrainingPlan;

  before(async () => {
    // Create and login a trainer user
    const result = await createAndLoginUser({ role: 'trainer' });
    authToken = result.token;
    trainer = result.user;

    // Create a test training plan
    testTrainingPlan = await new TrainingPlan({
      ...testData.trainingPlan(),
      createdBy: trainer._id,
    }).save();
  });

  describe('GET /api/training-plans', () => {
    it('should get all training plans', async () => {
      const res = await request(app)
        .get('/api/training-plans')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should filter training plans by difficulty', async () => {
      const difficulty = 'beginner';
      const res = await request(app)
        .get(`/api/training-plans?difficulty=${difficulty}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      if (res.body.length > 0) {
        expect(res.body[0].difficulty).to.equal(difficulty);
      }
    });
  });

  describe('GET /api/training-plans/:id', () => {
    it('should get a single training plan by ID', async () => {
      const res = await request(app)
        .get(`/api/training-plans/${testTrainingPlan._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', testTrainingPlan._id.toString());
      expect(res.body).to.have.property('name', testTrainingPlan.name);
    });

    it('should return 404 for non-existent training plan', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Random valid ObjectId
      const res = await request(app)
        .get(`/api/training-plans/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Training plan not found');
    });
  });

  describe('POST /api/training-plans', () => {
    it('should create a new training plan', async () => {
      const newPlan = testData.trainingPlan();
      const res = await request(app)
        .post('/api/training-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPlan);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal(newPlan.name);
      expect(res.body.description).to.equal(newPlan.description);
      expect(res.body.createdBy).to.equal(trainer._id.toString());
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/training-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors.some(e => e.param === 'name')).to.be.true;
      expect(res.body.errors.some(e => e.param === 'description')).to.be.true;
    });
  });

  describe('PUT /api/training-plans/:id', () => {
    it('should update a training plan', async () => {
      const updates = {
        name: 'Updated Training Plan',
        description: 'Updated description',
        difficulty: 'advanced'
      };
      
      const res = await request(app)
        .put(`/api/training-plans/${testTrainingPlan._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', updates.name);
      expect(res.body).to.have.property('description', updates.description);
      expect(res.body).to.have.property('difficulty', updates.difficulty);
    });

    it('should return 403 if user is not the creator', async () => {
      // Create a different trainer
      const anotherTrainer = await createAndLoginUser({ role: 'trainer' });
      
      const updates = { name: 'Unauthorized Update' };
      const res = await request(app)
        .put(`/api/training-plans/${testTrainingPlan._id}`)
        .set('Authorization', `Bearer ${anotherTrainer.token}`)
        .send(updates);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('message', 'Not authorized to update this training plan');
    });
  });

  describe('DELETE /api/training-plans/:id', () => {
    let planToDelete;

    beforeEach(async () => {
      // Create a plan to delete in each test
      planToDelete = await new TrainingPlan({
        ...testData.trainingPlan(),
        createdBy: trainer._id,
      }).save();
    });

    it('should delete a training plan', async () => {
      const res = await request(app)
        .delete(`/api/training-plans/${planToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Training plan removed');
      
      // Verify it's actually deleted
      const deletedPlan = await TrainingPlan.findById(planToDelete._id);
      expect(deletedPlan).to.be.null;
    });

    it('should return 403 if user is not the creator', async () => {
      const anotherTrainer = await createAndLoginUser({ role: 'trainer' });
      
      const res = await request(app)
        .delete(`/api/training-plans/${planToDelete._id}`)
        .set('Authorization', `Bearer ${anotherTrainer.token}`);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('message', 'Not authorized to delete this training plan');
    });
  });
});

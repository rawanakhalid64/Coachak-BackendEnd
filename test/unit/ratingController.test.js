const { expect } = require('chai');
const sinon = require('sinon');
const ratingController = require('../../controllers/ratingController');
const Rating = require('../../models/Rating');

// Mock the Rating model
const mockRating = {
  _id: '60d21b4667d0d8992e610c85',
  trainer: '60d21b4667d0d8992e610c86',
  user: '60d21b4667d0d8992e610c87',
  rating: 4.5,
  comment: 'Great trainer!',
  createdAt: new Date()
};

describe('Rating Controller', function() {
  let req, res, next;

  beforeEach(function() {
    // Setup request, response and next function
    req = {
      body: {},
      params: {},
      user: { id: '60d21b4667d0d8992e610c87' } // Mock authenticated user
    };
    
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    
    next = sinon.stub();
  });

  afterEach(function() {
    // Restore all stubs
    sinon.restore();
  });

  describe('createRating', function() {
    it('should create a new rating successfully', async function() {
      // Mock request data
      req.body = {
        trainer: '60d21b4667d0d8992e610c86',
        rating: 4.5,
        comment: 'Great trainer!'
      };

      // Stub the Rating.create method
      const createStub = sinon.stub(Rating, 'create').resolves({
        ...mockRating,
        ...req.body,
        user: req.user.id
      });

      // Call the controller
      await ratingController.createRating(req, res);

      // Assertions
      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const responseArg = res.json.getCall(0).args[0];
      expect(responseArg).to.have.property('message', 'Rating created successfully');
      expect(responseArg.rating).to.have.property('trainer', req.body.trainer);
      expect(responseArg.rating).to.have.property('user', req.user.id);
      expect(responseArg.rating).to.have.property('rating', req.body.rating);
      expect(responseArg.rating).to.have.property('comment', req.body.comment);
    });

    it('should handle duplicate rating error', async function() {
      // Mock request data
      req.body = {
        trainer: '60d21b4667d0d8992e610c86',
        rating: 4.5,
        comment: 'Great trainer!'
      };

      // Create a duplicate key error
      const error = new Error('Duplicate key error');
      error.code = 11000;

      // Stub the Rating.create method to throw duplicate error
      sinon.stub(Rating, 'create').rejects(error);

      // Call the controller
      await ratingController.createRating(req, res);

      // Assertions
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const responseArg = res.json.getCall(0).args[0];
      expect(responseArg).to.have.property('message', 'You have already rated this trainer');
    });

    it('should handle validation errors', async function() {
      // Mock request data with invalid rating (missing required fields)
      req.body = {
        trainer: '60d21b4667d0d8992e610c86'
        // Missing rating and comment
      };

      // Call the controller
      await ratingController.createRating(req, res);

      // Assertions
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const responseArg = res.json.getCall(0).args[0];
      expect(responseArg).to.have.property('message', 'Error creating rating');
    });
  });

  describe('getTrainerRatings', function() {
    it('should get all ratings for a trainer', async function() {
      // Mock request parameters
      req.params.trainerId = '60d21b4667d0d8992e610c86';
      
      // Mock the returned ratings
      const mockRatings = [
        {
          ...mockRating,
          user: {
            _id: mockRating.user,
            firstName: 'John',
            lastName: 'Doe',
            profilePhoto: 'photo.jpg'
          }
        }
      ];

      // Stub the Rating.find method
      const findStub = sinon.stub(Rating, 'find')
        .returns({
          populate: sinon.stub().returnsThis(),
          sort: sinon.stub().resolves(mockRatings)
        });

      // Call the controller
      await ratingController.getTrainerRatings(req, res);

      // Assertions
      expect(findStub.calledOnce).to.be.true;
      expect(findStub.calledWith({ trainer: req.params.trainerId })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const responseArg = res.json.getCall(0).args[0];
      expect(responseArg).to.have.property('message', 'Ratings retrieved successfully');
      expect(responseArg).to.have.property('count', mockRatings.length);
      expect(responseArg.ratings).to.be.an('array').with.lengthOf(mockRatings.length);
    });

    it('should handle errors when retrieving ratings', async function() {
      // Mock request parameters
      req.params.trainerId = 'invalid-id';
      
      // Stub the Rating.find method to throw an error
      const error = new Error('Database error');
      sinon.stub(Rating, 'find').returns({
        populate: sinon.stub().returnsThis(),
        sort: sinon.stub().rejects(error)
      });

      // Call the controller
      await ratingController.getTrainerRatings(req, res);

      // Assertions
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      const responseArg = res.json.getCall(0).args[0];
      expect(responseArg).to.have.property('message', 'Error retrieving ratings');
    });
  });
});

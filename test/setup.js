const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Configure chai
chai.use(chaiHttp);
chai.should();

// Global test variables
global.expect = chai.expect;
global.request = chai.request;
global.sinon = sinon;

// Connect to the test database
before(async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to test database');
  } catch (error) {
    console.error('Test database connection error:', error);
    process.exit(1);
  }
});

// Clear all test data after each test
afterEach(async () => {
  await clearDatabase();
});

// Remove and close the database and server after all tests
after(async () => {
  await closeDatabase();
});

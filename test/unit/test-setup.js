// This file is specifically for unit tests
const { before, after, beforeEach, afterEach } = require('mocha');
const chai = require('chai');
const sinon = require('sinon');

// Set up test environment
process.env.NODE_ENV = 'test';

// Configure chai
global.expect = chai.expect;
global.sinon = sinon;

// Setup before and after hooks for unit tests
before(function() {
  // Setup code before all tests
  this.timeout(10000);
});

after(function() {
  // Cleanup after all tests
});

beforeEach(function() {
  // Setup code before each test
  this.sandbox = sinon.createSandbox();
});

afterEach(function() {
  // Cleanup after each test
  this.sandbox.restore();
});

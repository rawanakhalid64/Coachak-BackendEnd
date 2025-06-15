const { expect } = require('chai');
const sinon = require('sinon');

// Create a simple test suite that doesn't require database connection
describe('Example Test Suite', function() {
  // Increase timeout for all tests in this suite
  this.timeout(5000);

  // Basic test example
  it('should pass a simple test', () => {
    expect(true).to.be.true;
  });

  // Basic arithmetic test
  it('should handle basic arithmetic', () => {
    expect(2 + 2).to.equal(4);
  });

  // Mock test example
  describe('Mock Tests', () => {
    it('should use a mock function', () => {
      const mockFn = sinon.stub().returns(42);
      expect(mockFn()).to.equal(42);
      sinon.assert.calledOnce(mockFn);
    });
  });

  // String manipulation test example
  describe('String Tests', () => {
    it('should concatenate strings correctly', () => {
      const str1 = 'Hello';
      const str2 = 'World';
      expect(str1 + ' ' + str2).to.equal('Hello World');
    });
  });
});

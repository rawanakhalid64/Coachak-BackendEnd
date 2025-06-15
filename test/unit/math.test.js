const { expect } = require('chai');
const { addNumbers } = require('../../utils/math');

describe('Math Utilities', function() {
  // Increase timeout for all tests in this suite
  this.timeout(5000);

  describe('addNumbers', () => {
    it('should add two positive numbers correctly', () => {
      expect(addNumbers(2, 3)).to.equal(5);
    });

    it('should handle negative numbers', () => {
      expect(addNumbers(-1, 1)).to.equal(0);
    });

    it('should return zero when adding zeros', () => {
      expect(addNumbers(0, 0)).to.equal(0);
    });

    it('should handle decimal numbers', () => {
      expect(addNumbers(1.5, 2.5)).to.equal(4);
    });
  });
});

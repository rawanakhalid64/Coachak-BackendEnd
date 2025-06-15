const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
  describe('Validation', () => {
    it('should require email field', async () => {
      const user = new User({
        password: 'password123',
        role: 'client'
      });
      
      let error;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }
      
      expect(error).to.exist;
      expect(error.errors.email).to.exist;
    });

    it('should require password field', async () => {
      const user = new User({
        email: 'test@example.com',
        role: 'client'
      });
      
      let error;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }
      
      expect(error).to.exist;
      expect(error.errors.password).to.exist;
    });

    it('should require role field', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      
      let error;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }
      
      expect(error).to.exist;
      expect(error.errors.role).to.exist;
    });

    it('should save a valid user', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'client',
        firstName: 'Test',
        lastName: 'User'
      });
      
      const savedUser = await user.save();
      expect(savedUser._id).to.exist;
      expect(savedUser.email).to.equal('test@example.com');
      expect(savedUser.role).to.equal('client');
    });
  });

  describe('Password Hashing', () => {
    it('should hash the password before saving', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'client'
      });
      
      await user.save();
      expect(user.password).to.not.equal('password123');
      expect(user.password).to.have.length.above(0);
    });

    it('should verify the password correctly', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
        role: 'client'
      });
      
      await user.save();
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).to.be.true;
      
      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).to.be.false;
    });
  });

  describe('Virtuals', () => {
    it('should return full name', () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'client'
      });
      
      expect(user.fullName).to.equal('John Doe');
    });
  });
});

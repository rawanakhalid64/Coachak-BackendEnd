# R-Coachak Backend Testing Guide

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Test Types](#test-types)
3. [Test Directory Structure](#test-directory-structure)
4. [Setting Up the Test Environment](#setting-up-the-test-environment)
5. [Running Tests](#running-tests)
6. [Writing Tests](#writing-tests)
7. [Test Utilities and Helpers](#test-utilities-and-helpers)
8. [Best Practices](#best-practices)
9. [Continuous Integration](#continuous-integration)
10. [Troubleshooting](#troubleshooting)

## Testing Overview

This document provides comprehensive guidance on testing the R-Coachak Backend application. Our testing strategy follows industry best practices to ensure code quality, reliability, and maintainability.

### Key Testing Principles
- **Isolation**: Tests should be independent and not rely on external services
- **Speed**: Tests should run quickly to enable frequent execution
- **Determinism**: Tests should produce the same results given the same inputs
- **Readability**: Tests should be clear and serve as documentation
- **Coverage**: Aim for high test coverage of critical paths

## Test Types

### 1. Unit Tests
- Test individual functions and modules in isolation
- Located in `test/unit/`
- Should not make external API calls or database connections
- Use mocks and stubs for external dependencies

### 2. Integration Tests
- Test interactions between components
- Located in `test/integration/`
- May include database operations and API endpoint testing
- Use test database instances

### 3. End-to-End (E2E) Tests
- Test complete user flows
- Located in `test/e2e/`
- Simulate real user interactions

## Test Directory Structure

```
test/
├── unit/                  # Unit tests
│   ├── controllers/       # Controller unit tests
│   ├── models/            # Model unit tests
│   ├── services/          # Service layer tests
│   ├── utils/             # Utility function tests
│   └── test-setup.js      # Unit test setup
├── integration/           # Integration tests
│   ├── api/               # API endpoint tests
│   └── database/          # Database integration tests
├── e2e/                   # End-to-end tests
├── helpers/               # Test helpers and utilities
│   ├── testUtils.js       # Common test utilities
│   └── db.js              # Database test helpers
└── fixtures/              # Test data fixtures
```

## Setting Up the Test Environment

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- MongoDB (for integration tests)

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Install test dependencies:
   ```bash
   npm install --save-dev mocha chai sinon supertest nyc mongodb-memory-server
   ```

3. Create a `.env.test` file with test environment variables:
   ```env
   NODE_ENV=test
   MONGODB_URI=mongodb://localhost:27017/test_db
   JWT_SECRET=test-secret
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests
```bash
npm run test:integration
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npx mocha path/to/test/file.test.js
```

### Watch Mode
```bash
npm run test:watch
```

## Writing Tests

### Test Structure

```javascript
const { expect } = require('chai');
const sinon = require('sinon');
const myModule = require('../../path/to/module');

describe('Module Name', function() {
  // Test hooks
  before(function() {
    // Runs once before all tests
  });

  after(function() {
    // Runs once after all tests
  });

  beforeEach(function() {
    // Runs before each test
  });

  afterEach(function() {
    // Runs after each test
  });

  describe('methodName', function() {
    it('should do something', function() {
      // Test implementation
      const result = myModule.methodName();
      expect(result).to.equal(expectedValue);
    });
  });
});
```

### Testing Async Code

```javascript
describe('Async Function', function() {
  it('should resolve with expected value', async function() {
    const result = await asyncFunction();
    expect(result).to.equal(expectedValue);
  });

  it('should reject with error', async function() {
    await expect(asyncFunctionThatRejects()).to.be.rejectedWith(Error);
  });
});
```

### Mocking with Sinon

```javascript
const sinon = require('sinon');
const myModule = require('../../path/to/module');

describe('Module with Dependencies', function() {
  let stub;

  beforeEach(function() {
    // Create a stub for a dependency
    stub = sinon.stub(myModule, 'dependency').resolves('mocked value');
  });

  afterEach(function() {
    // Restore the original function
    stub.restore();
  });

  it('should use the mocked dependency', async function() {
    const result = await myModule.methodThatUsesDependency();
    expect(stub.calledOnce).to.be.true;
    expect(result).to.equal('expected result with mocked value');
  });
});
```

## Test Utilities and Helpers

### Database Helpers

Use the test database utilities to manage test data:

```javascript
const { connect, clearDatabase, closeDatabase } = require('../helpers/db');

describe('Database Tests', function() {
  before(async function() {
    await connect();
  });

  afterEach(async function() {
    await clearDatabase();
  });

  after(async function() {
    await closeDatabase();
  });
});
```

### Test Data Factories

Create test data using factories:

```javascript
// test/factories/userFactory.js
const User = require('../../models/User');

exports.createUser = (overrides = {}) => {
  const defaults = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'client'
  };
  
  return new User({ ...defaults, ...overrides });
};
```

## Best Practices

### Test Naming
- Use descriptive test names that explain the expected behavior
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests with `describe` blocks

### Test Structure
- Follow the Arrange-Act-Assert (AAA) pattern
- Keep tests focused and test one thing per test case
- Use `beforeEach` and `afterEach` for test setup and teardown

### Test Data
- Use factory functions for creating test data
- Keep test data close to the tests that use it
- Clean up test data after each test

### Assertions
- Use descriptive assertion messages
- Prefer specific assertions over general ones
- Test both happy paths and error cases

## Continuous Integration

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that runs:
1. Linting
2. Unit tests
3. Integration tests
4. Test coverage

## Troubleshooting

### Common Issues

#### Tests Hanging
- Ensure all async operations are properly awaited
- Check for unhandled promises
- Make sure all test timeouts are appropriate

#### Database Connection Issues
- Verify MongoDB is running for integration tests
- Check database connection strings in test environment
- Ensure proper cleanup between tests

#### Test Isolation Issues
- Make sure tests don't share state
- Reset mocks and stubs in `afterEach`
- Clear test database between tests

### Debugging Tests

Run tests with debug output:
```bash
debug=* npm test
```

Or use Node's debugger:
```bash
node --inspect-brk node_modules/.bin/_mocha
```

## Additional Resources

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Sinon.JS](https://sinonjs.org/)
- [SuperTest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/nodebestpractices#testing-and-code-quality)

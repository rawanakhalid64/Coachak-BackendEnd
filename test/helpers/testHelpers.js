const faker = require('faker');
const User = require('../../models/User');

/**
 * Generate a test user object
 * @param {Object} overrides - Object with properties to override defaults
 * @returns {Object} Test user object
 */
const generateUserData = (overrides = {}) => ({
  email: faker.internet.email().toLowerCase(),
  password: 'password123',
  role: 'client',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phone: faker.phone.phoneNumber(),
  dateOfBirth: faker.date.past(30, '2000-01-01'),
  gender: faker.random.arrayElement(['male', 'female', 'other']),
  ...overrides,
});

/**
 * Create a test user in the database
 * @param {Object} overrides - Object with properties to override defaults
 * @returns {Promise<Object>} Created user object
 */
const createTestUser = async (overrides = {}) => {
  const userData = generateUserData(overrides);
  const user = new User(userData);
  await user.save();
  return user;
};

/**
 * Generate auth token for a test user
 * @param {Object} user - User object
 * @returns {Promise<String>} JWT token
 */
const getAuthToken = async (user) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: user.email,
      password: 'password123', // Default test password
    });
  return response.body.token;
};

/**
 * Create and login a test user
 * @param {Object} overrides - Object with properties to override defaults
 * @returns {Promise<Object>} Object containing user data and auth token
 */
const createAndLoginUser = async (overrides = {}) => {
  const password = overrides.password || 'password123';
  const user = await createTestUser({ ...overrides, password });
  const token = await getAuthToken(user);
  return { user, token };
};

/**
 * Generate test data for different models
 */
const testData = {
  trainingPlan: (overrides = {}) => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    durationWeeks: faker.datatype.number({ min: 1, max: 12 }),
    difficulty: faker.random.arrayElement(['beginner', 'intermediate', 'advanced']),
    ...overrides,
  }),
  
  nutritionPlan: (overrides = {}) => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    dailyCalories: faker.datatype.number({ min: 1200, max: 3000 }),
    macronutrients: {
      protein: faker.datatype.number({ min: 50, max: 200 }),
      carbs: faker.datatype.number({ min: 100, max: 400 }),
      fats: faker.datatype.number({ min: 30, max: 100 }),
    },
    ...overrides,
  }),
  
  exercise: (overrides = {}) => ({
    name: faker.lorem.words(2),
    description: faker.lorem.paragraph(),
    category: faker.random.arrayElement(['strength', 'cardio', 'flexibility']),
    difficulty: faker.random.arrayElement(['beginner', 'intermediate', 'advanced']),
    equipment: [faker.random.arrayElement(['dumbbells', 'barbell', 'kettlebell', 'bodyweight', 'resistance band'])],
    ...overrides,
  }),
};

module.exports = {
  generateUserData,
  createTestUser,
  getAuthToken,
  createAndLoginUser,
  testData,
};

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to the in-memory database
const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Set the test database URL
  process.env.MONGO_DB_URL = uri;
  
  // Connect to the in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log('Connected to in-memory MongoDB for testing');
};

// Clear all test data
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

// Remove and close the database and server
const closeDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase
};

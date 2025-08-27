const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = (mongooseInstance) => {
  mongooseInstance
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SmartLight', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
};

// Export the function and mongoose instance
module.exports = { connectDB, mongoose };
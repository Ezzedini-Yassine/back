const mongoose = require('mongoose');
const { connectDB } = require('../config/database');

// Import all models with exact case
require('./users');
require('./sites');
require('./dimmingProfile');
require('./line');
require('./device');

// Connect using the mongoose instance
connectDB(mongoose);

module.exports = {
  mongoose,
};
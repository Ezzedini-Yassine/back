const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SmartLight')
  .then(() => console.log('Connected to DB!'))
  .catch((err) => console.error('DB connection error:', err));
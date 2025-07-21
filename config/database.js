const mongoose = require('mongoose');

// Use environment variables for credentials in production (e.g., via dotenv)
mongoose.connect('mongodb://localhost:27017/SmartLight', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to DB!'))
.catch((err) => console.error('DB connection error:', err));
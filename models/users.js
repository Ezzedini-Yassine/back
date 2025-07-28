const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Date_Creation: {
    type: Date,
    required: true,
    default: Date.now,
  },
  role: {
    type: String,
    required: true,
  },
  MailConfirm: {
    type: Boolean,
    default: false,
  },
  AdminConfirmation: {
    type: Boolean,
    default: false,
  },
  license: [{
    type: Schema.Types.ObjectId,
    ref: 'License',  // Assuming 'license' model is 'License'
    default: [],
  }],
  useractive: {
    type: Boolean,  // Changed to boolean
    default: false, // Default inactive; set to true on confirmation or admin approval
  },
  refreshTokens: [{ type: String, expires: '7d' }], // Auto-expire old tokens
});

module.exports = mongoose.model('users', usersSchema);
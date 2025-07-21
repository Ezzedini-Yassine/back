const bcrypt = require('bcrypt');
const payloadChecker = require('payload-validator');
const userRepository = require('../repositories/userRepository');

const saltRounds = 10;

class UserService {
  async registerAdmin(userData) {
    // Validate payload
    const expectedPayload = {
      username: { type: 'string', required: true },
      email: { type: 'email', required: true },
      password: { type: 'string', required: true, min: 8 },
    };
    const validation = payloadChecker.validator(userData, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    // Check if user exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    // Set defaults
    userData.role = 'admin';
    userData.MailConfirm = false;  // Requires confirmation

    return await userRepository.create(userData);
  }

  async registerUser(userData) {
    // Validate payload (includes extra fields)
    const expectedPayload = {
      username: { type: 'string', required: true },
      email: { type: 'email', required: true },
      password: { type: 'string', required: true, min: 8 },
      useractive: { type: 'string', required: true },  // ObjectId as string
      license: { type: 'array', required: true },
    };
    const validation = payloadChecker.validator(userData, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    // Check if user exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    // Set defaults
    userData.role = 'user';
    userData.MailConfirm = true;  // Auto-confirmed

    return await userRepository.create(userData);
  }

  // Add more methods later (e.g., for email confirmation)
}

module.exports = new UserService();
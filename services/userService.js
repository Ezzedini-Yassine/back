const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const payloadChecker = require('payload-validator');
const userRepository = require('../repositories/userRepository');

const saltRounds = 10;

class UserService {

async createUserByAdmin(userData) {
  const expectedPayload = {
    username: { type: 'string', required: true },
    email: { type: 'email', required: true },
    password: { type: 'string', required: true, min: 8 },
  };
  const validation = payloadChecker.validator(userData, expectedPayload, Object.keys(expectedPayload), false);
  if (validation.hasError) {
    throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
  }

  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  userData.password = await bcrypt.hash(userData.password, saltRounds);
  userData.role = 'user';
  userData.MailConfirm = true;
  userData.AdminConfirmation = true;
  userData.useractive = true;
  userData.license = []; // Empty as default

  const user = await userRepository.create(userData);
  return user;
}

  async getAllUsers() {
  const User = require('../models/users'); // Direct model for query
  return await User.find({}, 'username email Date_Creation MailConfirm AdminConfirmation useractive role'); // Select relevant fields
}

async updateUserFields(userId, updates) {
  const allowedFields = ['MailConfirm', 'AdminConfirmation', 'useractive'];
  const filteredUpdates = {};
  for (const key in updates) {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  }
  if (Object.keys(filteredUpdates).length === 0) throw new Error('No valid fields to update');

  const user = await userRepository.updateById(userId, filteredUpdates);
  if (!user) throw new Error('User not found');
  return user;
}

async changePassword(userId, currentPassword, newPassword) {
  const expectedPayload = {
    currentPassword: { type: 'string', required: true, min: 8 },
    newPassword: { type: 'string', required: true, min: 8 },
  };
  const validation = payloadChecker.validator({ currentPassword, newPassword }, expectedPayload, Object.keys(expectedPayload), false);
  if (validation.hasError) {
    throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
  }

  const user = await userRepository.findById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Incorrect current password');

  user.password = await bcrypt.hash(newPassword, saltRounds);
  await user.save();
  return { message: 'Password updated successfully' };
}

  async getUserStats() {
  const User = require('../models/users'); // Direct model access for counts
  const totalUsers = await User.countDocuments();
  const confirmedUsers = await User.countDocuments({ MailConfirm: true });
  const activeUsers = await User.countDocuments({ useractive: true });
  return { totalUsers, confirmedUsers, activeUsers };
}

  generateAccessToken(user) {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '15m' });
  }

  generateRefreshToken(user) {
    return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_EXPIRY || '7d' });
  }

  async registerAdmin(userData) {
    const expectedPayload = {
      username: { type: 'string', required: true },
      email: { type: 'email', required: true },
      password: { type: 'string', required: true, min: 8 },
    };
    const validation = payloadChecker.validator(userData, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    userData.password = await bcrypt.hash(userData.password, saltRounds);
    userData.role = 'admin';
    userData.MailConfirm = false; // Requires confirmation
    userData.useractive = true; // Admins are active by default
    userData.AdminConfirmation = true; // Admins are automatically confirmed

    const user = await userRepository.create(userData);
    await this.sendMailConfirmation(user);
    return user;
  }

  async registerUser(userData) {
    const expectedPayload = {
      username: { type: 'string', required: true },
      email: { type: 'email', required: true },
      password: { type: 'string', required: true, min: 8 },
      license: { type: 'array', required: true },
    };
    const validation = payloadChecker.validator(userData, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    userData.password = await bcrypt.hash(userData.password, saltRounds);
    userData.role = 'user';
    userData.MailConfirm = false; // Requires email confirmation
    userData.useractive = true; // Users are active by default but need email confirmation
    userData.AdminConfirmation = true; // Users are automatically confirmed by admin 

    const user = await userRepository.create(userData);
    await this.sendMailConfirmation(user);
    return user;
  }

  async sendMailConfirmation(user) {
    const token = jwt.sign({ users: user }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    const encodedToken = encodeURIComponent(token);
    const activationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm/${encodedToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: 'Luxbord',
      to: user.email,
      subject: 'Activate your Luxboard Account',
      text: 'Verify your email!',
      html: `
        <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
          }
          h2 {
              color: #333;
          }
          .logo {
              width: 150px;
              height: auto;
          }
          .content {
              margin-top: 20px;
              color: #555;
          }
          .footer {
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #777;
              font-size: 14px;
          }
        </style>
        <div class="container">
            <h2>Hello,</h2>
            <img class="logo" src="https://luxboard.treetronix.com/assets/img/logo.png" alt="Luxbord Logo">
            <div class="content">
                To activate your Luxboard account, please click on the following link:
                <a href="${activationLink}">Activate Your Account</a>
                <p>Once you have activated your account, you will be able to log in and start using Luxboard.</p>
                <p>If you encounter any issues while activating your account, please don't hesitate to contact us at <a href="mailto:contact@treetronix.com">contact@treetronix.com</a>.</p>
                <p>We look forward to welcoming you to Luxboard!</p>
            </div>
            <div class="footer">
                <a href="https://treetronix.com/"><p>Treetronix</p></a>
                <p>Contact: +216 71 111 100</p>
                <p>Email: <a href="mailto:contact@treetronix.com">contact@treetronix.com</a></p>
            </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to send confirmation email');
    }
  }

  async confirmEmail(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    throw new Error('Invalid or expired token');
  }

  const user = await userRepository.findById(decoded.users._id);
  if (!user) throw new Error('User not found');
  if (user.MailConfirm) throw new Error('Email already confirmed');

  user.MailConfirm = true;
  await user.save();
  return user;
}

  async login(credentials) {
    const expectedPayload = {
      email: { type: 'email', required: true },
      password: { type: 'string', required: true },
    };
    const validation = payloadChecker.validator(credentials, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.MailConfirm) {
      throw new Error('Email not confirmed');
    }
    if (!user.AdminConfirmation) {
      throw new Error('Admin confirmation required');
    }
    if (!user.useractive) {
      throw new Error('User account is inactive');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token to user
    user.refreshTokens.push(refreshToken);
    await user.save();

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken, userId) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (decoded.userId.toString() !== userId.toString()) throw new Error('Invalid refresh token');

      const user = await userRepository.findById(userId);
      if (!user || !user.refreshTokens.includes(refreshToken)) throw new Error('Invalid refresh token');

      // Rotate refresh token
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      const newRefreshToken = this.generateRefreshToken(user);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      const newAccessToken = this.generateAccessToken(user);
      return { newAccessToken, newRefreshToken };
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async findById(id) {
    return await userRepository.findById(id);
  }
}

module.exports = new UserService();
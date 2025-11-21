// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

// In a real production app, this secret MUST be in a .env file!
const JWT_SECRET = 'your-super-secret-key-that-is-long-and-random';

/**
 * Business logic to register a new user.
 */
const registerUser = async (username, password, fullName, role) => {
  // 1. Check if user already exists
  const existingUser = await userRepository.findByUsername(username);
  if (existingUser) {
    // We throw an error that the controller will catch
    throw new Error('Username already exists');
  }

  // 2. Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Create the user
  const newUser = await userRepository.createUser(username, passwordHash, fullName, role);
  return newUser;
};

/**
 * Business logic to log a user in.
 */
const loginUser = async (username, password) => {
  // 1. Find the user by username
  const user = await userRepository.findByUsername(username);
  if (!user) {
    // Generic error to prevent username enumeration
    throw new Error('Invalid username or password');
  }

  // 2. Compare the provided password with the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  // 3. Generate a JWT if credentials are valid
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' } // Token will be valid for 1 hour
  );

  // 4. Return the user info (without password) and the token
  return {
    user: { id: user.id, username: user.username, fullName: user.full_name, role: user.role },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
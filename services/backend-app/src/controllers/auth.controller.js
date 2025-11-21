// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;

    // Basic validation
    if (!username || !password || !fullName || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = await authService.registerUser(username, password, fullName, role);
    res.status(201).json(newUser);
  } catch (error) {
    // Send a specific error if the username is taken
    res.status(409).json({ message: error.message }); // 409 Conflict
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const result = await authService.loginUser(username, password);
    res.status(200).json(result);
  } catch (error) {
    // Send a generic 401 Unauthorized for login failures
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
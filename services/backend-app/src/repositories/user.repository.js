// src/repositories/user.repository.js
const db = require('../config/db');

/**
 * Finds a user by their username.
 * @param {string} username - The username to search for.
 * @returns {Promise<object|undefined>} The user object or undefined if not found.
 */
const findByUsername = async (username) => {
  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0];
};

/**
 * Creates a new user in the database.
 * @param {string} username
 * @param {string} passwordHash - The already hashed password.
 * @param {string} fullName
 * @param {string} role - 'STUDENT', 'ACADEMIC_OFFICE', or 'ADMIN'.
 * @returns {Promise<object>} The newly created user object (without password hash).
 */
const createUser = async (username, passwordHash, fullName, role) => {
  const { rows } = await db.query(
    'INSERT INTO users (username, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, username, full_name, role, created_at',
    [username, passwordHash, fullName, role]
  );
  return rows[0];
};

module.exports = {
  findByUsername,
  createUser,
};
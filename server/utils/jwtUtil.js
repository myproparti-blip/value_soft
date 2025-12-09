import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "98654653211323232303033";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "24h";

/**
 * Generate a JWT token for a user
 * @param {Object} payload - { username, role, clientId }
 * @returns {string} - JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decode a JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {Object} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

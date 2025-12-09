import { authenticateUser } from "../models/clientUsersModel.js";
import { generateToken } from "../utils/jwtUtil.js";

export const login = (req, res) => {
  const { clientId, username, password } = req.body;

  // Validate required fields
  if (!clientId || !username || !password) {
    return res.status(400).json({ 
      message: "ClientId, username, and password are required" 
    });
  }

  // Authenticate user for the specific client
  const user = authenticateUser(clientId, username, password);

  if (!user) {
    return res.status(401).json({ 
      message: "Invalid credentials. Please check your clientId, username, and password." 
    });
  }

  // Generate JWT token
  const jwtToken = generateToken({
    username: user.username,
    role: user.role,
    clientId: user.clientId,
  });

  res.status(200).json({
    message: "Sign in successful",
    role: user.role,
    username: user.username,
    clientId: user.clientId,
    token: jwtToken,
  });
};


export const logout = (req, res) => {
  // Extract user from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(400).json({ message: "No user session found" });
  }

  try {
    // Decode the Authorization header (sent as URL-encoded JSON)
    const userString = decodeURIComponent(authHeader);
    const user = JSON.parse(userString);

    // Validate required user fields
    if (!user.username || !user.clientId) {
      return res.status(400).json({ message: "Invalid session information" });
    }

    // Send success response with clientId
    res.status(200).json({
      message: "Logout successful",
      username: user.username,
      clientId: user.clientId,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid session" });
  }
};
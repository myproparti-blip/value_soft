import { verifyToken } from "../utils/jwtUtil.js";

/**
 * Middleware to validate user from JWT token or legacy auth methods
 * Supports multiple formats (checked in priority order):
 * 1. JWT Token in Authorization header: "Bearer <jwt-token>"
 * 2. Request body: { username, userRole, clientId }
 * 3. Query parameters: ?username=user&userRole=role&clientId=id
 * 4. Legacy bearerToken in Authorization header: base64 or URL-encoded JSON
 */
export const authMiddleware = (req, res, next) => {
  try {
    let user = null;
    let authSource = null;

    // Priority 1: Try JWT token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.slice(7);
        const decoded = verifyToken(token);
        if (decoded) {
          user = {
            username: decoded.username,
            role: decoded.role,
            clientId: decoded.clientId
          };
          authSource = "jwt";
        }
      } catch (jwtError) {
        // If JWT verification fails, try legacy methods
      }
    }

    // Priority 2: Try to get user from request body (only if username AND role AND clientId are ALL present)
    if (!user && req.body && req.body.username && (req.body.userRole || req.body.role) && req.body.clientId) {
      user = {
        username: req.body.username,
        role: req.body.userRole || req.body.role,
        clientId: req.body.clientId
      };
      authSource = "body";
    }
    
    // Priority 3: Try to get user from query parameters (if not found in body - prioritizes query for multipart requests)
    if (!user && req.query && req.query.username && req.query.clientId) {
      user = {
        username: req.query.username,
        role: req.query.userRole || req.query.role || "user",
        clientId: req.query.clientId
      };
      authSource = "query";
    }
    
    // Priority 4: Fall back to legacy Authorization header (base64 or URL-encoded JSON)
    if (!user && req.headers.authorization) {
      let decodedAuth;
      let authHeader = req.headers.authorization;
      
      // Remove "Bearer " prefix if present
      if (authHeader.startsWith('Bearer ')) {
        authHeader = authHeader.slice(7);
      }
      
      // Try URL-encoded first (most common)
      try {
        decodedAuth = decodeURIComponent(authHeader);
        user = JSON.parse(decodedAuth);
        authSource = "legacy-bearer";
        console.log("[authMiddleware] Successfully parsed URL-encoded auth:", user);
      } catch (urlError) {
        console.error("[authMiddleware] URL-decode/parse failed:", urlError.message);
        // Try base64 decoding as fallback
        try {
          decodedAuth = Buffer.from(authHeader, 'base64').toString('utf-8');
          user = JSON.parse(decodedAuth);
          authSource = "legacy-bearer-base64";
          console.log("[authMiddleware] Successfully parsed base64 auth:", user);
        } catch (base64Error) {
          console.error("[authMiddleware] Base64 decode/parse failed:", base64Error.message);
        }
      }
      
      // Normalize role field
      if (user && user.userRole && !user.role) {
        user.role = user.userRole;
      }
    }
    
    // Validate required fields
    if (!user) {
      console.error("[authMiddleware] No user found. Authorization header:", req.headers.authorization ? "present" : "missing");
      return res.status(401).json({ message: "Unauthorized - Missing user information" });
    }

    if (!user.username || !user.role) {
      console.error("[authMiddleware] Missing required user fields:", { username: user.username, role: user.role });
      return res.status(401).json({ message: "Unauthorized - Missing user information" });
    }

    // CLIENT ISOLATION - CRITICAL: clientId must be present in all requests
    if (!user.clientId) {
      console.error("[authMiddleware] Missing clientId for user:", user.username);
      return res.status(400).json({ message: "Missing clientId - Client identification required" });
    }

    req.user = user;
    next();
    } catch (err) {
    console.error("[authMiddleware] Unexpected error:", err.message);
    return res.status(401).json({ message: "Unauthorized - Authentication error: " + err.message });
    }
};

/**
 * Check if user is manager or admin
 * Compatible with new role system where manager role is used instead of manager1/manager2
 */
export const isManagerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No user found" });
  }
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Only manager or admin can perform this action" });
  }
  
  next();
};

/**
 * Check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No user found" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Only admin can perform this action" });
  }
  next();
};

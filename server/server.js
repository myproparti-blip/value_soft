// ---------------------------------------------------
// server.js (Production-Ready / Vercel Compatible)
// ---------------------------------------------------

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

// ---------------------------------------------------
// ENVIRONMENT LOADING
// ---------------------------------------------------
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

// ---------------------------------------------------
// EXPRESS APP
// ---------------------------------------------------
const app = express();

// ---------------------------------------------------
// GLOBAL MONGOOSE CACHED CONNECTION (VERCEL SAFE)
// ---------------------------------------------------
let globalConnection = globalThis.mongooseConnection;

async function connectDatabase() {
  if (globalConnection && globalConnection.readyState === 1) {
    return globalConnection;
  }

  globalConnection = await connectDB();
  globalThis.mongooseConnection = globalConnection;

  return globalConnection;
}

// ---------------------------------------------------
// SECURE CORS FIX (NO MORE NETWORK ERROR)
// ---------------------------------------------------
// ---------------------------------------------------
// CORS (SAFE FOR POSTMAN, BROWSER, AND VERCEL)
// ---------------------------------------------------
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://valuation-qb2y.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman, mobile apps — NO ORIGIN header
      if (!origin) return callback(null, true);

      // In development allow everything
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // Allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any Vercel subdomain frontend
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Production block (silent, no crash)
      console.warn("❌ CORS Blocked Origin:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);



// ---------------------------------------------------
// BODY PARSER
// ---------------------------------------------------
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------
// AUTO DB CONNECTOR (SAFE FOR VERCEL)
// ---------------------------------------------------
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    res.status(503).json({ message: "Database unavailable" });
  }
});

// ---------------------------------------------------
// AUTH MIDDLEWARE (GLOBAL)
// ---------------------------------------------------
import { authMiddleware } from "./middleware/authMiddleware.js";
app.use("/api", authMiddleware);

// ---------------------------------------------------
// ROUTES
// ---------------------------------------------------
import authRoutes from "./routes/authRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import customOptionsRoutes from "./routes/customOptionsRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import ubiApfRoutes from "./routes/ubiApfRoutes.js";
import valuationRoutes from "./routes/ubiShopRoutes.js";
import bofMaharastraRoutes from "./routes/bomFlatRoutes.js";


app.use("/api/auth", authRoutes);
app.use("/api/valuations", valuationRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/options", customOptionsRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/ubi-apf", ubiApfRoutes);
app.use("/api/bof-maharashtra", bofMaharastraRoutes);


app.get("/", (req, res) => {
  res.send("🚀 MERN Backend Running – Production Optimized");
});

// ---------------------------------------------------
// ---------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Local Server: http://localhost:${PORT}`)
  );
}

export default app;

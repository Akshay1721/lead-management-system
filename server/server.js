import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://lead-management-system-tan.vercel.app" // Your deployed frontend URL
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        // Allow requests with no origin (e.g., Postman, curl)
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(
          new Error(`Not allowed by CORS: Origin ${origin} is not allowed`),
          false
        );
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Lead Management API Server is running!",
    status: "success",
    endpoints: {
      auth: "/api/auth/register, /api/auth/login",
      leads: "/api/leads"
    }
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1); // Stop app on DB failure
  });

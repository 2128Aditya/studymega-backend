import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

/* ============================= */
/* ENV + DB CONNECT */
/* ============================= */

dotenv.config();
connectDB();

/* ============================= */
/* APP INIT */
/* ============================= */

const app = express();

/* ============================= */
/* CORS CONFIG (OPEN FOR NOW) */
/* ============================= */

app.use(
  cors({
    origin: "*",
  })
);

/* ============================= */
/* MIDDLEWARES */
/* ============================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============================= */
/* HEALTH CHECK */
/* ============================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "StudyMega Backend Running 🚀",
  });
});

/* ============================= */
/* ROUTES */
/* ============================= */

app.use("/api/auth", authRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

/* ============================= */
/* 404 HANDLER */
/* ============================= */

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ============================= */
/* GLOBAL ERROR HANDLER */
/* ============================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

/* ============================= */
/* SERVER START */
/* ============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
import express from "express";
import {
  addPdf,
  deletePdf,
  getAllPdfs,
  getPdfById,
} from "../controllers/pdfController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllPdfs);
router.get("/:id", getPdfById);

// Admin
router.post("/", protect, adminOnly, addPdf);
router.delete("/:id", protect, adminOnly, deletePdf);

export default router;
import express from "express";
import { askAI, generateStudyPlan } from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask", askAI);
router.post("/study-plan", generateStudyPlan);

export default router;
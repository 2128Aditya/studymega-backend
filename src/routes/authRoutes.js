console.log("authRoutes file loaded");
import express from "express";
import {
  createAdmin,
  loginUser,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-admin", createAdmin);

export default router;

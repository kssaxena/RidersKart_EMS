import { Router } from "express";
import {
  loginHead,
  registerEmployeeByHead,
  getHeadDashboard,
  regenerateHeadRefreshToken,
} from "../controllers/head.controllers.js";
import { VerifyHead } from "../middlewares/auth.middlewares.js";

const router = Router();

/* ========= AUTH ========= */
router.route("/login").post(loginHead);

/* ========= HEAD ONLY ========= */
router.route("/dashboard").get(VerifyHead, getHeadDashboard);
router.route("/register-employee").post(VerifyHead, registerEmployeeByHead);
router.route("/refresh-tokens").post(regenerateHeadRefreshToken);


export default router;

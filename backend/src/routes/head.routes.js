import { Router } from "express";
import {
  loginHead,
  registerEmployeeByHead,
  getHeadDashboard,
  regenerateHeadRefreshToken,
} from "../controllers/head.controllers.js";
import { VerifyHead } from "../middlewares/auth.middlewares.js";
import {
  markEmployeeActive,
  markEmployeeInactive,
} from "../controllers/employee.controllers.js";

const router = Router();

/* ========= AUTH ========= */
router.route("/login").post(loginHead);

/* ========= Head ONLY ========= */
router.route("/dashboard").get(VerifyHead, getHeadDashboard);
router.route("/register-employee").post(VerifyHead, registerEmployeeByHead);
router.route("/refresh-tokens").post(regenerateHeadRefreshToken);
router
  .route("/mark-employee-active/:employeeId")
  .post(VerifyHead, markEmployeeActive);
router
  .route("/mark-employee-inactive/:employeeId")
  .post(VerifyHead, markEmployeeInactive);

export default router;

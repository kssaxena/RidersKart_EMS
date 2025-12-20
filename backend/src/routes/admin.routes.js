import { Router } from "express";
import {
  loginAdmin,
  registerHead,
  registerEmployeeByAdmin,
  getAdminDashboard,
} from "../controllers/admin.controller.js";
import { VerifyAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

/* ========= AUTH ========= */
router.route("/login").post(loginAdmin);

/* ========= ADMIN ONLY ========= */
router.route("/dashboard").get(VerifyAdmin, getAdminDashboard);
router.route("/register-head").post(VerifyAdmin, registerHead);
router.route("/register-employee").post(VerifyAdmin, registerEmployeeByAdmin);

export default router;

import { Router } from "express";
import {
  loginAdmin,
  registerHead,
  registerEmployeeByAdmin,
  getAdminDashboard,
  regenerateAdminRefreshToken,
  registerAdmin,
  getAllHeads,
  getAdminById,
} from "../controllers/admin.controllers.js";
import { VerifyAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

/* ========= AUTH ========= */
router.route("/register/:adminId").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/get-all-heads").get(getAllHeads);
router.route("/get-admin/:adminId").get(getAdminById);

/* ========= ADMIN ONLY ========= */
router.route("/dashboard").get(VerifyAdmin, getAdminDashboard);
router.route("/register-head").post(VerifyAdmin, registerHead);
router.route("/register-employee").post(VerifyAdmin, registerEmployeeByAdmin);
router.route("/refresh-tokens").post(regenerateAdminRefreshToken);

export default router;

import { Router } from "express";
import {
  searchEmployees,
  getEmployeeDetails,
  authenticateEmployee,
} from "../controllers/employee.controllers.js";

const router = Router();

/* ========= PUBLIC ========= */
router.route("/search").get(searchEmployees);
router.route("/:id").get(getEmployeeDetails);
router.route("/authentication").post(authenticateEmployee);

export default router;

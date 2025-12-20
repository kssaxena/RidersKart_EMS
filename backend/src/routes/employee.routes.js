import { Router } from "express";
import {
  searchEmployees,
  getEmployeeDetails,
} from "../controllers/employee.controllers.js";

const router = Router();

/* ========= PUBLIC ========= */
router.route("/search").get(searchEmployees);
router.route("/:id").get(getEmployeeDetails);

export default router;

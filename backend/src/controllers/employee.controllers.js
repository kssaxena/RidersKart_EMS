import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employee } from "../models/Employee.model.js";

/* =======================
   SEARCH EMPLOYEES (PUBLIC)
======================= */
const searchEmployees = asyncHandler(async (req, res) => {
  const { name, employeeId, department } = req.query;

  const filter = {
    ...(name && { name: { $regex: name, $options: "i" } }),
    ...(employeeId && { employeeId }),
    ...(department && { department }),
  };

  const employees = await Employee.find(filter).select(
    "name employeeId designation department"
  );

  res.status(200).json(new ApiResponse(200, employees));
});

/* =======================
   EMPLOYEE DETAILS (PUBLIC)
======================= */
const getEmployeeDetails = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id).populate(
    "reportingAuthority",
    "name designation"
  );

  if (!employee) return next(new ApiError(404, "Employee not found"));

  res.status(200).json(new ApiResponse(200, employee));
});

export { searchEmployees, getEmployeeDetails };

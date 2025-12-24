import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employee } from "../models/employee.models.js";

/* =======================
   SEARCH EMPLOYEES (PUBLIC)
======================= */
const searchEmployees = asyncHandler(async (req, res) => {
  const { query } = req.query;

  // If no query or empty string
  if (!query || query.trim() === "") {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No search query provided"));
  }

  // Normalize input
  const cleanedQuery = query.trim().toLowerCase();

  // Split words (supports full sentence)
  const keywords = cleanedQuery.split(/\s+/);

  /**
   * Build OR conditions for each keyword
   * (only for direct employee fields)
   */
  const orConditions = keywords.flatMap((word) => [
    { name: { $regex: word, $options: "i" } },
    { employeeId: { $regex: word, $options: "i" } },
    { department: { $regex: word, $options: "i" } },
    { designation: { $regex: word, $options: "i" } },
    { email: { $regex: word, $options: "i" } },
    { phoneNumber: { $regex: word, $options: "i" } },
    { officeLocation: { $regex: word, $options: "i" } },
    { pincode: { $regex: word, $options: "i" } },
  ]);

  const employees = await Employee.find({
    $or: orConditions,
  })
    // ✅ populate reporting authority
    .populate({
      path: "reportingAuthority",
      select: "name employeeId",
    })
    // ✅ select all required employee fields
    .select(
      "name employeeId designation department email phoneNumber isActive officeLocation pincode reportingAuthority"
    )
    .limit(50); // safety limit

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        employees,
        employees.length ? "Employees found" : "No employees found"
      )
    );
});

/* =======================
   EMPLOYEE DETAILS (PUBLIC)
======================= */
const getEmployeeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id)
    .populate(
      "reportingAuthority",
      "name phoneNumber designation email employeeId"
    )
    .populate("createdById", "name phoneNumber designation email employeeId");
  if (!employee) throw new ApiError(404, "Employee not found");

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee fetched successfully"));
});

export { searchEmployees, getEmployeeDetails };

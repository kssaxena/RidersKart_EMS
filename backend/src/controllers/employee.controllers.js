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
    isActive: true, // ✅ EXCLUDE INACTIVE EMPLOYEES
    $or: orConditions,
  })
    .populate({
      path: "reportingAuthority",
      select: "name employeeId",
    })
    .select(
      "name employeeId designation department email phoneNumber officeLocation pincode reportingAuthority"
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
// const getEmployeeDetails = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const employee = await Employee.findById(id)
//     .populate(
//       "reportingAuthority",
//       "name phoneNumber designation email employeeId"
//     )
//     .populate("createdById", "name phoneNumber designation email employeeId");
//   if (!employee) throw new ApiError(404, "Employee not found");

//   console.log(employee);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, employee, "Employee fetched successfully"));
// });

const getEmployeeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id).populate(
    "reportingAuthority",
    "name phoneNumber designation email employeeId"
  );

  if (!employee) throw new ApiError(404, "Employee not found");

  // 🔥 CONDITIONAL POPULATION
  if (employee.createdBy === "Admin") {
    await employee.populate({
      path: "createdById",
      model: "Admin",
      select: "name phoneNumber email employeeId",
    });
  } else if (employee.createdBy === "Head") {
    await employee.populate({
      path: "createdById",
      model: "Head",
      select: "name phoneNumber designation email employeeId",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee fetched successfully"));
});

const markEmployeeActive = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApiError(404, "Employee not found");

  employee.isActive = true;
  await employee.save();

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Marked Active !"));
});

const markEmployeeInactive = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApiError(404, "Employee not found");

  employee.isActive = false;
  await employee.save();

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Marked inactive !"));
});

const authenticateEmployee = asyncHandler(async (req, res) => {
  const { employeeId, accessPin } = req.body;


  if (!employeeId || !accessPin) {
    throw new ApiError(400, "Employee ID and access PIN are required");
  }

  const employee = await Employee.findOne({ employeeId });

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  if (!employee.isActive) {
    throw new ApiError(403, "Employee is inactive");
  }

  if (Number(employee.accessPin) !== Number(accessPin)) {
    throw new ApiError(401, "Invalid access PIN");
  }

  // ✅ Only confirmation, no data leakage
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Employee authenticated successfully"));
});

export {
  searchEmployees,
  getEmployeeDetails,
  markEmployeeInactive,
  markEmployeeActive,
  authenticateEmployee,
};

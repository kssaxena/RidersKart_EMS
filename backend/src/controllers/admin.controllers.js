import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { Head } from "../models/head.models.js";
import { Employee } from "../models/employee.models.js";

/* =======================
   ADMIN LOGIN
======================= */
const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ApiError(400, "Email and password are required"));

  const admin = await Admin.findOne({ email });
  if (!admin) return next(new ApiError(401, "Invalid credentials"));

  const isValid = await admin.isPasswordCorrect(password);
  if (!isValid) return next(new ApiError(401, "Invalid credentials"));

  const accessToken = admin.generateAccessToken();

  res.status(200).json(
    new ApiResponse(200, {
      admin,
      token: accessToken,
    })
  );
});

/* =======================
   REGISTER HEAD (ADMIN)
======================= */
const registerHead = asyncHandler(async (req, res, next) => {
  const adminId = req.user._id;

  const {
    name,
    employeeId,
    email,
    phoneNumber,
    designation,
    department,
    password,
  } = req.body;

  if (
    !name ||
    !employeeId ||
    !email ||
    !phoneNumber ||
    !designation ||
    !department ||
    !password
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existing = await Head.findOne({ email });
  if (existing)
    return next(new ApiError(400, "Head with this email already exists"));

  const head = await Head.create({
    name,
    employeeId,
    email,
    phoneNumber,
    designation,
    department,
    password,
    createdByAdmin: adminId,
  });

  await Admin.findByIdAndUpdate(adminId, {
    $push: { createdHeads: head._id },
    $inc: { "stats.totalHeads": 1 },
  });

  res
    .status(201)
    .json(new ApiResponse(201, head, "Head registered successfully"));
});

/* =======================
   REGISTER EMPLOYEE (ADMIN)
======================= */
const registerEmployeeByAdmin = asyncHandler(async (req, res, next) => {
  const adminId = req.user._id;

  const {
    name,
    employeeId,
    designation,
    department,
    pincode,
    reportingAuthority,
  } = req.body;

  if (
    !name ||
    !employeeId ||
    !designation ||
    !department ||
    !pincode ||
    !reportingAuthority
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  const employee = await Employee.create({
    name,
    employeeId,
    designation,
    department,
    pincode,
    reportingAuthority,
    createdBy: "ADMIN",
    createdById: adminId,
  });

  await Admin.findByIdAndUpdate(adminId, {
    $push: { createdEmployees: employee._id },
    $inc: { "stats.totalEmployees": 1 },
  });

  res
    .status(201)
    .json(new ApiResponse(201, employee, "Employee registered successfully"));
});

/* =======================
   ADMIN DASHBOARD
======================= */
const getAdminDashboard = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id)
    .populate("createdHeads", "name employeeId designation")
    .populate("createdEmployees", "name employeeId designation");

  res.status(200).json(new ApiResponse(200, admin));
});

export { loginAdmin, registerHead, registerEmployeeByAdmin, getAdminDashboard };

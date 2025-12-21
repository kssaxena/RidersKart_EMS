import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { Head } from "../models/head.models.js";
import { Employee } from "../models/employee.models.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import Jwt from "jsonwebtoken";

const regenerateAdminRefreshToken = asyncHandler(async (req, res) => {
  const token = req.body.RefreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const admin = await Admin.findById(decoded._id).select("-password");
  if (!admin) throw new ApiError(401, "Invalid refresh token");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
    "ADMIN"
  );

  return res.status(201).json(
    new ApiResponse(201, {
      user: admin,
      tokens: { AccessToken, RefreshToken },
    })
  );
});

const registerAdmin = asyncHandler(async (req, res, next) => {
  const { name, employeeId, email, phoneNumber, password } = req.body;
  // console.log(name, employeeId, email, phoneNumber, password);

  // Validation
  if (!name || !employeeId || !email || !phoneNumber || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check existing admin
  const existingAdmin = await Admin.findOne({
    $or: [{ email }, { employeeId }],
  });

  if (existingAdmin) {
    return next(
      new ApiError(400, "Admin with same email or employeeId already exists")
    );
  }

  // Create admin
  const admin = await Admin.create({
    name,
    employeeId,
    email,
    phoneNumber,
    password, // hashed by pre-save hook
  });

  // Remove sensitive fields
  const adminData = await Admin.findById(admin._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, adminData, "Admin registered successfully"));
});
/* =======================
   ADMIN LOGIN
======================= */
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(401, "Invalid credentials");

  const isValid = await admin.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
    "ADMIN"
  );

  return res.status(200).json(
    new ApiResponse(200, {
      admin,
      tokens: {
        AccessToken,
        RefreshToken,
      },
    })
  );
});

/* =======================
   REGISTER HEAD (ADMIN)
======================= */
const registerHead = asyncHandler(async (req, res, next) => {
  const adminId = req.user._id;
  console.log("controller reached");
  const {
    name,
    employeeId,
    email,
    phoneNumber,
    designation,
    department,
    password,
  } = req.body;

  console.log(
    name,
    employeeId,
    email,
    phoneNumber,
    designation,
    department,
    password
  );

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
    phoneNumber,
    officeLocation,
    pincode,
    reportingAuthority,
    email,
  } = req.body;

  if (
    !name ||
    !employeeId ||
    !designation ||
    !department ||
    !phoneNumber ||
    !officeLocation ||
    !pincode ||
    !reportingAuthority ||
    !email
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  const employee = await Employee.create({
    name,
    employeeId,
    designation,
    department,
    phoneNumber,
    email,
    officeLocation,
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
    .populate("createdHeads", "name employeeId designation email")
    .populate("createdEmployees", "name employeeId designation email");
  // .populate("createdEmployees", "name employeeId designation");

  const allHead = await Head.find().select("name employeeId designation email");
  const allEmployee = await Employee.find().select(
    "name employeeId designation email"
  );

  res.status(200).json(new ApiResponse(200, { admin, allHead, allEmployee }));
});

const getAllHeads = asyncHandler(async (req, res) => {
  const heads = await Head.find().select("name employeeId phoneNumber");

  res.status(200).json(new ApiResponse(200, heads));
});

const getAdminById = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  console.log("from controller", adminId);

  const admin = await Admin.findById(adminId).select("name email");
  res.status(200).json(new ApiResponse(200, admin));
});

export {
  loginAdmin,
  registerHead,
  registerEmployeeByAdmin,
  getAdminDashboard,
  regenerateAdminRefreshToken,
  registerAdmin,
  getAllHeads,
  getAdminById,
};

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Head } from "../models/head.models.js";
import { Employee } from "../models/employee.models.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import Jwt from "jsonwebtoken";
import { generateUniqueEmployeePin } from "../utils/UniquePinEmployee.js";

/* =======================
   Head LOGIN
======================= */
const loginHead = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const head = await Head.findOne({ email });
  if (!head) throw new ApiError(401, "Invalid credentials");

  const isValid = await head.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  if (!head.isActive) {
    throw new ApiError(401, "Account inactive");
  }

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    head._id,
    "Head"
  );

  return res.status(200).json(
    new ApiResponse(200, {
      head,
      tokens: {
        AccessToken,
        RefreshToken,
      },
    })
  );
});

/* =======================
   REGISTER EMPLOYEE (Head)
======================= */
const registerEmployeeByHead = asyncHandler(async (req, res, next) => {
  const headId = req.user._id;

  const {
    name,
    employeeId,
    designation,
    department,
    phoneNumber,
    officeLocation,
    pincode,
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
    !email
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const accessPin = await generateUniqueEmployeePin();

  const employee = await Employee.create({
    name,
    employeeId,
    designation,
    department,
    phoneNumber,
    email,
    officeLocation,
    pincode,
    reportingAuthority: headId, // 👈 Head is authority
    accessPin,
    createdBy: "Head",
    createdById: headId,
  });

  await Head.findByIdAndUpdate(headId, {
    $push: { createdEmployees: employee._id },
    $inc: { "stats.totalEmployees": 1 },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, employee, "Employee registered successfully"));
});

/* =======================
   Head DASHBOARD
======================= */
const getHeadDashboard = asyncHandler(async (req, res) => {
  const head = await Head.findById(req.user._id).populate(
    "createdEmployees",
    "name employeeId designation email isActive"
  );

  const allEmployee = await Employee.find().select(
    "name employeeId designation email isActive"
  );

  res.status(200).json(new ApiResponse(200, { head, allEmployee }));
});

const regenerateHeadRefreshToken = asyncHandler(async (req, res) => {
  const token = req.body.RefreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const head = await Head.findById(decoded._id).select("-password");
  if (!head) throw new ApiError(401, "Invalid refresh token");

  if (!head.isActive) throw new ApiError(401, "Your account is inactive");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    head._id,
    "Head"
  );

  return res
    .status(201)
    .cookie("AccessToken", AccessToken)
    .cookie("RefreshToken", RefreshToken)
    .json(
      new ApiResponse(
        201,
        {
          user: head,
          tokens: { AccessToken, RefreshToken },
        },
        "Head re-login successful"
      )
    );
});

export {
  loginHead,
  registerEmployeeByHead,
  getHeadDashboard,
  regenerateHeadRefreshToken,
};

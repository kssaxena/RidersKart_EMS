import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Head } from "../models/head.models.js";
import { Employee } from "../models/employee.models.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";

/* =======================
   HEAD LOGIN
======================= */
const loginHead = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ApiError(400, "Email and password are required"));

  const head = await Head.findOne({ email });
  if (!head) return next(new ApiError(401, "Invalid credentials"));

  const isValid = await head.isPasswordCorrect(password);
  if (!isValid) return next(new ApiError(401, "Invalid credentials"));

  const accessToken = head.generateAccessToken();

  res.status(200).json(
    new ApiResponse(200, {
      head,
      token: accessToken,
    })
  );
});

/* =======================
   REGISTER EMPLOYEE (HEAD)
======================= */
const registerEmployeeByHead = asyncHandler(async (req, res, next) => {
  const headId = req.user._id;

  const { name, employeeId, designation, department, pincode } = req.body;

  if (!name || !employeeId || !designation || !department || !pincode) {
    return next(new ApiError(400, "All fields are required"));
  }

  const employee = await Employee.create({
    name,
    employeeId,
    designation,
    department,
    pincode,
    reportingAuthority: headId,
    createdBy: "HEAD",
    createdById: headId,
  });

  await Head.findByIdAndUpdate(headId, {
    $push: { createdEmployees: employee._id },
    $inc: { "stats.totalEmployees": 1 },
  });

  res
    .status(201)
    .json(new ApiResponse(201, employee, "Employee registered successfully"));
});

/* =======================
   HEAD DASHBOARD
======================= */
const getHeadDashboard = asyncHandler(async (req, res) => {
  const head = await Head.findById(req.user._id).populate(
    "createdEmployees",
    "name employeeId designation"
  );

  res.status(200).json(new ApiResponse(200, head));
});

const regenerateHeadRefreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.RefreshToken || req.body.RefreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const head = await Head.findById(decoded._id).select("-password");
  if (!head) throw new ApiError(401, "Invalid refresh token");

  if (!head.isActive) throw new ApiError(401, "Your account is inactive");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    head._id,
    "HEAD"
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

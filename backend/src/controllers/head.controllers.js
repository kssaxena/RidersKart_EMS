import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Head } from "../models/Head.model.js";
import { Employee } from "../models/Employee.model.js";

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

export { loginHead, registerEmployeeByHead, getHeadDashboard };

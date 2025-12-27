import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";
import { Head } from "../models/head.models.js";

/* =========================
   VERIFY Admin
========================= */
const VerifyAdmin = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(decodedToken?._id).select("-password");

    if (!admin) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = admin;
    req.role = "Admin";
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

/* =========================
   VERIFY Head
========================= */
const VerifyHead = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const head = await Head.findById(decodedToken?._id).select("-password");

    if (!head) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (!head.isActive) {
      throw new ApiError(401, "Your account is inactive");
    }

    req.user = head;
    req.role = "Head";
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

/* =========================
   Admin OR Head
========================= */
const VerifyAdminOrHead = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user =
      (await Admin.findById(decodedToken?._id).select("-password")) ||
      (await Head.findById(decodedToken?._id).select("-password"));

    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { VerifyAdmin, VerifyHead, VerifyAdminOrHead };

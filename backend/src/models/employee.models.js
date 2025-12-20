import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    designation: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
    },

    officeLocation: {
      type: String,
    },

    pincode: {
      type: String,
      required: true,
    },

    reportingAuthority: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Head",
      required: true,
    },

    /* 🔥 WHO CREATED THIS EMPLOYEE */
    createdBy: {
      type: String,
      enum: ["ADMIN", "HEAD"],
      required: true,
    },

    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdBy",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);

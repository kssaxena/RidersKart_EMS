import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN"],
      default: "ADMIN",
    },

    /* 🔥 NEW */
    createdHeads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Head",
      },
    ],

    createdEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    /* ⚡ FAST DASHBOARD COUNTS */
    stats: {
      totalHeads: {
        type: Number,
        default: 0,
      },
      totalEmployees: {
        type: Number,
        default: 0,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔐 Password Hash
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password
adminSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

// 🎟 Token
adminSchema.methods.generateAccessToken = function () {
  return Jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);

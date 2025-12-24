import React, { useState } from "react";
import InputBox from "../InputBox";
import Button from "../Button";

const RegisterHead = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // console.log("Register Data:", formData);
    // API call here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-2">
          <InputBox
            LabelName="Full Name"
            Name="name"
            Placeholder="Enter your name"
            Value={formData.name}
            onChange={handleChange}
          />

          <InputBox
            LabelName="Email"
            Name="email"
            Type="email"
            Placeholder="Enter your email"
            Value={formData.email}
            onChange={handleChange}
          />

          <InputBox
            LabelName="Password"
            Name="password"
            Type="password"
            Placeholder="Create password"
            Value={formData.password}
            onChange={handleChange}
          />

          <InputBox
            LabelName="Confirm Password"
            Name="confirmPassword"
            Type="password"
            Placeholder="Confirm password"
            Value={formData.confirmPassword}
            onChange={handleChange}
          />

          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              label="Register"
              className="w-full py-3 text-lg"
            />
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span className="text-[#DF3F33] cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterHead;

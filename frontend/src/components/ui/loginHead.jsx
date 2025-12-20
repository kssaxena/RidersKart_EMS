import React, { useState } from "react";
import InputBox from "../InputBox";
import Button from "../Button";

const LoginHead = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // API call here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-2">
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
            Placeholder="Enter your password"
            Value={formData.password}
            onChange={handleChange}
          />

          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              label="Login"
              className="w-full py-3 text-lg"
            />
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span className="text-[#DF3F33] cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginHead;

import React, { useRef, useState } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { IoEye, IoMdEyeOff } from "react-icons/io5";

const HeadRegistrationForm = ({ startLoading, stopLoading }) => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [showPassword, setShowPassword] = useState("password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      startLoading();

      const response = await FetchData(
        "/admin/register-head",
        "post",
        Object.fromEntries(formData),
        true
      );

      if (response.data.success) {
        alert("Head registered successfully");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      alert(parseErrorMessage(error?.response?.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center lg:py-24 pt-24 pb-10">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Register Head (HR / Manager)
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Personal Details
          </h3>

          <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input name="name" required className="input" />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Employee ID
              </label>
              <input name="employeeId" required className="input" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input type="email" name="email" required className="input" />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Contact Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                maxLength={10}
                className="input"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Designation
              </label>
              <input name="designation" required className="input" />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Department
              </label>
              <input name="department" required className="input" />
            </div>
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type={showPassword}
              name="password"
              required
              className="input"
            />
            <div className="absolute top-9 right-4">
              {showPassword === "password" ? (
                <IoMdEyeOff
                  onClick={() => setShowPassword("text")}
                  className="cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => setShowPassword("password")}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-6 justify-end">
          <Button label="Register Head" type="submit" />
          <Button
            label="Cancel"
            type="button"
            className="hover:bg-red-600"
            onClick={() => navigate(-1)}
          />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(HeadRegistrationForm);

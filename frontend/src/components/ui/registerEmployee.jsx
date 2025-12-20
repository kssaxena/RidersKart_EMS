import React, { useRef } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const EmployeeRegistrationForm = ({ startLoading, stopLoading }) => {
  const formRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      startLoading();
      const response = await FetchData(
        "/head/register-employee",
        "post",
        Object.fromEntries(formData),
        true
      );

      if (response.data.success) {
        alert("Employee registered successfully");
        navigate(-1);
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
          Register Employee
        </h2>

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
            <label className="block mb-1 text-sm font-medium">
              Designation
            </label>
            <input name="designation" required className="input" />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Department</label>
            <input name="department" required className="input" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Pin Code</label>
            <input name="pincode" required maxLength={6} className="input" />
          </div>
        </div>

        <div className="flex gap-6 justify-end">
          <Button label="Register Employee" type="submit" />
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

export default LoadingUI(EmployeeRegistrationForm);

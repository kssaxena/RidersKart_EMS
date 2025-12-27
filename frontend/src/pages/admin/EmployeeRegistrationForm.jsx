import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectBox from "../../components/SelectionBox";

const EmployeeRegistrationForm = ({ startLoading, stopLoading }) => {
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  // console.log(user);
  const formRef = useRef();
  const navigate = useNavigate();
  const [reportingAuth, setReportingAuth] = useState([]);

  const getAllHeads = async () => {
    try {
      const response = await FetchData("admin/get-all-heads", "get");
      setReportingAuth(response.data.data);
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    getAllHeads();
  }, [user]);
  // console.log(reportingAuth);

  const reportingOptions = reportingAuth.map((auth) => ({
    _id: auth._id, // this will be submitted
    label: `${auth.name} | ${auth.phoneNumber} | ${auth.employeeId}`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);

    try {
      startLoading();
      if (user.role === "Admin") {
        const response = await FetchData(
          "admin/register-employee",
          "post",
          data
        );
        // console.log(response);
      } else {
        const response = await FetchData(
          "head/register-employee",
          "post",
          data
        );
        // console.log(response);
      }
      alert("Employee Registered Successfully");
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/head/dashboard");
      }
      formRef.current.reset();
    } catch (err) {
      // console.log(err);
      alert(parseErrorMessage(err?.response?.data));
    } finally {
      stopLoading();
    }
  };

  return (user && user?.role === "Admin") || user?.role === "Head" ? (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white p-8 max-w-3xl mx-auto shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Register Employee</h2>

      <div className="md:grid-cols-2  md:grid-rows-4 grid md:gap-2">
        <InputBox LabelName="Name" Name="name" required />
        <InputBox LabelName="Employee ID" Name="employeeId" required />
        <InputBox LabelName="Designation" Name="designation" required />
        <InputBox LabelName="Department" Name="department" required />
        <InputBox LabelName="Email" Name="email" required />
        <InputBox LabelName="Phone number" Name="phoneNumber" required />
        <InputBox LabelName="Office Location" Name="officeLocation" required />
        <InputBox LabelName="Pin Code" Name="pincode" required />
        <SelectBox
          LabelName="Reporting Authority"
          Name="reportingAuthority"
          Placeholder="Select Reporting Authority"
          Options={reportingOptions}
          Required
        />
      </div>

      <div className="flex justify-center items-center gap-5">
        {user?.role === "Admin" ? (
          <Button
            label="Cancel"
            type="reset"
            className="mt-4 bg-gray-300 text-black"
            onClick={() => navigate("/admin/dashboard")}
          />
        ) : (
          <Button
            label="Cancel"
            type="reset"
            className="mt-4 bg-gray-300 text-black"
            onClick={() => navigate("/head/dashboard")}
          />
        )}
        {/* <Button
          label="Cancel"
          type="reset"
          className="mt-4 bg-gray-300 text-black"
          onClick={() => navigate("/admin/dashboard")}
        /> */}
        <Button label="Reset" type="reset" className="mt-4" />
        <Button label="Register Employee" type="submit" className="mt-4" />
      </div>
    </form>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !!
      </h2>
    </div>
  );
};

export default LoadingUI(EmployeeRegistrationForm);

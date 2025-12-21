import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingUI from "../../components/LoadingUI";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useSelector } from "react-redux";

const HeadDashboard = ({ startLoading, stopLoading }) => {
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const [headData, setHeadData] = useState(null);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [allEmployeeData, setAllEmployeeData] = useState([]);
  const fetchDashboard = async () => {
    try {
      startLoading();
      const response = await FetchData("head/dashboard", "get", null);
      setHeadData(response.data.data.head);
      setEmployeeData(response.data.data.head.createdEmployees);
      setAllEmployeeData(response.data.data.allEmployee);
    } catch (error) {
      alert(parseErrorMessage(error?.response?.data));
    } finally {
      stopLoading();
    }
  };

  const getAdminDetails = async () => {
    try {
      const response = await FetchData(
        `admin/get-admin/${headData?.createdByAdmin}`,
        "get"
      );
      setAdmin(response.data.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
  useEffect(() => {
    getAdminDetails();
  }, [headData]);

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    navigate("/");
  };

  const DataUI = ({ Text = "", TableData }) => {
    const TableHeaders = ["Employee ID", "Name", "Email", "Designation"];
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">{Text}</h2>
        <div className="w-full h-full mt-1">
          <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                {TableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-5 py-3 font-medium tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TableData?.length > 0 ? (
                TableData?.slice(0, 20).map((data) => (
                  <tr
                    key={data._id}
                    className="hover:bg-gray-50 transition-colors duration-200 border-b"
                  >
                    <td className="px-5 py-3 text-red-500 font-medium">
                      <Link
                        to={`/current-data/${data._id}`}
                        className="hover:underline"
                      >
                        {data?.employeeId}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{data?.name}</td>
                    <td className="px-5 py-3 text-gray-700">{data?.email}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {data?.designation}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={TableHeaders.length}
                    className="px-5 py-6 text-center text-gray-500"
                  >
                    No Data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const userDetails = [
    { label: "Name", value: headData?.name },
    { label: "Email", value: headData?.email },
    { label: "Phone number", value: headData?.phoneNumber },
    { label: "Head Id", value: headData?.employeeId },
    { label: "Role", value: headData?.role },
    {
      label: "Total Employees created",
      value: headData?.stats?.totalEmployees,
    },
    { label: "Designation", value: headData?.designation },
    { label: "Department", value: headData?.department },
    { label: "Your Admin name", value: admin?.name },
    { label: "Your Admin email", value: admin?.email },
  ];

  return user && user?.role === "HEAD" ? (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {headData?.name}
          </h1>
          <p className="text-gray-500 text-sm">
            {headData?.designation} · {headData?.department}
          </p>
        </div>
      </div>

      <div className="flex md:flex-row flex-col md:w-1/2 w-full justify-around md:items-center items-start shadow-2xl p-5 rounded-xl bg-neutral-200">
        <div className="md:space-y-2">
          {userDetails.map((item, index) => (
            <h1 key={index}>
              <strong>{item.label} :</strong> {item.value ?? "NA"}
            </h1>
          ))}
        </div>
        <div className="flex flex-col justify-center items-start gap-5">
          <Button
            label={"Register Employee"}
            className={"w-full"}
            onClick={() => navigate("/head/register-employee")}
          />
          <Button
            label={"Log Out"}
            className={"w-full"}
            onClick={() => logout()}
          />
        </div>
      </div>

      <DataUI TableData={employeeData} Text="Your employees" />
      <DataUI TableData={allEmployeeData} Text="Other registered employees" />
    </div>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !! Please log in to view the dashboard.
      </h2>
    </div>
  );
};

export default LoadingUI(HeadDashboard);

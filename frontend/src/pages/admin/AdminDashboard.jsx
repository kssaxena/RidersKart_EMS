import React, { useEffect, useState } from "react";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slices/authSlice";

const AdminDashboard = ({ startLoading, stopLoading }) => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [headData, setHeadData] = useState([]);
  const [allHeadData, setAllHeadData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [allEmployeeData, setAllEmployeeData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        startLoading();
        const res = await FetchData("admin/dashboard", "get", null, true);
        console.log(res);
        setData(res.data.data.admin);
        setHeadData(res.data.data.admin.createdHeads);
        setEmployeeData(res.data.data.admin.createdEmployees);
        setAllHeadData(res.data.data.allHead);
        setAllEmployeeData(res.data.data.allEmployee);
      } finally {
        stopLoading();
      }
    };
    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    navigate("/");
  };

  const userDetails = [
    { label: "Name", value: data?.name },
    { label: "Email", value: data?.email },
    { label: "Phone number", value: data?.phoneNumber },
    { label: "Admin Id", value: data?.employeeId },
    { label: "Role", value: data?.role },
    { label: "Total HODs created", value: data?.stats?.totalHeads },
    { label: "Total Employees created", value: data?.stats?.totalEmployees },
  ];

  const commands = [
    { label: "Register new Admin", path: "/admin/register-admin" },
    { label: "Register new HOD", path: "/admin/register-head" },
    { label: "Register new Employee", path: "/admin/register-employee" },
  ];

  const HeadDataUI = ({ Text = "", TableData }) => {
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

  return user ? (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex md:flex-row flex-col md:w-1/2 w-full justify-around md:items-center items-start shadow-2xl p-5 rounded-xl bg-neutral-200">
        <div className="md:space-y-2">
          {userDetails.map((item, index) => (
            <h1 key={index}>
              <strong>{item.label} :</strong> {item.value ?? "NA"}
            </h1>
          ))}
        </div>
        <div className="flex flex-col justify-center items-start gap-5">
          {commands.map((item, index) => (
            <Button
              label={item.label}
              className={"w-full"}
              onClick={() => navigate(item.path)}
            />
          ))}
          <Button
            label={"Log Out"}
            className={"w-full"}
            onClick={() => logout()}
          />
        </div>
      </div>
      <HeadDataUI TableData={headData} Text="Your created HODs" />
      <HeadDataUI TableData={allHeadData} Text="All HODs" />
      <HeadDataUI TableData={employeeData} Text="Your created employees" />
      <HeadDataUI TableData={allEmployeeData} Text="All employees" />
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

export default LoadingUI(AdminDashboard);

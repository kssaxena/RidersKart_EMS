import React, { useEffect, useState } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { Link, useNavigate, useParams } from "react-router-dom";

const EmployeeSearch = () => {
  const { searchData } = useParams(); // 👈 from URL
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchData || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Core search function
  const searchEmployees = async (searchText) => {
    if (!searchText || searchText?.trim() === "") {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await FetchData(
        `employee/search?query=${encodeURIComponent(searchText)}`,
        "get"
      );
      setResults(res.data.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Auto-search when route param changes
  useEffect(() => {
    if (searchData) {
      setQuery(searchData);
      searchEmployees(searchData);
    }
  }, [searchData]);

  // 🔹 Manual search (button / enter)
  const handleSearch = () => {
    if (!query.trim()) return;
    // navigate(`/employee-search/${encodeURIComponent(query)}`);
    searchEmployees();
  };

  // console.log(results);

  const ResultDataTableUI = ({ Text = "", TableData }) => {
    const TableHeaders = [
      "Employee ID",
      "Name",
      "Email",
      "Designation",
      "Status",
    ];
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
                TableData?.map((data) => (
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
                    <td className="px-5 py-3 text-gray-700">
                      {data?.isActive === true ? (
                        <h1 className="text-green-600 bg-green-200 text-center">
                          ONLINE
                        </h1>
                      ) : (
                        <h1 className="text-red-600 bg-red-200 text-center">
                          OFFLINE
                        </h1>
                      )}
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

  const Cards = ({ CardData }) => {
    return (
      <div className="flex flex-col justify-center items-center w-full gap-5">
        {CardData?.length > 0
          ? CardData?.map((data, key) => (
              <Link className="flex justify-between items-center w-full shadow-2xl bg-neutral-100 rounded-xl p-5 text-sm">
                <div className="flex flex-col justify-start items-start w-1/2">
                  <h1 className="text-center font-semibold text-red-500">
                    <strong>Employee ID</strong> {data?.employeeId}
                  </h1>
                  <h1 className=" font-semibold">
                    <strong>Name</strong> {data?.name}
                  </h1>
                  <h1>
                    <strong>Reporting authority</strong>{" "}
                    {data?.reportingAuthority?.name} |{" "}
                    {data?.reportingAuthority?.employeeId}
                  </h1>
                  <h1 className="flex justify-start items-center gap-2">
                    <strong>Email</strong> {data?.email}
                  </h1>
                </div>
                <div className="flex flex-col justify-start items-start w-1/2">
                  <h1>
                    <strong>Designation</strong> {data?.designation}
                  </h1>
                  <h1>
                    <strong>Location</strong> {data.officeLocation} |{" "}
                    {data?.pincode}
                  </h1>
                  <h1 className="flex justify-start items-center gap-2">
                    <strong>Contact number</strong> {data?.phoneNumber}
                  </h1>
                  <h1>
                    <strong>Department</strong> {data?.department}
                  </h1>
                  <h1 className="text-center font-semibold">
                    {data?.isActive === true ? (
                      <p className="text-green-600 bg-green-200 text-center px-2 py-1">
                        ONLINE
                      </p>
                    ) : (
                      <p className="text-red-600 bg-red-200 text-center">
                        OFFLINE
                      </p>
                    )}
                  </h1>
                </div>
              </Link>
            ))
          : "No Data Available"}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Search Employees</h2>

      {/* Search Bar */}
      <div className="flex justify-center items-center gap-3">
        <InputBox
          Placeholder="Enter employee name, contact number, email, pincode to search .."
          Value={query}
          onChange={(e) => setQuery(e.target.value)}
          keyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button label="Search" onClick={handleSearch} />
      </div>

      {/* Loading */}
      {loading && <p className="mt-4 text-gray-500">Searching employees...</p>}
      <h2 className="font-bold mb-6">Search results</h2>
      {/* <ResultDataTableUI TableData={results} /> */}
      <Cards CardData={results} />
    </div>
  );
};

export default EmployeeSearch;

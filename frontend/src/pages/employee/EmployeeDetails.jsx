import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import { formatDateTimeString } from "../../utils/mongoDB_DateTime";
import LoadingUI from "../../components/LoadingUI";

const EmployeeDetails = ({ startLoading, stopLoading }) => {
  const { employeeId } = useParams();
  const [emp, setEmp] = useState();
  const [reportingAuth, setReportingAuth] = useState();
  const [createdBy, setCreatedBy] = useState();

  const getEmployee = async () => {
    startLoading();
    try {
      const response = await FetchData(`employee/${employeeId}`, "get");
      setEmp(response.data.data);
      setCreatedBy(response.data.data.createdById);
      setReportingAuth(response.data.data.reportingAuthority);
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    getEmployee();
  }, []);

  const formattedDate = formatDateTimeString(emp?.createdAt);

  const personalDetails = [
    { title: "Name", value: emp?.name },
    { title: "Contact Number", value: emp?.phoneNumber },
    { title: "Designation", value: emp?.designation },
    { title: "Email ID", value: emp?.email },
  ];
  const companyDetails = [
    { title: "Office Location", value: emp?.officeLocation },
    { title: "Office Pincode", value: emp?.pincode },
    { title: "Department", value: emp?.department },
    { title: "Reporting Authority ID", value: reportingAuth?.employeeId },
    { title: "Reporting Authority Name", value: reportingAuth?.name },
    { title: "Reporting Authority Contact", value: reportingAuth?.phoneNumber },
    {
      title: "Reporting Authority Designation",
      value: reportingAuth?.designation,
    },
    { title: "Reporting Authority Email Id", value: reportingAuth?.email },
  ];
  const registeringDetails = [
    { title: "Registered on MMDDYY", value: formattedDate },
    { title: "Created by", value: emp?.createdBy },
    { title: "name", value: createdBy?.name, role: emp?.createdBy },
    { title: "email", value: createdBy?.email, role: emp?.createdBy },
    {
      title: "contact number",
      value: createdBy?.phoneNumber,
      role: emp?.createdBy,
    },
  ];

  const Breads = ({ title, value, role }) => {
    return (
      <h1 className="flex flex-col justify-start items-start md:gap-2 m-2 text-nowrap bg-neutral-100 px-5 py-2 rounded-xl hover:shadow-lg duration-300 ease-in-out">
        <strong>
          {role} {title}
        </strong>{" "}
        <p>{value}</p>
      </h1>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{emp?.employeeId}</h2>

      <div className="grid md:grid-cols-2 grid-cols-1 md:p-5 md:shadow-xl rounded-xl md:my-10 my-5">
        {personalDetails?.map((data) => (
          <Breads title={data.title} value={data?.value} key={data.index} />
        ))}
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 md:p-5 md:shadow-xl rounded-xl md:my-10 my-5">
        {companyDetails?.map((data) => (
          <Breads title={data.title} value={data?.value} key={data.index} />
        ))}
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 md:p-5 md:shadow-xl rounded-xl md:my-10 my-5">
        {registeringDetails?.map((data) => (
          <Breads
            title={data.title}
            value={data?.value}
            key={data.index}
            role={data.role}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingUI(EmployeeDetails);

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import { formatDateTimeString } from "../../utils/mongoDB_DateTime";
import LoadingUI from "../../components/LoadingUI";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { useSelector } from "react-redux";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const EmployeeDetails = ({ startLoading, stopLoading }) => {
  const { employeeId } = useParams();
  const [emp, setEmp] = useState();
  const [reportingAuth, setReportingAuth] = useState();
  const [createdBy, setCreatedBy] = useState();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const formRef = useRef();
  const [auth, setAuth] = useState(false);

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

  const inactiveEmployee = async () => {
    startLoading();
    try {
      if (user.role === "Admin") {
        const response = await FetchData(
          `admin/mark-employee-inactive/${employeeId}`,
          "post"
        );
        alert(response.data.message);
      } else {
        const response = await FetchData(
          `head/mark-employee-inactive/${employeeId}`,
          "post"
        );
        alert(response.data.message);
      }
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/head/dashboard");
      }
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  const activeEmployee = async () => {
    startLoading();
    try {
      if (user.role === "Admin") {
        const response = await FetchData(
          `admin/mark-employee-active/${employeeId}`,
          "post"
        );
        alert(response.data.message);
      } else {
        const response = await FetchData(
          `head/mark-employee-active/${employeeId}`,
          "post"
        );
        alert(response.data.message);
      }
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/head/dashboard");
      }
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  const employeeAuth = async () => {
    startLoading();
    try {
      const formdata = new FormData(formRef.current);
      // for (let pair of formdata.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }
      const response = await FetchData(
        "employee/authentication",
        "post",
        formdata
      );
      console.log(response);
      if (response.data.statusCode === 200) {
        setAuth(true);
      }
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

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
    { title: "Access Key", value: emp?.accessPin },
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

  const FullDetails = () => {
    return (
      <div className="p-6">
        {user ? (
          ""
        ) : (
          <h1 className="text-center text-red-600">
            ** Do not refresh page, refreshing may loose you data and we will be
            re-authenticating you.
          </h1>
        )}
        <div className="flex justify-center items-center gap-5">
          <h2 className="text-2xl font-bold">{emp?.employeeId}</h2>
          <h1 className="text-center font-semibold w-fit">
            {emp?.isActive === true ? (
              <p className="text-green-600 bg-green-200 text-center px-2 py-1">
                ACTIVE
              </p>
            ) : (
              <p className="text-red-600 bg-red-200 text-center">INACTIVE</p>
            )}
          </h1>
          {user ? (
            <div>
              {emp?.isActive === true ? (
                <Button
                  label={"Mark as Inactive"}
                  onClick={() => inactiveEmployee()}
                />
              ) : (
                <Button
                  label={"Mark as Active"}
                  onClick={() => activeEmployee()}
                />
              )}
            </div>
          ) : (
            ""
          )}
          {/* <Button label={"Mark as Inactive"} onClick={() => inactiveEmployee()} /> */}
        </div>

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

  const AuthForm = () => {
    return (
      <div className="w-1/2 flex flex-col justify-center items-center">
        <form ref={formRef} onSubmit={employeeAuth}>
          <InputBox
            Name="employeeId"
            Placeholder="Eg: EM..."
            LabelName="Your employee id"
          />
          <InputBox
            Name="accessPin"
            Placeholder="Access key"
            LabelName="Your Access key"
            Type="password"
          />
          <div className="gap-2 flex justify-center items-center">
            <Button label={"Cancel"} onClick={() => navigate("/")} />
            <Button label={"Confirm"} type="submit" />
          </div>
        </form>
      </div>
    );
  };

  return user ? (
    <FullDetails />
  ) : (
    <div>
      {auth === false ? (
        <div className="w-full justify-center items-center flex">
          <AuthForm />
        </div>
      ) : (
        <FullDetails />
      )}
    </div>
  );
};

export default LoadingUI(EmployeeDetails);

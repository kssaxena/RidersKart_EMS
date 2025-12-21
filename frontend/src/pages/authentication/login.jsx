import { useState } from "react";
import AdminLogin from "../admin/AdminLogin";
import HeadLogin from "../head/HeadLogin";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <div className=" flex justify-center items-center px-4">
      <div className="shadow-xl rounded-2xl w-full max-w-md p-6">
        {/* Toggle Buttons */}
        <div className="flex mb-6 rounded-xl overflow-hidden">
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              isAdmin ? "bg-[#DF3F33] text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              !isAdmin ? "bg-[#DF3F33] text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Head Login
          </button>
        </div>

        {/* Render Selected Login */}
        <div>{isAdmin ? <AdminLogin /> : <HeadLogin />}</div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import AdminLogin from "../admin/AdminLogin";
import HeadLogin from "../head/HeadLogin";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className=" flex justify-center items-center px-4">
      {!user ? (
        <div className="shadow-xl rounded-2xl w-full max-w-md p-6">
          {/* Toggle Buttons */}
          <div className="flex mb-6 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                isAdmin
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Admin Login
            </button>
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                !isAdmin
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Head Login
            </button>
          </div>

          {/* Render Selected Login */}
          <div>{isAdmin ? <AdminLogin /> : <HeadLogin />}</div>
        </div>
      ) : (
        <div className="shadow-xl rounded-2xl w-full max-w-md p-6">
          Toggle Buttons
          {user?.role === "ADMIN" ? (
            <Button
              label={"Go to dashboard"}
              onClick={() => navigate("/admin/dashboard")}
            />
          ) : (
            <Button
              label={"Go to dashboard"}
              onClick={() => navigate("/head/dashboard")}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Login;

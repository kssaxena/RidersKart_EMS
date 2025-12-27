import { useSelector } from "react-redux";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  // console.log(user);
  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={logo} className="w-10" />
          Riders Kart
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to={`/${user?.role}/dashboard`}
              className="bg-[#DF3F33] px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out text-white "
            >
              {window.location.pathname === "/"
                ? "Go to Dashboard"
                : `Welcome ${user.name}`}
              ,{" "}
              <span className="bg-green-200 font-bold text-green-700 text-xs p-1 ">
                {user.role}
              </span>{" "}
            </Link>
          ) : (
            <Button label="Login" onClick={() => navigate("/login")} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

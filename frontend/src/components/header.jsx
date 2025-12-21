import { useSelector } from "react-redux";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
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
            <span className="text-gray-700">
              Welcome, {user.name}{" "}
              <span className="bg-green-200 font-bold text-green-700 text-xs p-1 ">
                {user.role}
              </span>{" "}
            </span>
          ) : (
            <Button label="Login" onClick={() => navigate("/login")} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

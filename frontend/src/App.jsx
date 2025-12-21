import { Route, Routes } from "react-router-dom";
import Header from "./components/header";

/* Public Pages */
import Hero from "./pages/hero/hero";

/* Admin Pages */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HeadRegistrationForm from "./pages/admin/HeadRegistrationForm";
import EmployeeRegistrationForm from "./pages/admin/EmployeeRegistrationForm";

/* Head Pages */
import HeadLogin from "./pages/head/HeadLogin";
import HeadDashboard from "./pages/head/HeadDashboard";

/* Public Employee Pages */
import EmployeeSearch from "./pages/employee/EmployeeSearch";
import EmployeeDetails from "./pages/employee/EmployeeDetails";
import Login from "./pages/authentication/login";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser, stopAuthLoading } from "./redux/slices/authSlice";
import { FetchData } from "./utils/FetchFromApi";
import { useEffect } from "react";

/* Route Guards (you will add later) */
// import { AdminRoute, HeadRoute } from "./utils/ProtectedRoutes";

function App() {
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  // console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    const RefreshToken = localStorage.getItem("RefreshToken");
    const role = localStorage.getItem("role");

    if (!RefreshToken || !role) return;

    async function reLogin() {
      try {
        let endpoint = "";

        if (role === "ADMIN") endpoint = "admin/refresh-tokens";
        else if (role === "HEAD") endpoint = "head/refresh-tokens";

        const res = await FetchData(endpoint, "post", {
          RefreshToken,
        });

        localStorage.setItem("AccessToken", res.data.data.tokens.AccessToken);
        localStorage.setItem("RefreshToken", res.data.data.tokens.RefreshToken);

        dispatch(
          addUser({
            user: res.data.data.user,
            role,
          })
        );
      } catch (error) {
        console.log("Relogin failed:", error);
        localStorage.clear();
        dispatch(clearUser());
      } finally {
        dispatch(stopAuthLoading()); // 👈 CRITICAL
      }
    }

    reLogin();
  }, []);

  return (
    <div className="font-montserrat">
      <Header />

      {/* Top padding because header is fixed */}
      <div className="pt-20">
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employees" element={<EmployeeSearch />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />

          {/* ================= ADMIN ================= */}
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/register-head"
            element={<HeadRegistrationForm />}
          />
          <Route
            path="/admin/register-employee"
            element={<EmployeeRegistrationForm />}
          />

          {/* ================= HEAD ================= */}
          {/* <Route path="/head/login" element={<HeadLogin />} /> */}
          <Route path="/head/dashboard" element={<HeadDashboard />} />
          <Route
            path="/head/register-employee"
            element={<EmployeeRegistrationForm />}
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Hero />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

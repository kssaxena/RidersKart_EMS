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

/* Route Guards (you will add later) */
// import { AdminRoute, HeadRoute } from "./utils/ProtectedRoutes";

function App() {
  return (
    <>
      <Header />

      {/* Top padding because header is fixed */}
      <div className="pt-20">
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Hero />} />
          <Route path="/employees" element={<EmployeeSearch />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />

          {/* ================= ADMIN ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />
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
          <Route path="/head/login" element={<HeadLogin />} />
          <Route path="/head/dashboard" element={<HeadDashboard />} />
          <Route
            path="/head/register-employee"
            element={<EmployeeRegistrationForm />}
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Hero />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

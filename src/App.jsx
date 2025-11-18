import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  useNavigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import LoginPageSkeleton from "./SkeletonLoaders/LoginPageSkeleton";
import DashboardPageSkeleton from "./SkeletonLoaders/DashboardPageSkeleton";
import WelcomePageSkeleton from "./SkeletonLoaders/WelcomePageSkeleton";
import AdminPageSkeleton from "./SkeletonLoaders/AdminPageSkeleton";

const LoginPage = lazy(() => import("./components/login-details/LoginPage"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const WelcomePage = lazy(() =>
  import("./components/login-details/WelcomePage")
);
const AdminPage = lazy(() => import("./components/login-details/AdminPage"));

function App() {
  const navigate = useNavigate();

  useEffect(() => navigate("/login"), []);
  // useEffect(() => navigate('/admin') , [])
  console.log("Is it working fine ");

  const [role, setRole] = useState();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<LoginPageSkeleton />}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminPageSkeleton />}>
            <AdminPage role={role} setRole={setRole} />
          </Suspense>
        }
      />
      <Route
        path="/welcome"
        element={
          <Suspense fallback={<WelcomePageSkeleton />}>
            <WelcomePage />
          </Suspense>
        }
      />
      <Route
        path="/*"
        element={
          <Suspense fallback={<DashboardPageSkeleton />}>
            <Dashboard role={role} setRole={setRole} />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;

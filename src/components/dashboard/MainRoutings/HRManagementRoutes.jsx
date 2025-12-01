import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Fallback loaders
import NavbarSkeleton from "@/SkeletonLoaders/NavbarSkeleton";
import AnalyticsPageSkeleton from "@/SkeletonLoaders/AnalyticsPageSkeleton";
import PayrollDashboard from "../HRManagement/Payroll/PayrollDashboard";
import PayrollRouting from "../HRManagement/Payroll/PayrollRouting";

// Lazy-loaded route components
const HRAnalytics = lazy(() => import("../DashboardCharts/pages/HRAnalytics"));
const AttendanceForm = lazy(() =>
  import("../Procurement/AttendanceManagement/AttendanceForm")
);
const LeaveManagementRoute = lazy(() =>
  import("../Procurement/LeaveManagement/LeaveManagementRoute")
);
const TaskRouting = lazy(() =>
  import("../Procurement/TaskManagement/TaskRouting")
);
const ApplicationRouting = lazy(() =>
  import("../Procurement/ApplicationManagement/ApplicationRouting")
);
const EmployeesRoute = lazy(() =>
  import("../Procurement/Employees/EmployeesRoute")
);
const Routing = lazy(() => import("../Production/Shifts/Routing"));

function HRManagementRoutes({ department, role }) {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={<AnalyticsPageSkeleton />}>
              <HRAnalytics />
            </Suspense>
          }
        />
        <Route
          path="/attendance/*"
          element={
            <Suspense fallback={<NavbarSkeleton />}>
              <AttendanceForm />
            </Suspense>
          }
        />
        <Route
          path="/leave-management/*"
          element={
            <Suspense fallback={<NavbarSkeleton />}>
              <LeaveManagementRoute />
            </Suspense>
          }
        />
        <Route
          path="/tasks/*"
          element={
            <Suspense fallback={<NavbarSkeleton />}>
              <TaskRouting />
            </Suspense>
          }
        />
        <Route
          path="/applications/*"
          element={
            <Suspense fallback={<NavbarSkeleton />}>
              <ApplicationRouting />
            </Suspense>
          }
        />
        <Route
          path="/employees/*"
          element={
            <Suspense fallback={<NavbarSkeleton />}>
              <EmployeesRoute />
            </Suspense>
          }
        />
        <Route
          path="/shifts/*"
          element={
            <Suspense fallback={<NavbarSkeleton />}>
              <Routing />
            </Suspense>
          }
        />
        <Route path="/payroll/*" element={<PayrollRouting />} />
      </Routes>
    </Suspense>
  );
}

export default HRManagementRoutes;

import React, { lazy, Suspense } from "react";
import styles from "./AttendanceForm.module.css";
import PresentList from "./PresentList";
import ApprovedForm from "./ApprovedForm";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import HomeTable from "./HomeTable";
import SquareTableSkeleton from "@/SkeletonLoaders/SquareTableSkeleton";

const PresentTable = lazy(() => import("./PresentTable"));
const AbsentTable = lazy(() => import("./AbsentTable"));

function AttendanceHomeTable() {
  const navigate = useNavigate();
  return (
    <>
      <div className="m-0 p-0 row">
        <div className="col">
          <button
            className={`homebtn`}
            onClick={() => navigate("/attendance/requests")}
          >
            Requests
          </button>
          <button
            className={`homebtn`}
            onClick={() => navigate("/attendance/approvals")}
          >
            Approvals
          </button>
          <button
            className={`homebtn`}
            onClick={() => navigate("/attendance/leave-settings")}
          >
            Attendance Settings
          </button>
          <button
            className={`homebtn`}
            onClick={() => navigate("/attendance/weekoff-settings")}
          >
            Weekoff Settings
          </button>
          <button
            className={`homebtn`}
            onClick={() => navigate("/attendance/ph-settings")}
          >
            PH Settings
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <label>From:</label>
        <input type="date" className={styles.input} />
        <label>To:</label>
        <input type="date" className={styles.input} />
        <button className={styles.submitButton}>Submit</button>
      </div>
      <PresentList />
      <div className="d-flex justify-content-center">
        <Routes>
          <Route index element={<HomeTable />} />
          <Route
            path="/present"
            element={
              <Suspense fallback={<SquareTableSkeleton />}>
                <PresentTable />
              </Suspense>
            }
          />
          <Route
            path="/absent"
            element={
              <Suspense fallback={<SquareTableSkeleton />}>
                <AbsentTable />
              </Suspense>
            }
          />
        </Routes>
        <Outlet />
      </div>
    </>
  );
}

export default AttendanceHomeTable;

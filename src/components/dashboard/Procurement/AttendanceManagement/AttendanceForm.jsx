import { Route, Routes, useNavigate } from "react-router-dom";
import AttendanceHeader from "./AttendanceHeader";
import PHSettings from "./PHSettings";
import AttendanceHomeTable from "./AttendanceHomeTable";
import { lazy, Suspense } from "react";
import SquareTableSkeleton from "@/SkeletonLoaders/SquareTableSkeleton";
import BoxSkeleton from "@/SkeletonLoaders/BoxSkeleton";

const Requests = lazy(() => import("./Requests"));
const Approvals = lazy(() => import("./Approvals"));
const WeekoffSettings = lazy(() => import("./WeekoffSettings"));
const LeaveSettings = lazy(() => import("./LeaveSettings"));

const AttendanceForm = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/*" element={<AttendanceHomeTable navigate={navigate} />} />
      <Route
        path="/requests"
        element={
          <Suspense fallback={<SquareTableSkeleton />}>
            <Requests navigate={navigate} />
          </Suspense>
        }
      />
      <Route
        path="/approvals"
        element={
          <Suspense fallback={<SquareTableSkeleton />}>
            <Approvals navigate={navigate} />
          </Suspense>
        }
      />
      {/* <Route path='/leave-settings' element={
                    <Suspense fallback={<BoxSkeleton/>}>
                        <LeaveSettings />
                    </Suspense>
                } /> */}
      <Route
        path="/leave-settings"
        element={<LeaveSettings navigate={navigate} />}
      />
      <Route
        path="/weekoff-settings"
        element={
          <Suspense fallback={<SquareTableSkeleton />}>
            <WeekoffSettings navigate={navigate} />
          </Suspense>
        }
      />
      <Route path="/ph-settings" element={<PHSettings navigate={navigate} />} />
    </Routes>
  );
};

export default AttendanceForm;

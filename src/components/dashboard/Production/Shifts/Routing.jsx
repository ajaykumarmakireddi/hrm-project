import React, { lazy, Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ShiftHeader from "./ShiftHeader";
import SquareTableSkeleton from "@/SkeletonLoaders/SquareTableSkeleton";
import ShiftsShedule from "./ShiftsShedule";
import ShiftSettings from "./ShiftSettings";

const ShiftHomePage = lazy(() => import("./ShiftHomePage"));
const ManageShifts = lazy(() => import("./ManageShifts"));

function Routing() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <ShiftHomePage navigate={navigate} />
            </Suspense>
          }
        />
        <Route
          path="/shedule"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <ShiftsShedule navigate={navigate} />
            </Suspense>
          }
        />
        <Route
          path="/manage"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <ManageShifts navigate={navigate} />
            </Suspense>
          }
        />
         <Route
          path="/shift-settings"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <ShiftSettings navigate={navigate} />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default Routing;

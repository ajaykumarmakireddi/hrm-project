import BoxSkeleton from "@/SkeletonLoaders/BoxSkeleton";
import SquareTableSkeleton from "@/SkeletonLoaders/SquareTableSkeleton";
import React, { Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PayrollHome from "./PayrollHome";
import PayrollReimbursements from "./PayrollReimbursements";

function PayrollRouting() {
  const navigate = useNavigate();
  return (
    <>
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={<BoxSkeleton />}>
              <PayrollHome navigate={navigate} />
            </Suspense>
          }
        />

        <Route
          path="/reimbursement"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <PayrollReimbursements navigate={navigate}/>
            </Suspense>
          }
        />
        <Route
          path="/loan-advances"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <p>Loan advances</p>
            </Suspense>
          }
        />
        <Route
          path="/bonus-pay"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <p>Bonus Pay</p>
            </Suspense>
          }
        />

        <Route
          path="/payroll-runengine"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <p>Payroll run engine</p>
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default PayrollRouting;

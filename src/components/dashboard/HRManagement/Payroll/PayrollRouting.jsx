import BoxSkeleton from "@/SkeletonLoaders/BoxSkeleton";
import SquareTableSkeleton from "@/SkeletonLoaders/SquareTableSkeleton";
import React, { Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PayrollHome from "./PayrollHome";
import PayrollReimbursements from "./PayrollReimbursements";
import BonusModule from "./BonusModule";
import PayrollLoansAdvances from "./PayrollLoansAdvances";
import PayrollRunEngine from "./PayrollRunEngine";
import PayrollEmployeeAssignment from "./PayrollEmployeeAssignment";
import SalaryStructures from "./SalaryStructures";
import PayrollSalaryComponents from "./PayrollSalaryComponents";
import PayCycles from "./PayCycles";


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
              <PayrollReimbursements navigate={navigate} />
            </Suspense>
          }
        />
        <Route
          path="/loan-advances"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <PayrollLoansAdvances navigate={navigate} />
            </Suspense>
          }
        />
        <Route
          path="/bonus-pay"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <BonusModule navigate={navigate} />
            </Suspense>
          }
        />

        <Route
          path="/payroll-engine"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <PayrollRunEngine navigate={navigate} />
            </Suspense>
          }
        />
        <Route path="/salary-assignment"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <PayrollEmployeeAssignment navigate={navigate} />
            </Suspense>
          } />
        <Route path="/salary-structure"
          element={
            <Suspense fallback={<SquareTableSkeleton />}>
              <SalaryStructures navigate={navigate} />
            </Suspense>
          } />
        <Route path="/salary-components"
          element={
            <Suspense fallback={<BoxSkeleton />}>
              <PayrollSalaryComponents navigate={navigate} />
            </Suspense>
          }
        />
        <Route path="/pay-cycles"
          element={
            <Suspense fallback={<BoxSkeleton />}>
              <PayCycles navigate={navigate} />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default PayrollRouting;

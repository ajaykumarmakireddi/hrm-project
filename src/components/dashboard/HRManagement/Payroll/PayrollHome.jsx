import React from "react";
import PayrollDashboard from "./PayrollDashboard";

function PayrollHome({ navigate }) {
  return (
    <>
      <div className="row m-0 p-0">
        <div className="col">
          <button
            className={`homebtn`}
            onClick={() => navigate("/payroll/reimbursement")}
          >
            Reimbursement
          </button>
          <button
            className={`homebtn`}
            onClick={() => navigate("/payroll/loan-advances")}
          >
            Loan Advances
          </button>
          <button
            className={`homebtn`}
            onClick={() => navigate("/payroll/bonus-pay")}
          >
            Bonus Pay
          </button>
          <button
            className={`homebtn`}
            onClick={() => navigate("/payroll/payroll-engine")}
          >
            Payroll Engine
          </button>
          <button className={`homebtn`} onClick={() => navigate("/payroll/salary-assignment")}>
            Salary Assignment
          </button>
          <button className={`homebtn`} onClick={() => navigate("/payroll/salary-structure")}>
            Salary Structure
          </button>
        </div>
      </div>

      <PayrollDashboard />
    </>
  );
}

export default PayrollHome;

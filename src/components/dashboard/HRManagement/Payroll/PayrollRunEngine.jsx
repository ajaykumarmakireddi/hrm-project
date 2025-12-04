// src/pages/PayrollRunEngine.jsx
import React, { useEffect, useState } from "react";
import styles from "./PayrollRunEngine.module.css";
import StepApprovalWorkflow from "./StepApprovalWorkFlow";

/* ---------------- Mock API (unchanged) ---------------- */
/* (same mock and api object as your original component) */
const mock = {
  runs: [
    {
      id: "PR-2025-11",
      period: "01 Nov 2025 - 30 Nov 2025",
      payCycle: "Monthly",
      employees: 125,
      totalCost: 1350000,
      status: "Completed",
      finalizedOn: "2025-11-30T18:00:00Z",
    },
    {
      id: "PR-2025-10",
      period: "01 Oct 2025 - 31 Oct 2025",
      payCycle: "Monthly",
      employees: 123,
      totalCost: 1325000,
      status: "Completed",
      finalizedOn: "2025-10-31T18:00:00Z",
    },
  ],
  employeesForRun: new Array(125).fill(0).map((_, i) => ({
    id: `E${1000 + i}`,
    name: `Employee ${i + 1}`,
    department: ["Sales", "Eng", "HR", "Ops"][i % 4],
    salaryAssigned: i % 20 === 0 ? false : true,
    bankDetails: i % 33 === 0 ? false : true,
    attendancePresentDays: 20 - (i % 4),
    salaryComponents: {
      basic: 30000 + (i % 5) * 1000,
      hra: 12000,
      allowances: 3000 + (i % 3) * 500,
    },
    statutory: {
      PF: i % 10 === 0 ? null : `PF-${i + 100}`,
      ESI: i % 12 === 0 ? null : `ESI-${i + 200}`,
    },
  })),
};

function delay(ms = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

const api = {
  async fetchDashboardSummary({ period }) {
    await delay(150);
    return {
      payrollStatus: "Not started",
      employees: mock.employeesForRun.length,
      pendingApprovals: 2,
      estimatedCost: 1350000,
      varianceFromPrev: 0.02,
    };
  },

  async fetchRunHistory() {
    await delay(120);
    return mock.runs.slice();
  },

  async validatePrePayroll({ filters }) {
    await delay(300);
    const issues = [];
    const sample = mock.employeesForRun.slice(0, 40);
    sample.forEach((e, i) => {
      if (!e.salaryAssigned)
        issues.push({
          employee: e.name,
          issue: "Missing salary assignment",
          severity: "Error",
          id: `V-${i}`,
        });
      if (!e.bankDetails)
        issues.push({
          employee: e.name,
          issue: "Missing bank details",
          severity: "Warning",
          id: `V-B-${i}`,
        });
      if (!e.statutory.PF)
        issues.push({
          employee: e.name,
          issue: "Missing PF ID",
          severity: "Error",
          id: `V-PF-${i}`,
        });
    });
    return issues;
  },

  async fetchAttendance({ payCycle }) {
    await delay(200);
    return {
      totalWorkingDays: 22,
      daysPresent: 20,
      daysAbsent: 1,
      leavesApproved: 1,
      details: mock.employeesForRun.slice(0, 50).map((e) => ({
        id: e.id,
        name: e.name,
        present: e.attendancePresentDays,
        leaves: 2,
        overtimeHours: (Math.random() * 6).toFixed(1),
      })),
    };
  },

  async calculateEarnings() {
    await delay(220);
    return mock.employeesForRun.slice(0, 50).map((e) => ({
      id: e.id,
      name: e.name,
      components: [
        { name: "Basic", method: "Fixed", value: e.salaryComponents.basic },
        { name: "HRA", method: "%", value: e.salaryComponents.hra },
        {
          name: "Allowances",
          method: "Fixed",
          value: e.salaryComponents.allowances,
        },
      ],
      gross:
        e.salaryComponents.basic +
        e.salaryComponents.hra +
        e.salaryComponents.allowances,
    }));
  },

  async calculateDeductions() {
    await delay(200);
    return mock.employeesForRun.slice(0, 50).map((e) => ({
      id: e.id,
      name: e.name,
      deductions: [
        {
          name: "Provident Fund",
          method: "%",
          value: Math.round(e.salaryComponents.basic * 0.12),
        },
        {
          name: "Tax",
          method: "Slab",
          value: Math.round(e.salaryComponents.basic * 0.1),
        },
      ],
      totalDeductions: Math.round(e.salaryComponents.basic * 0.22),
    }));
  },

  async calculateTax() {
    await delay(200);
    return mock.employeesForRun.slice(0, 50).map((e) => ({
      id: e.id,
      name: e.name,
      taxable: Math.max(
        0,
        e.salaryComponents.basic + e.salaryComponents.hra - 50000
      ),
      taxAmount: Math.round(
        (e.salaryComponents.basic + e.salaryComponents.hra) * 0.1
      ),
    }));
  },

  async calcEmployerContrib() {
    await delay(150);
    return [
      { name: "PF Employer", value: 50000 },
      { name: "ESI Employer", value: 12000 },
    ];
  },

  async finalizeRun({ runId }) {
    await delay(400);
    const newRun = {
      id: `PR-${new Date().toISOString().slice(0, 10)}`,
      period: "Custom",
      payCycle: "Monthly",
      employees: mock.employeesForRun.length,
      totalCost: 1370000,
      status: "Completed",
      finalizedOn: new Date().toISOString(),
    };
    mock.runs.unshift(newRun);
    return { ok: true, run: newRun };
  },

  async fetchRunLedger({ runId }) {
    await delay(200);
    return [
      { employee: "Employee 1", gross: 40000, deductions: 8000, net: 32000 },
      { employee: "Employee 2", gross: 38000, deductions: 7600, net: 30400 },
    ];
  },

  async exportSummaryCSV({ runId }) {
    await delay(120);
    const csv =
      "Employee,Gross,Deductions,Net\nEmployee 1,40000,8000,32000\nEmployee 2,38000,7600,30400\n";
    return { ok: true, csv };
  },
};

/* ---------------- Helper UI pieces (adapted to your summaryCard style) ---------------- */
const Widget = ({ title, value, sub }) => (
  <div className={styles.summaryCard}>
    <div className={styles.cardTitle}>{title}</div>
    <div className={styles.cardValue}>{value}</div>
    {sub && <div className={styles.cardSub}>{sub}</div>}
  </div>
);

/* Card-style Step component (Option A) */
const StepA = ({ idx, title, active, done }) => (
  <div
    className={`${styles.stepRowA} ${active ? styles.stepActiveA : ""} ${
      done ? styles.stepDoneA : ""
    }`}
  >
    <div className={styles.stepIdxA}>{idx}</div>
    <div className={styles.stepTitleA}>{title}</div>
  </div>
);

/* Validation row unchanged in logic but adapted to CSS */
const ValidationRow = ({ v, onFix }) => (
  <tr>
    <td>{v.id}</td>
    <td>{v.employee}</td>
    <td>{v.issue}</td>
    <td className={v.severity === "Error" ? styles.err : styles.warn}>
      {v.severity}
    </td>
    <td>
      <button className={"table-pending-btn"} onClick={() => onFix(v)}>
        Fix
      </button>
    </td>
  </tr>
);

/* ---------------- Main Component (structure updated to use your styles) ---------------- */
export default function PayrollRunEngine({ navigate }) {
  // dashboard
  const [summary, setSummary] = useState(null);
  const [runs, setRuns] = useState([]);
  const [filters, setFilters] = useState({
    period: "Nov 2025",
    department: "",
    location: "",
    currency: "INR",
  });

  // stepper state
  const steps = [
    "Select Pay Cycle",
    "Pre-payroll Validation",
    "Attendance & Leave Processing",
    "Earnings Calculation",
    "Deductions Calculation",
    "Tax Calculation",
    "Employer Contributions",
    "Pre-Finalization Adjustments",
    "Payroll Summary Review",
    "Approval Workflow",
    "Finalization",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [validationIssues, setValidationIssues] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [employerContrib, setEmployerContrib] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loadingStep, setLoadingStep] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await api.fetchDashboardSummary({ period: filters.period });
      setSummary(s);
      const rh = await api.fetchRunHistory();
      setRuns(rh);
    })();
  }, [filters.period]);

  /* Step handlers (unchanged) */
  async function runValidation() {
    setLoadingStep(true);
    const issues = await api.validatePrePayroll({ filters });
    setValidationIssues(issues);
    setCompleted((c) => ({ ...c, 1: true }));
    setLoadingStep(false);
    setToast(`${issues.length} validation issues found`);
    setTimeout(() => setToast(null), 1800);
  }

  async function runAttendance() {
    setLoadingStep(true);
    const att = await api.fetchAttendance({ payCycle: filters.period });
    setAttendance(att);
    setCompleted((c) => ({ ...c, 2: true }));
    setLoadingStep(false);
    setToast("Attendance processed");
    setTimeout(() => setToast(null), 1500);
  }

  async function runEarnings() {
    setLoadingStep(true);
    const e = await api.calculateEarnings();
    setEarnings(e);
    setCompleted((c) => ({ ...c, 3: true }));
    setLoadingStep(false);
    setToast("Earnings calculated");
    setTimeout(() => setToast(null), 1500);
  }

  async function runDeductions() {
    setLoadingStep(true);
    const d = await api.calculateDeductions();
    setDeductions(d);
    setCompleted((c) => ({ ...c, 4: true }));
    setLoadingStep(false);
    setToast("Deductions calculated");
    setTimeout(() => setToast(null), 1500);
  }

  async function runTax() {
    setLoadingStep(true);
    const t = await api.calculateTax();
    setTaxes(t);
    setCompleted((c) => ({ ...c, 5: true }));
    setLoadingStep(false);
    setToast("Taxes calculated");
    setTimeout(() => setToast(null), 1500);
  }

  async function runEmployerContrib() {
    setLoadingStep(true);
    const ec = await api.calcEmployerContrib();
    setEmployerContrib(ec);
    setCompleted((c) => ({ ...c, 6: true }));
    setLoadingStep(false);
    setToast("Employer contributions computed");
    setTimeout(() => setToast(null), 1500);
  }

  async function preFinalizeAdjustments() {
    setLoadingStep(true);
    await delay(300);
    setCompleted((c) => ({ ...c, 7: true }));
    setLoadingStep(false);
    setToast("Pre-finalization adjustments applied");
    setTimeout(() => setToast(null), 1500);
  }

  async function generateSummary() {
    setLoadingStep(true);
    const ld = await api.fetchRunLedger({ runId: "preview" });
    setLedger(ld);
    setCompleted((c) => ({ ...c, 8: true }));
    setLoadingStep(false);
    setToast("Payroll summary ready");
    setTimeout(() => setToast(null), 1500);
  }

  async function approvalWorkflow() {
    setLoadingStep(true);
    await delay(250);
    setCompleted((c) => ({ ...c, 9: true }));
    setLoadingStep(false);
    setToast("Approval workflow configured (simulate)");
    setTimeout(() => setToast(null), 1500);
  }

  async function finalizePayroll() {
    setLoadingStep(true);
    const res = await api.finalizeRun({ runId: "preview" });
    setLoadingStep(false);
    if (res.ok) {
      setToast("Payroll finalized: payslips generated");
      const rh = await api.fetchRunHistory();
      setRuns(rh);
      setCompleted((c) => ({ ...c, 10: true }));
    } else {
      setToast("Finalization failed");
    }
    setTimeout(() => setToast(null), 2000);
  }

  async function onStepAction(index) {
    setActiveStep(index);
    switch (index) {
      case 1:
        return runValidation();
      case 2:
        return runAttendance();
      case 3:
        return runEarnings();
      case 4:
        return runDeductions();
      case 5:
        return runTax();
      case 6:
        return runEmployerContrib();
      case 7:
        return preFinalizeAdjustments();
      case 8:
        return generateSummary();
      case 9:
        return approvalWorkflow();
      case 10:
        return finalizePayroll();
      default:
        return;
    }
  }

  async function exportSummary(runId) {
    const resp = await api.exportSummaryCSV({ runId });
    if (resp.ok) {
      const blob = new Blob([resp.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll_summary_${runId || "preview"}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setToast("Exported CSV");
      setTimeout(() => setToast(null), 1500);
    }
  }

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/payroll")}>Payroll</span>{" "}
        <i className="bi bi-chevron-right"></i> Payroll Run Engine
      </p>

      <div className={styles.page}>
        <div className={styles.header}>
          <button
            className={"homebtn"}
            onClick={() => {
              setActiveStep(0);
              setCompleted({});
              setToast("Ready to start payroll run");
              setTimeout(() => setToast(null), 1500);
            }}
          >
            Start New Payroll Run
          </button>
          <div className={styles.headerRight}>
            <label className={styles.filter}>
              Pay Period
              <select
                value={filters.period}
                onChange={(e) =>
                  setFilters({ ...filters, period: e.target.value })
                }
              >
                <option>Nov 2025</option>
                <option>Oct 2025</option>
                <option>Sep 2025</option>
              </select>
            </label>

            <label className={styles.filter}>
              Currency
              <select
                value={filters.currency}
                onChange={(e) =>
                  setFilters({ ...filters, currency: e.target.value })
                }
              >
                <option>INR</option>
                <option>USD</option>
              </select>
            </label>
          </div>
        </div>

        <div className={styles.summaryRow}>
          <Widget
            title="Payroll Status"
            value={summary?.payrollStatus || "—"}
          />
          <Widget title="Total Employees" value={summary?.employees ?? "—"} />
          <Widget
            title="Pending Approvals"
            value={summary?.pendingApprovals ?? 0}
          />
          <Widget
            title="Estimated Cost"
            value={`₹ ${Number(summary?.estimatedCost || 0).toLocaleString()}`}
          />
          <Widget
            title="Variance from Prev"
            value={`${(summary?.varianceFromPrev ?? 0) * 100}%`}
          />
        </div>

        <div className={styles.main}>
          <div className={styles.left}>
            <div className={styles.stepperCard}>
              {steps.map((s, i) => (
                <div key={s} onClick={() => onStepAction(i)}>
                  <StepA
                    idx={i + 1}
                    title={s}
                    active={activeStep === i}
                    done={!!completed[i]}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <div className={styles.panelHeader}>
                <h3 className={styles.headerh3}>{steps[activeStep]}</h3>
                <div className={styles.panelActions}>
                  {activeStep === 1 && (
                    <button className={"submitbtn"} onClick={runValidation}>
                      Run Validation
                    </button>
                  )}
                  {activeStep === 2 && (
                    <button className={"submitbtn"} onClick={runAttendance}>
                      Process Attendance
                    </button>
                  )}
                  {activeStep === 3 && (
                    <button className={"submitbtn"} onClick={runEarnings}>
                      Calculate Earnings
                    </button>
                  )}
                  {activeStep === 4 && (
                    <button className={"submitbtn"} onClick={runDeductions}>
                      Calculate Deductions
                    </button>
                  )}
                  {activeStep === 5 && (
                    <button className={"submitbtn"} onClick={runTax}>
                      Run Tax Engine
                    </button>
                  )}
                  {activeStep === 6 && (
                    <button
                      className={"submitbtn"}
                      onClick={runEmployerContrib}
                    >
                      Compute Contributions
                    </button>
                  )}
                  {activeStep === 7 && (
                    <button
                      className={"submitbtn"}
                      onClick={preFinalizeAdjustments}
                    >
                      Apply Adjustments
                    </button>
                  )}
                  {activeStep === 8 && (
                    <button className={"submitbtn"} onClick={generateSummary}>
                      Generate Summary
                    </button>
                  )}
                  {activeStep === 9 && (
                    <button className={"submitbtn"} onClick={approvalWorkflow}>
                      Configure Approvals
                    </button>
                  )}
                  {activeStep === 10 && (
                    <button className={"submitbtn"} onClick={finalizePayroll}>
                      Finalize Payroll
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.panelBody}>
                {loadingStep && (
                  <div className={styles.loading}>Processing...</div>
                )}

                {activeStep === 0 && (
                  <div>
                    <p className={styles.stepPara}>
                      Select pay cycle and run configuration on the left. Use
                      toggles for include/exclude rules, payment date, currency,
                      joiners/exits etc. (UI hooks).
                    </p>
                    <div className={styles.configGrid}>
                      <label>
                        Payment Date : <input type="date" />
                      </label>
                      <label>
                        <input type="checkbox" /> Include New Joiners
                      </label>
                      <label>
                        <input type="checkbox" /> Include Exiting Employees
                      </label>
                      <label>
                        <input type="checkbox" /> Include on Leave without Pay
                      </label>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div>
                    <p className={styles.stepPara}>
                      Pre-payroll validation checks (missing attendance, salary
                      assignment, bank details, statutory IDs, negative
                      components).
                    </p>
                    <div className={styles.validationTableWrap}>
                      <table className={"square-table w-100"}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Issue</th>
                            <th>Severity</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validationIssues.length === 0 && (
                            <tr>
                              <td colSpan="5">
                                No validation run yet or no issues.
                              </td>
                            </tr>
                          )}
                          {validationIssues.map((v) => (
                            <ValidationRow
                              key={v.id}
                              v={v}
                              onFix={(row) => {
                                setToast(`Fix action for ${row.employee}`);
                                setTimeout(() => setToast(null), 1200);
                              }}
                            />
                          ))}
                        </tbody>
                      </table>

                      <div className={"d-flex justify-content-start mt-3"}>
                        <button className={"submitbtn"} onClick={runValidation}>
                          Revalidate
                        </button>
                        <button
                          className={"cancelbtn"}
                          onClick={() => {
                            setToast("Continuing with warnings (simulate)");
                            setTimeout(() => setToast(null), 1200);
                          }}
                        >
                          Continue with Warnings
                        </button>
                        <button
                          className={"viewbtn"}
                          onClick={() => {
                            setValidationIssues(
                              validationIssues.filter(
                                (v) => v.severity !== "Error"
                              )
                            );
                            setToast("Auto-hide errors (simulate)");
                            setTimeout(() => setToast(null), 1200);
                          }}
                        >
                          Stop on Errors (Auto-block)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div>
                    {!attendance && <p>No attendance processed yet.</p>}
                    {attendance && (
                      <div className={styles.stepPara}>
                        <div className={styles.attSummary}>
                          <div>
                            Total Working Days: {attendance.totalWorkingDays}
                          </div>
                          <div>
                            Days Present (sample avg): {attendance.daysPresent}
                          </div>
                          <div>
                            Leaves Approved: {attendance.leavesApproved}
                          </div>
                        </div>
                        <div className={styles.smallTableWrap}>
                          <table className={"square-table w-100"}>
                            <thead>
                              <tr>
                                <th>Employee</th>
                                <th>Present</th>
                                <th>Leaves</th>
                                <th>OT hrs</th>
                              </tr>
                            </thead>
                            <tbody>
                              {attendance.details.map((d) => (
                                <tr key={d.id}>
                                  <td>{d.name}</td>
                                  <td>{d.present}</td>
                                  <td>{d.leaves}</td>
                                  <td>{d.overtimeHours}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeStep === 3 && (
                  <div>
                    <p className={styles.stepPara}>
                      Earnings calculation preview (component-wise).
                    </p>
                    <div className={styles.smallTableWrap}>
                      <table className={"square-table w-100"}>
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Components</th>
                            <th>Gross</th>
                          </tr>
                        </thead>
                        <tbody>
                          {earnings.slice(0, 20).map((e) => (
                            <tr key={e.id}>
                              <td>{e.name}</td>
                              <td>
                                {e.components
                                  .map((c) => `${c.name}: ${c.value}`)
                                  .join(", ")}
                              </td>
                              <td>₹ {e.gross.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div>
                    <p className={styles.stepPara}>
                      Deductions preview and adjustments.
                    </p>
                    <div className={styles.smallTableWrap}>
                      <table className={"square-table w-100"}>
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Deductions</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deductions.slice(0, 20).map((d) => (
                            <tr key={d.id}>
                              <td>{d.name}</td>
                              <td>
                                {d.deductions
                                  .map((x) => `${x.name}: ${x.value}`)
                                  .join(", ")}
                              </td>
                              <td>₹ {d.totalDeductions.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeStep === 5 && (
                  <div>
                    <p className={styles.stepPara}>
                      Tax calculation engine outputs and taxable income per
                      employee.
                    </p>
                    <div className={styles.smallTableWrap}>
                      <table className={"square-table w-100"}>
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Taxable Income</th>
                            <th>Tax</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taxes.slice(0, 20).map((t) => (
                            <tr key={t.id}>
                              <td>{t.name}</td>
                              <td>₹ {t.taxable.toLocaleString()}</td>
                              <td>₹ {t.taxAmount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeStep === 6 && (
                  <div>
                    <p className={styles.stepPara}>
                      Employer-side contributions summary (PF, ESI, Pension ...)
                    </p>
                    <ul>
                      {employerContrib.map((c, i) => (
                        <li key={i} className={styles.listing}>
                          {c.name}: ₹ {c.value.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeStep === 7 && (
                  <div>
                    <p className={styles.stepPara}>
                      Pre-finalization: bulk adjustments, LOP recalculation,
                      reimbursement payouts, ad-hoc adjustments.
                    </p>
                    <div className={styles.adjustActions}>
                      <button className={"submitbtn"}>
                        Upload Adjustments
                      </button>
                      <button className={"viewbtn"}>Apply LOP</button>
                      <button className={"extrabtn"}>
                        Add Adhoc Adjustment
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 8 && (
                  <div>
                    <p className={styles.stepPara}>
                      Consolidated payroll summary for review. Download summary
                      or export GL.
                    </p>
                    <div className={styles.smallTableWrap}>
                      <table className={"square-table w-100"}>
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Gross</th>
                            <th>Deductions</th>
                            <th>Net Pay</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ledger.map((l, i) => (
                            <tr key={i}>
                              <td>{l.employee}</td>
                              <td>₹ {l.gross.toLocaleString()}</td>
                              <td>₹ {l.deductions.toLocaleString()}</td>
                              <td>₹ {l.net.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <button
                        className={"submitbtn"}
                        onClick={() => exportSummary("preview")}
                      >
                        Download Summary
                      </button>
                      <button
                        className={"viewbtn"}
                        onClick={() => exportSummary("preview")}
                      >
                        Export General Ledger
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 9 && (
                  <StepApprovalWorkflow
                    approverOptions={[
                      "Manager 1",
                      "Manager 2",
                      "HR Head",
                      "Finance Lead",
                    ]}
                    defaultApprover="Manager 1"
                    defaultSequence="parallel"
                    onSave={(data) => approvalWorkflow(data)}
                  />
                )}

                {activeStep === 10 && (
                  <div>
                    <p className={styles.stepPara}>
                      Finalization: generate payslips, bank transfer sheet, TDS
                      reports, update employee ledger and lock payroll.
                    </p>
                    <div style={{ marginTop: 8 }}>
                      <button
                        className={"viewbtn"}
                        onClick={() => finalizePayroll()}
                      >
                        Finalize Payroll
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.history}>
              <h4>Payroll Run History</h4>
              <table className={"square-table w-100"}>
                <thead>
                  <tr>
                    <th>Run ID</th>
                    <th>Period</th>
                    <th>Employees</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.period}</td>
                      <td>{r.employees}</td>
                      <td>₹ {r.totalCost.toLocaleString()}</td>
                      <td>{r.status}</td>
                      <td>
                        <button
                          className={"table-approved-btn mx-2"}
                          onClick={() => exportSummary(r.id)}
                        >
                          Download
                        </button>
                        <button
                          className={"table-view-btn"}
                          onClick={() => {
                            setToast("Reopen run (admin only) - simulate");
                            setTimeout(() => setToast(null), 1200);
                          }}
                        >
                          Reopen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    </>
  );
}

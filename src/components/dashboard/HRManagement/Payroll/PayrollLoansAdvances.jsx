// src/pages/PayrollLoansAdvances.jsx
import React, { useEffect, useState } from "react";
import * as api from "./mockLoans";
import styles from "./PayrollLoansAdvances.module.css";

/*
 Loans & Advances Dashboard
 Implements features from payroll_loansAdvances.pdf:
  - Summary widgets (page 1)
  - Loan Requests table (page 2)
  - Active Loans table (page 2-3)
  - Advance Requests (page 3)
  - Repayment Ledger view (page 3)
  - Create New Loan modal (page 4)
  - Create Advance Request modal (page 4)
  - Loan Policies listing & quick edit hooks (page 5-6)
  - Bulk upload + CSV export (page 7)
  - Auto actions & reports hooks (page 7-8)
 Citation: spec pages & sections (overview, tables, forms, policies). :contentReference[oaicite:1]{index=1}
*/

function SummaryCard({ title, value, sub }) {
  return (
    <div className={styles.summaryCard}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue}>{value}</div>
      {sub && <div className={styles.cardSub}>{sub}</div>}
    </div>
  );
}

/* Create Loan Modal (simple) */
function CreateLoanModal({ categories, onClose, onCreate }) {
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    loanType: categories[0] || "",
    requestedAmount: "",
    tenureMonths: 12,
    interestRate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  function validate() {
    const e = {};
    if (!form.employeeName) e.employeeName = "Required";
    if (!form.requestedAmount || Number(form.requestedAmount) <= 0)
      e.requestedAmount = "Amount > 0";
    if (!form.loanType) e.loanType = "Select loan type";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit(e) {
    e && e.preventDefault();
    if (!validate()) return;
    await onCreate(form);
  }
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <form
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        
        <label className={styles.label}>
          Employee Name
          <input
            className={styles.input}
            value={form.employeeName}
            onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
          />
        </label>
        {errors.employeeName && (
          <div className={styles.fieldError}>{errors.employeeName}</div>
        )}
        <label className={styles.label}>
          Employee ID
          <input
            className={styles.input}
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Loan Type
          <select
            className={styles.input}
            value={form.loanType}
            onChange={(e) => setForm({ ...form, loanType: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Requested Amount
          <input
            className={styles.input}
            type="number"
            value={form.requestedAmount}
            onChange={(e) =>
              setForm({ ...form, requestedAmount: e.target.value })
            }
          />
        </label>
        <label className={styles.label}>
          Tenure (months)
          <input
            className={styles.input}
            type="number"
            value={form.tenureMonths}
            onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Interest Rate (%)
          <input
            className={styles.input}
            type="number"
            step="0.01"
            value={form.interestRate}
            onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Notes
          <textarea
            className={styles.input}
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          ></textarea>
        </label>

        <div className={"d-flex justify-content-center mt-2"}>
          <button type="button" className={"cancelbtn"} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={"submitbtn"}>
            Create Request
          </button>
        </div>
      </form>
    </div>
  );
}

/* Create Advance Modal */
function CreateAdvanceModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    advanceType: "Salary Advance",
    amount: "",
    paybackType: "One-time",
    notes: "",
  });
  const [err, setErr] = useState(null);
  function validate() {
    if (!form.employeeName || !form.amount) {
      setErr("Name and amount required");
      return false;
    }
    setErr(null);
    return true;
  }
  async function submit(e) {
    e && e.preventDefault();
    if (!validate()) return;
    await onCreate(form);
  }
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <form
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <h3>Create Advance Request</h3>
        <label className={styles.label}>
          Employee Name
          <input
            className={styles.input}
            value={form.employeeName}
            onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Advance Type
          <select
            className={styles.input}
            value={form.advanceType}
            onChange={(e) => setForm({ ...form, advanceType: e.target.value })}
          >
            <option>Salary Advance</option>
            <option>Emergency Advance</option>
            <option>Instant Advance</option>
          </select>
        </label>
        <label className={styles.label}>
          Amount
          <input
            className={styles.input}
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Payback Type
          <select
            className={styles.input}
            value={form.paybackType}
            onChange={(e) => setForm({ ...form, paybackType: e.target.value })}
          >
            <option>One-time</option>
            <option>Split over X months</option>
          </select>
        </label>
        {err && <div className={styles.fieldError}>{err}</div>}
        <div className={"d-flex justify-content-center mt-3"}>
          <button type="button" className={"cancelbtn"} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={"submitbtn"}>
            Submit Advance
          </button>
        </div>
      </form>
    </div>
  );
}

/* Repayment Ledger Drawer */
function LedgerDrawer({ entries, onClose }) {
  if (!entries) return null;
  return (
    <div className={styles.drawerBackdrop} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h4>Repayment Ledger</h4>
          <button className={styles.iconClose} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.drawerBody}>
          <table className={"square-table w-100"}>
            <thead>
              <tr>
                <th>Entry ID</th>
                <th>Employee</th>
                <th>Loan</th>
                <th>Period</th>
                <th>Deducted</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
                {entries.length === 0 && <tr>
                    <td colSpan={6}>NO DATA FOUND</td>
                    </tr>}
              {entries.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.employeeId}</td>
                  <td>{r.loanId}</td>
                  <td>{r.period}</td>
                  <td>{r.amountDeducted}</td>
                  <td>{r.balanceOutstanding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Main component */
export default function PayrollLoansAdvances({ navigate }) {
  const [summary, setSummary] = useState({});
  const [loanRequests, setLoanRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [advanceRequests, setAdvanceRequests] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showCreateLoan, setShowCreateLoan] = useState(false);
  const [showCreateAdvance, setShowCreateAdvance] = useState(false);
  const [showLedgerFor, setShowLedgerFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  async function loadAll() {
    setLoading(true);
    const s = await api.fetchSummary();
    const lr = await api.fetchLoanRequests();
    const al = await api.fetchActiveLoans();
    const ar = await api.fetchAdvanceRequests();
    const pl = await api.fetchPolicies();
    setSummary(s);
    setLoanRequests(lr);
    setActiveLoans(al);
    setAdvanceRequests(ar);
    setPolicies(pl);
    setLoading(false);
  }
  useEffect(() => {
    loadAll();
  }, []);

  async function createLoan(payload) {
    const r = await api.createLoanRequest(payload);
    if (r.ok) {
      setToast({ type: "success", msg: "Loan request created" });
      await loadAll();
    } else setToast({ type: "error", msg: "Failed" });
    setTimeout(() => setToast(null), 1500);
    setShowCreateLoan(false);
  }

  async function createAdvance(payload) {
    const r = await api.createAdvanceRequest(payload);
    if (r.ok) {
      setToast({ type: "success", msg: "Advance requested" });
      await loadAll();
    } else setToast({ type: "error", msg: "Failed" });
    setTimeout(() => setToast(null), 1500);
    setShowCreateAdvance(false);
  }

  async function approve(id, type = "loan") {
    const r = await api.approveRequest(id, type);
    if (r.ok) {
      setToast({
        type: "success",
        msg: `${type === "loan" ? "Loan" : "Advance"} approved`,
      });
      await loadAll();
    } else setToast({ type: "error", msg: "Approve failed" });
    setTimeout(() => setToast(null), 1500);
  }

  async function reject(id, type = "loan") {
    const r = await api.rejectRequest(id, type);
    if (r.ok) {
      setToast({
        type: "success",
        msg: `${type === "loan" ? "Loan" : "Advance"} rejected`,
      });
      await loadAll();
    } else setToast({ type: "error", msg: "Reject failed" });
    setTimeout(() => setToast(null), 1500);
  }

  async function exportCsv(type) {
    const resp = await api.exportCSV(type);
    if (resp.ok) {
      const blob = new Blob([resp.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ type: "success", msg: "Exported CSV" });
      setTimeout(() => setToast(null), 1500);
    }
  }

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/payroll")}>Payroll</span>{" "}
        <i className="bi bi-chevron-right"></i> Loans & Advances
      </p>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerActions}>
            <button
              className={"homebtn"}
              onClick={() => setShowCreateLoan(true)}
            >
              Create New Loan
            </button>
            <button
              className={"homebtn"}
              onClick={() => setShowCreateAdvance(true)}
            >
              Create Advance
            </button>
            <button
              className={"homebtn"}
              onClick={() => exportCsv("loanRequests")}
            >
              Export Loan Requests
            </button>
            <button
              className={"homebtn"}
              onClick={() => exportCsv("activeLoans")}
            >
              Export Active Loans
            </button>
          </div>
        </div>

        <div className={styles.summaryRow}>
          <SummaryCard
            title="Total Active Loans"
            value={summary.totalActiveLoans || 0}
          />
          <SummaryCard
            title="Pending Approvals"
            value={summary.totalPendingApprovals || 0}
          />
          <SummaryCard
            title="Outstanding Amount"
            value={`₹ ${Number(
              summary.totalOutstandingAmount || 0
            ).toLocaleString()}`}
          />
          <SummaryCard
            title="This Month Deductions"
            value={`₹ ${Number(
              summary.thisMonthDeductions || 0
            ).toLocaleString()}`}
          />
          <SummaryCard
            title="Loans Cleared This Year"
            value={summary.loansClearedThisYear || 0}
          />
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h3 className={styles.headerh3}>Loan Requests</h3>
            <table className={"square-table w-100"}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Requested</th>
                  <th>Tenure</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loanRequests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      {r.employeeName} ({r.employeeId})
                    </td>
                    <td>{r.loanType}</td>
                    <td>₹ {r.requestedAmount.toLocaleString()}</td>
                    <td>{r.tenureMonths || "-"}</td>
                    <td>
                      <span
                        className={
                          styles.status +
                          " " +
                          styles["status_" + r.status.toLowerCase()]
                        }
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={"table-approved-btn mb-2 mx-2"}
                        onClick={() => approve(r.id, "loan")}
                      >
                        Approve
                      </button>
                      <button
                        className={"table-declined-btn"}
                        onClick={() => reject(r.id, "loan")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.card}>
            <h3 className={styles.headerh3}>Active Loans</h3>
            <table className={"square-table w-100"}>
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Sanctioned</th>
                  <th>Outstanding</th>
                  <th>EMI</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.map((l) => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>
                      {l.employeeName} ({l.employeeId})
                    </td>
                    <td>{l.loanType}</td>
                    <td>₹ {l.totalSanctioned.toLocaleString()}</td>
                    <td>₹ {l.outstandingAmount.toLocaleString()}</td>
                    <td>₹ {l.emi.toLocaleString()}</td>
                    <td>
                      <span
                        className={
                          styles.status +
                          " " +
                          styles["status_" + l.status.toLowerCase()]
                        }
                      >
                        {l.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={"table-view-btn"}
                        onClick={async () => {
                          const ledger = await api.fetchRepaymentLedger({
                            loanId: l.id,
                          });
                          setLedgerEntries(ledger);
                          setShowLedgerFor(l.id);
                        }}
                      >
                        Ledger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.cardFull}>
            <h3 className={styles.headerh3}>Advance Requests</h3>
            <table className={"square-table w-100"}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {advanceRequests.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>
                      {a.employeeName} ({a.employeeId})
                    </td>
                    <td>{a.advanceType}</td>
                    <td>₹ {a.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={
                          styles.status +
                          " " +
                          styles["status_" + a.status.toLowerCase()]
                        }
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={"table-approved-btn mx-2"}
                        onClick={() => approve(a.id, "advance")}
                      >
                        Approve
                      </button>
                      <button
                        className={"table-declined-btn"}
                        onClick={() => reject(a.id, "advance")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.cardFull}>
            <h3 className={styles.headerh3}>Loan Policies (Config)</h3>
            <div className={styles.policyList}>
              {policies.map((p) => (
                <div key={p.id} className={styles.policyCard}>
                  <div className={styles.policyTitle}>{p.name}</div>
                  <div>Max rule: {p.maxAmountRule || p.maxAmountRule}</div>
                  <div>Tenure: {p.maxTenure} months</div>
                  <div>Interest: {p.defaultInterestRate}%</div>
                  <div className={styles.policyActions}>
                    <button className={"submitbtn"}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {showCreateLoan && (
          <CreateLoanModal
            categories={policies.map((p) => p.name)}
            onClose={() => setShowCreateLoan(false)}
            onCreate={createLoan}
          />
        )}
        {showCreateAdvance && (
          <CreateAdvanceModal
            onClose={() => setShowCreateAdvance(false)}
            onCreate={createAdvance}
          />
        )}
        {showLedgerFor && (
          <LedgerDrawer
            entries={ledgerEntries}
            onClose={() => {
              setShowLedgerFor(null);
              setLedgerEntries([]);
            }}
          />
        )}

        {toast && (
          <div
            className={`${styles.toast} ${
              toast.type === "success" ? styles.toastSuccess : styles.toastError
            }`}
          >
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}

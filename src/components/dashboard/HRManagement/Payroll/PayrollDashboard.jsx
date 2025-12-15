import React, { useEffect, useState } from "react";
import styles from "./Payroll.module.css";

/* Subcomponents (in same file for brevity) */
const HeaderToolbar = ({ onRunPayroll, payCycle, onImport, onExport }) => {
  return (
    <div className={styles.headerToolbar}>
      <div className={styles.toolbarLeft}>
        <h2 className={styles.title}>Payroll Home</h2>
        <div className={styles.payCycleInfo}>
          <strong>Current Pay Cycle:</strong>
          <span>
            {payCycle ? `${payCycle.startDate} — ${payCycle.endDate}` : "—"}
          </span>
          <select aria-label="Select country" className={styles.countrySelect}>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </div>

      <div className={styles.toolbarRight}>
        <button
          className={`${styles.btn} ${styles.primary}`}
          onClick={onRunPayroll}
        >
          Run Payroll
        </button>
        <button
          className={styles.btn}
          onClick={() => alert("Re-run/Rollback flow")}
        >
          Re-run / Rollback
        </button>
        <button className={styles.btn} onClick={onImport}>
          Import
        </button>
        <button className={styles.btn} onClick={onExport}>
          Export
        </button>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, sub }) => (
  <div className={styles.summaryCard}>
    <div className={styles.cardTitle}>{title}</div>
    <div className={styles.cardValue}>{value}</div>
    {sub && <div className={styles.cardSub}>{sub}</div>}
  </div>
);

const SummaryCards = ({ summary }) => (
  <div className={styles.summaryRow}>
    <SummaryCard title="Total Employees" value={summary.totalEmployees} />
    <SummaryCard
      title="Total Gross Pay"
      value={`₹ ${summary.totalGrossPay?.toLocaleString() || 0}`}
    />
    <SummaryCard
      title="Total Deductions"
      value={`₹ ${summary.totalDeductions?.toLocaleString() || 0}`}
    />
    <SummaryCard
      title="Net Payable"
      value={`₹ ${summary.netPayable?.toLocaleString() || 0}`}
    />
    <SummaryCard
      title="Employees with Changes"
      value={summary.employeesWithChanges}
    />
    <SummaryCard
      title="Compliance Deviations"
      value={summary.complianceDeviations}
      sub="Hover to view details"
    />
  </div>
);

const PendingActionsPanel = ({ items }) => (
  <div className={styles.pendingPanel}>
    <h3>Pending Actions</h3>
    <ul>
      {items.map((it) => (
        <li key={it.id} className={styles.pendingItem}>
          <div>
            <strong>{it.title}</strong>
            <div className={styles.pendingDesc}>{it.desc}</div>
          </div>
          <button
            className={styles.linkBtn}
            onClick={() => alert(`Go to ${it.action}`)}
          >
            Go
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const CurrentPayCycle = ({ payCycle }) => (
  <div className={styles.payCycle}>
    <h3>Current Pay Cycle</h3>
    {payCycle ? (
      <div className={styles.payCycleGrid}>
        <div>
          <strong>Period</strong>
          <div>
            {payCycle.startDate} — {payCycle.endDate}
          </div>
        </div>
        <div>
          <strong>Frequency</strong>
          <div>{payCycle.frequency}</div>
        </div>
        <div>
          <strong>Cut-off Dates</strong>
          <div>{payCycle.cutOffDates.join(", ")}</div>
        </div>
        <div>
          <strong>Status</strong>
          <ul className={styles.statusList}>
            <li>
              Attendance Sync: {payCycle.statuses.attendanceSync ? "✔" : "—"}
            </li>
            <li>Leave Sync: {payCycle.statuses.leaveSync ? "✔" : "—"}</li>
            <li>Adjustments: {payCycle.statuses.adjustments ? "✔" : "—"}</li>
            <li>
              Payroll Draft:{" "}
              {payCycle.statuses.payrollDraftGenerated
                ? "Generated"
                : "Not generated"}
            </li>
            <li>
              Payroll Approved:{" "}
              {payCycle.statuses.payrollApproved ? "Approved" : "Pending"}
            </li>
          </ul>
        </div>
        <div>
          <strong>Expected gross</strong>
          <div>₹ {payCycle.expectedGross?.toLocaleString()}</div>
        </div>
        <div>
          <strong>Variance</strong>
          <div>{(payCycle.varianceFromLast * 100).toFixed(2)}%</div>
        </div>
        <div>
          <strong>Anomalies</strong>
          <div>{payCycle.employeesWithAnomalies}</div>
        </div>
      </div>
    ) : (
      <div>No pay cycle selected</div>
    )}
  </div>
);

const RecentPayrollRunsTable = ({ runs, onViewPayslip, onExport }) => (
  <div >
    <h3>Recent Payroll Runs</h3>
    <table className={"square-table w-100"}>
      <thead>
        <tr>
          <th>Pay Period</th>
          <th>Total Employees</th>
          <th>Gross Amount</th>
          <th>Deductions</th>
          <th>Net Pay</th>
          <th>Variance %</th>
          <th>Processed By</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {runs.map((r) => (
          <tr key={r.id}>
            <td>{r.period}</td>
            <td>{r.totalEmployees}</td>
            <td>₹ {r.grossAmount.toLocaleString()}</td>
            <td>₹ {r.deductions.toLocaleString()}</td>
            <td>₹ {r.netPay.toLocaleString()}</td>
            <td>{r.variancePercent}%</td>
            <td>{r.processedBy}</td>
            <td>
              <span className={styles.statusTag}>{r.status}</span>
            </td>
            <td >
              <button
                className={'viewbtn'}
                onClick={() => onViewPayslip(r)}
              >
                View 
              </button>
              <button className={'cancelbtn'} onClick={() => onExport(r)}>
                Export
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ComplianceAlerts = ({ alerts }) => (
  <div className={styles.compliance}>
    <h3>Compliance & Statutory Alerts</h3>
    <div className={styles.alertCards}>
      {alerts.map((a) => (
        <div key={a.id} className={styles.alertCard}>
          <strong>{a.region}</strong>
          <ul>
            {a.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
          <button
            className={styles.linkBtn}
            onClick={() => alert("Open statutory configuration")}
          >
            Configure
          </button>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions = ({ actions }) => (
  <div className={styles.quickActions}>
    {actions.map((a) => (
      <button
        key={a.key}
        className={styles.quickActionBtn}
        onClick={() => alert(a.action)}
        aria-label={a.label}
      >
        <div className={styles.qaIcon}>{a.icon || "⚙"}</div>
        <div className={styles.qaLabel}>{a.label}</div>
      </button>
    ))}
  </div>
);

const AdvancedPanels = ({ panels }) => {
  const [open, setOpen] = useState({});
  const toggle = (k) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));
  return (
    <div className={styles.advancedPanels}>
      <h3>Advanced Panels (Analytics)</h3>
      {panels.map((p) => (
        <div key={p.key} className={styles.panel}>
          <div className={styles.panelHeader}>
            <strong>{p.title}</strong>
            <div>
              <button
                className={'generatebtn'}
                onClick={() => toggle(p.key)}
              >
                {open[p.key] ? "Collapse" : "Expand"}
              </button>
            </div>
          </div>
          {open[p.key] && <div className={styles.panelBody}>{p.content}</div>}
        </div>
      ))}
    </div>
  );
};

/* Main Dashboard component */
export default function PayrollDashboard() {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalGrossPay: 0,
    totalDeductions: 0,
    netPayable: 0,
    employeesWithChanges: 0,
    complianceDeviations: 0,
  });
  const [payCycle, setPayCycle] = useState(null);
  const [pending, setPending] = useState([]);
  const [runs, setRuns] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* mock fetch - replace with real API calls */
  useEffect(() => {
    // Simulate fetch
    const mockPayCycle = {
      id: "2025-11",
      startDate: "01 Nov 2025",
      endDate: "30 Nov 2025",
      frequency: "Monthly",
      cutOffDates: ["28 Oct 2025"],
      statuses: {
        attendanceSync: true,
        leaveSync: true,
        adjustments: true,
        payrollDraftGenerated: true,
        payrollApproved: false,
      },
      expectedGross: 1200000,
      varianceFromLast: 0.02,
      employeesWithAnomalies: 3,
    };

    const mockSummary = {
      totalEmployees: 125,
      totalGrossPay: 1200000,
      totalDeductions: 150000,
      netPayable: 1050000,
      employeesWithChanges: 12,
      complianceDeviations: 2,
    };

    const mockPending = [
      {
        id: "p1",
        title: "Missing salary structure",
        desc: "12 employees without salary structure",
        action: "salary-structure",
      },
      {
        id: "p2",
        title: "Missing bank details",
        desc: "5 employees missing bank info",
        action: "bank-details",
      },
    ];

    const mockRuns = [
      {
        id: "r1",
        period: "1 Nov - 30 Nov 2025",
        totalEmployees: 125,
        grossAmount: 1200000,
        deductions: 150000,
        netPay: 1050000,
        variancePercent: 2.5,
        processedBy: "Hari",
        status: "Draft",
      },
    ];

    const mockAlerts = [
      {
        id: "a1",
        region: "India",
        items: [
          "PF threshold validation",
          "ESI applicability change",
          "Income tax slab updates",
        ],
      },
      {
        id: "a2",
        region: "US",
        items: [
          "Federal/State tax updates",
          "Social security withholding changes",
        ],
      },
    ];

    setTimeout(() => {
      setPayCycle(mockPayCycle);
      setSummary(mockSummary);
      setPending(mockPending);
      setRuns(mockRuns);
      setAlerts(mockAlerts);
      setLoading(false);
    }, 300);
  }, []);

  const handleRunPayroll = () => {
    // Show run-payroll modal or call API
    alert("Run payroll flow - open modal or start pipeline");
  };

  const handleImport = () =>
    alert(
      "Open import modal (salaries, attendance, shifts, leaves, increments)"
    );
  const handleExport = () =>
    alert(
      "Export: Standard payroll report / Bank transfer sheet / Statutory reports"
    );

  if (loading)
    return <div className={styles.loading}>Loading payroll dashboard...</div>;

  return (
    <div className={styles.container}>
      <HeaderToolbar
        onRunPayroll={handleRunPayroll}
        payCycle={payCycle}
        onImport={handleImport}
        onExport={handleExport}
      />

      <SummaryCards summary={summary} />

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <PendingActionsPanel items={pending} />
          <ComplianceAlerts alerts={alerts} />
          <QuickActions
            actions={[
              {
                key: "c1",
                label: "Configure Salary Components",
                action: "configure-salary",
              },
              {
                key: "c2",
                label: "Create Salary Structure",
                action: "create-structure",
              },
              {
                key: "c3",
                label: "Add Ad-hoc Payment",
                action: "ad-hoc-payment",
              },
              {
                key: "c4",
                label: "Upload Adjustments",
                action: "upload-adjustments",
              },
              { key: "c5", label: "Tax Configuration", action: "tax-config" },
            ]}
          />
        </div>

        <div className={styles.rightColumn}>
          <CurrentPayCycle payCycle={payCycle} />
          <RecentPayrollRunsTable
            runs={runs}
            onViewPayslip={(r) => alert("View payslip for " + r.id)}
            onExport={(r) => alert("Export " + r.id)}
          />
          <AdvancedPanels
            panels={[
              {
                key: "p1",
                title: "Salary Structure Analytics",
                content: (
                  <div>
                    Percentage of employees in each band; comparison with last
                    cycle...
                  </div>
                ),
              },
              {
                key: "p2",
                title: "Variance Reports",
                content: (
                  <div>Overtime deviations; shift/attendance anomalies...</div>
                ),
              },
              {
                key: "p3",
                title: "Loan & Advances",
                content: <div>Outstanding loans; recoveries this month</div>,
              },
              {
                key: "p4",
                title: "Reimbursements Overview",
                content: <div>Total claimed, approved, pending</div>,
              },
              {
                key: "p5",
                title: "Tax Projection Summary",
                content: (
                  <div>
                    Monthly withholding totals; deviations; employees taxed
                    incorrectly
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// src/api/mockLoans.js
// Simple in-memory mock for Loans & Advances module

const db = {
  nextId: 3000,
  loanRequests: [
    {
      id: "LR-1001",
      employeeId: "E001",
      employeeName: "Aarti Sharma",
      loanType: "Personal Loan",
      requestedAmount: 50000,
      approvedAmount: null,
      emiAmount: null,
      tenureMonths: 12,
      status: "Pending",
      requestedAt: "2025-11-10T09:00:00Z",
      notes: "Urgent medical",
    },
    {
      id: "LR-1002",
      employeeId: "E023",
      employeeName: "Ravi Kumar",
      loanType: "Education Loan",
      requestedAmount: 120000,
      approvedAmount: 120000,
      emiAmount: 10000,
      tenureMonths: 12,
      status: "Approved",
      requestedAt: "2025-10-12T08:30:00Z",
      notes: "Course fee",
    },
  ],
  activeLoans: [
    {
      id: "L-2001",
      employeeId: "E023",
      employeeName: "Ravi Kumar",
      loanType: "Education Loan",
      totalSanctioned: 120000,
      outstandingAmount: 60000,
      emi: 10000,
      deductionMode: "Monthly EMI",
      remainingInstallments: 6,
      lastDeductionDate: "2025-10-31",
      status: "Active",
    },
  ],
  advanceRequests: [
    {
      id: "AR-3001",
      employeeId: "E011",
      employeeName: "Sonia Verma",
      advanceType: "Salary Advance",
      amount: 10000,
      paybackType: "Split over 2 months",
      status: "Pending",
      requestedAt: "2025-11-12T10:00:00Z",
    },
  ],
  repaymentLedger: [
    {
      id: "RL-1",
      employeeId: "E023",
      loanId: "L-2001",
      period: "2025-10",
      emiAmount: 10000,
      amountDeducted: 10000,
      balanceOutstanding: 60000,
      autoManual: "Auto",
      remarks: "",
    },
  ],
  loanPolicies: [
    {
      id: "P1",
      name: "Personal Loan",
      maxAmountRule: "X times Basic Salary",
      maxTenure: 24,
      defaultInterestRate: 12.5,
      processingFee: 1,
      allowMultipleActive: false,
    },
  ],
};

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchSummary() {
  await delay();
  return {
    totalActiveLoans: db.activeLoans.length,
    totalPendingApprovals: db.loanRequests.filter((r) => r.status === "Pending")
      .length,
    totalOutstandingAmount: db.activeLoans.reduce(
      (s, l) => s + l.outstandingAmount,
      0
    ),
    thisMonthDeductions: db.repaymentLedger.reduce(
      (s, e) => s + (e.amountDeducted || 0),
      0
    ),
    loansClearedThisYear: 2,
  };
}

export async function fetchLoanRequests() {
  await delay();
  return db.loanRequests.slice().reverse();
}

export async function fetchActiveLoans() {
  await delay();
  return db.activeLoans.slice().reverse();
}

export async function fetchAdvanceRequests() {
  await delay();
  return db.advanceRequests.slice().reverse();
}

export async function fetchRepaymentLedger({ loanId = null } = {}) {
  await delay();
  if (loanId) return db.repaymentLedger.filter((r) => r.loanId === loanId);
  return db.repaymentLedger.slice().reverse();
}

export async function fetchPolicies() {
  await delay();
  return db.loanPolicies.slice();
}

export async function createLoanRequest(payload) {
  await delay();
  const id = `LR-${++db.nextId}`;
  const rec = {
    id,
    employeeId: payload.employeeId || "E999",
    employeeName: payload.employeeName || "Unknown",
    loanType: payload.loanType,
    requestedAmount: Number(payload.requestedAmount),
    approvedAmount: null,
    emiAmount: null,
    tenureMonths: payload.tenureMonths || null,
    status: "Pending",
    requestedAt: new Date().toISOString(),
    notes: payload.notes || "",
  };
  db.loanRequests.push(rec);
  return { ok: true, request: rec };
}

export async function createAdvanceRequest(payload) {
  await delay();
  const id = `AR-${++db.nextId}`;
  const rec = {
    id,
    employeeId: payload.employeeId || "E999",
    employeeName: payload.employeeName || "Unknown",
    advanceType: payload.advanceType,
    amount: Number(payload.amount),
    paybackType: payload.paybackType || "One-time",
    status: "Pending",
    requestedAt: new Date().toISOString(),
  };
  db.advanceRequests.push(rec);
  return { ok: true, advance: rec };
}

export async function approveRequest(id, type = "loan", approver = "System") {
  await delay();
  if (type === "loan") {
    const r = db.loanRequests.find((x) => x.id === id);
    if (!r) return { ok: false };
    r.status = "Approved";
    r.approvedAmount = r.requestedAmount;
    // create active loan entry
    const loanId = `L-${++db.nextId}`;
    const loan = {
      id: loanId,
      employeeId: r.employeeId,
      employeeName: r.employeeName,
      loanType: r.loanType,
      totalSanctioned: r.approvedAmount,
      outstandingAmount: r.approvedAmount,
      emi: Math.round(r.approvedAmount / (r.tenureMonths || 12)),
      deductionMode: "Monthly EMI",
      remainingInstallments: r.tenureMonths || 12,
      lastDeductionDate: null,
      status: "Active",
    };
    db.activeLoans.push(loan);
    return { ok: true, request: r, loan };
  } else {
    const a = db.advanceRequests.find((x) => x.id === id);
    if (!a) return { ok: false };
    a.status = "Approved";
    return { ok: true, advance: a };
  }
}

export async function rejectRequest(id, type = "loan") {
  await delay();
  if (type === "loan") {
    const r = db.loanRequests.find((x) => x.id === id);
    if (!r) return { ok: false };
    r.status = "Rejected";
    return { ok: true, request: r };
  } else {
    const a = db.advanceRequests.find((x) => x.id === id);
    if (!a) return { ok: false };
    a.status = "Rejected";
    return { ok: true, advance: a };
  }
}

export async function exportCSV(type = "loanRequests") {
  await delay();
  const rows = [];
  if (type === "loanRequests") {
    rows.push([
      "Request ID",
      "Employee",
      "Loan Type",
      "Requested Amount",
      "Status",
      "Requested At",
    ]);
    db.loanRequests.forEach((r) =>
      rows.push([
        r.id,
        r.employeeName,
        r.loanType,
        r.requestedAmount,
        r.status,
        r.requestedAt,
      ])
    );
  } else if (type === "activeLoans") {
    rows.push([
      "Loan ID",
      "Employee",
      "Type",
      "Sanctioned",
      "Outstanding",
      "EMI",
      "Status",
    ]);
    db.activeLoans.forEach((l) =>
      rows.push([
        l.id,
        l.employeeName,
        l.loanType,
        l.totalSanctioned,
        l.outstandingAmount,
        l.emi,
        l.status,
      ])
    );
  }
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return { ok: true, csv };
}

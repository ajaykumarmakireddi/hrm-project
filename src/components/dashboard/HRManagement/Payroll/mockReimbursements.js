// src/api/mockReimbursements.js
// Simple mock "backend" for reimbursements module.
// Keep in sync with your other mock APIs.

const mock = {
  reimbursements: [
    {
      id: "c-1001",
      employeeId: "E001",
      employeeName: "Aarti Sharma",
      category: "Travel",
      amount: 2400,
      currency: "INR",
      submittedAt: "2025-11-10T09:12:00Z",
      status: "Pending", // Pending, Approved, Rejected
      approver: "Manager 1",
      notes: "Taxi from airport",
      attachments: [{ id: "att1", name: "taxi.jpg", size: 34212 }],
    },
    {
      id: "c-1002",
      employeeId: "E023",
      employeeName: "Ravi Kumar",
      category: "Medical",
      amount: 3500.5,
      currency: "INR",
      submittedAt: "2025-11-08T12:40:00Z",
      status: "Approved",
      approver: "Manager 2",
      notes: "Medicines",
      attachments: [],
    },
    {
      id: "c-1003",
      employeeId: "E023",
      employeeName: "Hari Krishna",
      category: "Medical",
      amount: 3500.5,
      currency: "INR",
      submittedAt: "2025-11-08T12:40:00Z",
      status: "Approved",
      approver: "Manager 2",
      notes: "Medicines",
      attachments: [],
    },
    {
      id: "c-1004",
      employeeId: "E023",
      employeeName: "Karthik",
      category: "Medical",
      amount: 3500.5,
      currency: "INR",
      submittedAt: "2025-11-08T12:40:00Z",
      status: "Approved",
      approver: "Manager 2",
      notes: "Medicines",
      attachments: [],
    },
  ],
  categories: ["Travel", "Food", "Medical", "Phone", "Other"]
};

function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchReimbursements({ page = 1, pageSize = 10, filter = {} } = {}) {
  await delay(200);
  let list = mock.reimbursements.slice().reverse(); // newest first
  if (filter.status) list = list.filter(r => r.status === filter.status);
  if (filter.employeeName) list = list.filter(r => r.employeeName.toLowerCase().includes(filter.employeeName.toLowerCase()));
  if (filter.category) list = list.filter(r => r.category === filter.category);
  const total = list.length;
  const start = (page - 1) * pageSize;
  return { data: list.slice(start, start + pageSize), total };
}

export async function fetchReimbursementById(id) {
  await delay(150);
  return mock.reimbursements.find(r => r.id === id) || null;
}

export async function fetchCategories() {
  await delay(100);
  return mock.categories.slice();
}

export async function submitReimbursement(payload) {
  await delay(300);
  const id = `c-${Date.now()}`;
  const newClaim = {
    id,
    employeeId: payload.employeeId || "E999",
    employeeName: payload.employeeName || "You (dev)",
    category: payload.category,
    amount: Number(payload.amount),
    currency: payload.currency || "INR",
    submittedAt: new Date().toISOString(),
    status: "Pending",
    approver: payload.approver || null,
    notes: payload.notes || "",
    attachments: (payload.attachments || []).map((a,i) => ({ id: `att-${id}-${i}`, name: a.name, size: a.size }))
  };
  mock.reimbursements.push(newClaim);
  return { ok: true, claim: newClaim };
}

export async function bulkUploadClaims(claims) {
  // claims: array of parsed objects
  await delay(400);
  const created = [];
  for (const c of claims) {
    const { ok, claim } = await submitReimbursement(c);
    if (ok) created.push(claim);
  }
  return { ok: true, created };
}

export async function updateClaimStatus(id, newStatus, approver = "System") {
  await delay(180);
  const idx = mock.reimbursements.findIndex(r => r.id === id);
  if (idx === -1) return { ok: false, message: "Not found" };
  mock.reimbursements[idx].status = newStatus;
  mock.reimbursements[idx].approver = approver;
  return { ok: true, claim: mock.reimbursements[idx] };
}

export async function exportClaimsCSV({ filter = {} } = {}) {
  const resp = await fetchReimbursements({ page: 1, pageSize: 1000, filter });
  const rows = [
    ["ID", "Employee ID", "Employee Name", "Category", "Amount", "Currency", "Submitted At", "Status", "Approver", "Notes"]
  ];
  resp.data.forEach(r => rows.push([r.id, r.employeeId, r.employeeName, r.category, r.amount, r.currency, r.submittedAt, r.status, r.approver || "", r.notes || ""]));
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  return { ok: true, csv };
}

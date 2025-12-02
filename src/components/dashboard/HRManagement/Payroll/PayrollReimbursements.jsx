// src/pages/PayrollReimbursements.jsx
import React, { useEffect, useState, useRef } from "react";
import * as api from "./mockReimbursements";
import styles from "./PayrollReimbursements.module.css";

/**
 * Features implemented (aligned with payroll_reimbursements.pdf):
 * - Reimbursements list with pagination and filters (status, category, employee)
 * - Submit new reimbursement modal with attachments and front-end validations
 * - View claim details drawer
 * - Approve / Reject actions (mock)
 * - Bulk CSV upload (client-side parse) with validation & preview
 * - CSV export
 * - Summary stats (totals by status & total amount)
 *
 * Citation: design & required fields derived from uploaded spec. :contentReference[oaicite:1]{index=1}
 */

/* ---------- Helpers ---------- */
const formatCurrency = (n, c = "INR") => `${c} ${Number(n || 0).toLocaleString()}`;
const nowIso = () => new Date().toISOString();


/* ---------- NewClaimForm (modal-like) ---------- */
function NewClaimForm({ categories, onSubmit, onClose }) {
    const [form, setForm] = useState({
        employeeId: "",
        employeeName: "",
        category: categories[0] || "",
        amount: "",
        currency: "INR",
        notes: "",
        attachments: []
    });
    const [errors, setErrors] = useState({});
    const fileRef = useRef();


    function validate() {
        const e = {};
        if (!form.employeeName) e.employeeName = "Employee name is required";
        if (!form.category) e.category = "Category is required";
        if (!form.amount || Number(form.amount) <= 0) e.amount = "Amount must be > 0";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function onFileChange(ev) {
        const files = Array.from(ev.target.files || []);
        const attachments = files.map(f => ({ name: f.name, size: f.size }));
        setForm(f => ({ ...f, attachments: f.attachments.concat(attachments) }));
        // clear input to allow same filename later
        fileRef.current.value = "";
    }

    function removeAttachment(i) {
        setForm(f => ({ ...f, attachments: f.attachments.filter((_, idx) => idx !== i) }));
    }

    function submit(e) {
        e && e.preventDefault();
        if (!validate()) return;
        onSubmit(form);
    }

    return (
        <div className={styles.modalBackdrop}>
            <form className={styles.modal} onSubmit={submit}>
                <h3>Submit Reimbursement Claim</h3>

                <label className={styles.label}>
                    Employee name
                    <input className={styles.input} value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} />
                    {errors.employeeName && <div className={styles.error}>{errors.employeeName}</div>}
                </label>

                <label className={styles.label}>
                    Category
                    <select className={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <div className={styles.error}>{errors.category}</div>}
                </label>

                <label className={styles.label}>
                    Amount
                    <input className={styles.input} type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                    {errors.amount && <div className={styles.error}>{errors.amount}</div>}
                </label>

                <label className={styles.label}>
                    Notes (optional)
                    <textarea className={styles.input} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </label>

                <label className={styles.label}>
                    Attach receipts (images/PDF)
                    <input ref={fileRef} className={styles.input} type="file" multiple onChange={onFileChange} />
                </label>

                {form.attachments.length > 0 && (
                    <div className={styles.attachList}>
                        {form.attachments.map((a, i) => (
                            <div key={i} className={styles.attachItem}>
                                <div>{a.name} <small>({Math.round(a.size / 1024)} KB)</small></div>
                                <button type="button" className={styles.removeBtn} onClick={() => removeAttachment(i)}>Remove</button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.modalActions}>
                    <button type="button" className={styles.btn} onClick={onClose}>Cancel</button>
                    <button type="submit" className={styles.btnPrimary}>Submit Claim</button>
                </div>
            </form>
        </div>
    );
}

/* ---------- BulkUpload (CSV) ---------- */
function BulkUpload({ onUpload, categories }) {
    const [preview, setPreview] = useState([]);
    const [errors, setErrors] = useState([]);
    const fileRef = useRef();

    function parseCSV(text) {
        // naive CSV parse (expects header row)
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 1) return [];
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const rows = lines.slice(1).map(l => {
            const cols = l.split(",").map(c => c.trim());
            const obj = {};
            headers.forEach((h, i) => obj[h] = cols[i] || "");
            return obj;
        });
        return rows;
    }

    function handleFile(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = parseCSV(reader.result);
                // validate each row
                const pv = parsed.map((r, idx) => {
                    const item = {
                        employeeName: r["employee name"] || r["employee_name"] || r["employee"],
                        category: r["category"],
                        amount: Number(r["amount"] || r["amt"]),
                        notes: r["notes"] || "",
                        currency: r["currency"] || "INR"
                    };
                    const err = [];
                    if (!item.employeeName) err.push("employeeName required");
                    if (!item.category || !categories.includes(item.category)) err.push("invalid category");
                    if (!item.amount || Number(item.amount) <= 0) err.push("invalid amount");
                    return { row: idx + 2, item, errors: err };
                });
                const errs = pv.filter(p => p.errors.length);
                setPreview(pv);
                setErrors(errs);
            } catch (err) {
                setPreview([]);
                setErrors([{ row: 0, message: "Failed to parse CSV" }]);
            }
        };
        reader.readAsText(f);
        // clear input to allow re-upload
        fileRef.current.value = "";
    }

    return (
        <div className={styles.bulkUpload}>
            <div>
                <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} />
            </div>

            {preview.length > 0 && (
                <div className={styles.bulkPreview}>
                    <h4>Preview ({preview.length} rows)</h4>
                    <div className={styles.previewList}>
                        {preview.slice(0, 50).map(p => (
                            <div key={p.row} className={styles.previewRow}>
                                <div><strong>Row {p.row}</strong> — {p.item.employeeName} — {p.item.category} — {p.item.amount}</div>
                                {p.errors.length > 0 ? <div className={styles.previewErr}>{p.errors.join(", ")}</div> : <div className={styles.previewOk}>OK</div>}
                            </div>
                        ))}
                    </div>

                    <div className={styles.bulkActions}>
                        <button className={styles.btn} onClick={() => { setPreview([]); setErrors([]); }}>Clear</button>
                        <button className={styles.btnPrimary} onClick={() => onUpload(preview.filter(p => p.errors.length === 0).map(p => p.item))} disabled={preview.length === 0 || errors.length > 0}>Upload Valid Rows</button>
                    </div>
                </div>
            )}

            {errors.length > 0 && (
                <div className={styles.bulkErrors}>
                    <h4>Errors ({errors.length})</h4>
                    {errors.slice(0, 10).map((e, i) => <div key={i}>Row {e.row}: {e.errors ? e.errors.join(", ") : e.message}</div>)}
                </div>
            )}
        </div>
    );
}

/* ---------- ClaimDetails Drawer ---------- */
function ClaimDetails({ claim, onClose, onApprove, onReject }) {
    if (!claim) return null;
    return (
        <div className={styles.drawerBackdrop} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.drawerHeader}>
                    <h4>Claim {claim.id}</h4>
                    <div><strong>{formatCurrency(claim.amount, claim.currency)}</strong></div>
                </div>
                <div className={styles.drawerBody}>
                    <div><strong>Employee</strong>: {claim.employeeName} ({claim.employeeId})</div>
                    <div><strong>Category</strong>: {claim.category}</div>
                    <div><strong>Submitted</strong>: {new Date(claim.submittedAt).toLocaleString()}</div>
                    <div><strong>Status</strong>: {claim.status}</div>
                    <div><strong>Approver</strong>: {claim.approver || "—"}</div>
                    <div><strong>Notes</strong>: <div className={styles.notes}>{claim.notes}</div></div>
                    <div><strong>Attachments</strong>:
                        <ul>
                            {claim.attachments.length === 0 && <li>No attachments</li>}
                            {claim.attachments.map(a => <li key={a.id}>{a.name} <small>({Math.round(a.size / 1024)} KB)</small></li>)}
                        </ul>
                    </div>
                </div>

                <div className={styles.drawerActions}>
                    {claim.status === "Pending" && <>
                        <button className={styles.btn} onClick={() => onReject(claim.id)}>Reject</button>
                        <button className={styles.btnPrimary} onClick={() => onApprove(claim.id)}>Approve</button>
                    </>}
                    <button className={styles.btn} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Main page ---------- */
export default function PayrollReimbursements({navigate}) {
    const [claims, setClaims] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterEmployee, setFilterEmployee] = useState("");
    const [showNewModal, setShowNewModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerClaim, setDrawerClaim] = useState(null);
    const [toast, setToast] = useState(null);

    async function load() {
        setLoading(true);
        const resp = await api.fetchReimbursements({
            page,
            pageSize,
            filter: {
                status: filterStatus || undefined,
                category: filterCategory || undefined,
                employeeName: filterEmployee || undefined
            }
        });
        setClaims(resp.data);
        setTotal(resp.total);
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            setCategories(await api.fetchCategories());
            await load();
        })();
        // eslint-disable-next-line
    }, [page, filterStatus, filterCategory, filterEmployee]);

    async function handleSubmitClaim(form) {
        const resp = await api.submitReimbursement(form);
        if (resp.ok) {
            setToast({ type: "success", msg: "Claim submitted" });
            setShowNewModal(false);
            setPage(1);
            await load();
        } else {
            setToast({ type: "error", msg: "Failed to submit" });
        }
        setTimeout(() => setToast(null), 2000);
    }

    async function handleUploadBulk(list) {
        const resp = await api.bulkUploadClaims(list);
        if (resp.ok) {
            setToast({ type: "success", msg: `Uploaded ${resp.created.length} claims` });
            await load();
        } else {
            setToast({ type: "error", msg: "Upload failed" });
        }
        setTimeout(() => setToast(null), 2000);
    }

    async function handleApprove(id) {
        const resp = await api.updateClaimStatus(id, "Approved", "Auto-Approver");
        if (resp.ok) {
            setToast({ type: "success", msg: "Claim approved" });
            setDrawerClaim(resp.claim);
            await load();
        } else {
            setToast({ type: "error", msg: resp.message || "Approve failed" });
        }
        setTimeout(() => setToast(null), 1500);
    }

    async function handleReject(id) {
        const resp = await api.updateClaimStatus(id, "Rejected", "Auto-Approver");
        if (resp.ok) {
            setToast({ type: "success", msg: "Claim rejected" });
            setDrawerClaim(resp.claim);
            await load();
        } else {
            setToast({ type: "error", msg: resp.message || "Reject failed" });
        }
        setTimeout(() => setToast(null), 1500);
    }

    async function handleExportCSV() {
        const resp = await api.exportClaimsCSV({ filter: { status: filterStatus || undefined, category: filterCategory || undefined } });
        if (resp.ok) {
            const blob = new Blob([resp.csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `reimbursements_${Date.now()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            setToast({ type: "success", msg: "Exported CSV" });
            setTimeout(() => setToast(null), 1500);
        }
    }

    // summary totals
    const totals = claims.reduce((acc, c) => {
        acc.totalCount = acc.totalCount + 1;
        acc.totalAmount = acc.totalAmount + Number(c.amount || 0);
        acc.byStatus[c.status] = (acc.byStatus[c.status] || 0) + 1;
        return acc;
    }, { totalCount: 0, totalAmount: 0, byStatus: {} });

    return (

        <>
            <p className="path">
                <span onClick={() => navigate("/payroll")}>Payroll</span>{" "}
                <i className="bi bi-chevron-right"></i> Reimbursements
            </p>
            <div className={styles.page}>
                <div className={styles.headerRow}>
                    <h2>Reimbursements</h2>
                    <div className={styles.headerActions}>
                        <button className={styles.btn} onClick={() => setShowNewModal(true)}>New Claim</button>
                        <button className={styles.btn} onClick={() => document.getElementById("bulk-upload-btn")?.click()}>Bulk Upload (CSV)</button>
                        <input id="bulk-upload-btn" type="file" accept=".csv" onChange={(e) => {
                            // forward to BulkUpload dynamic render
                            // We'll open BulkUpload inline in a small modal area by setting a temporary ref - simpler: download file contents and parse here and call API
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                                // reuse BulkUpload parsing: simple CSV parse
                                const lines = reader.result.split(/\r?\n/).filter(Boolean);
                                if (lines.length < 2) { setToast({ type: "error", msg: "CSV must have header + at least 1 row" }); setTimeout(() => setToast(null), 1500); return; }
                                const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
                                const rows = lines.slice(1).map(l => {
                                    const cols = l.split(",").map(c => c.trim());
                                    const obj = {};
                                    headers.forEach((h, i) => obj[h] = cols[i] || "");
                                    return obj;
                                });
                                // Map to API payload
                                const parsed = rows.map(r => ({
                                    employeeName: r["employee name"] || r["employee_name"] || r["employee"],
                                    category: r["category"],
                                    amount: Number(r["amount"] || 0),
                                    notes: r["notes"] || "",
                                    currency: r["currency"] || "INR"
                                }));
                                // do client side validation
                                const valid = parsed.filter(p => p.employeeName && p.category && p.amount > 0);
                                if (valid.length === 0) { setToast({ type: "error", msg: "No valid rows in CSV" }); setTimeout(() => setToast(null), 1500); return; }
                                const res = await api.bulkUploadClaims(valid);
                                if (res.ok) { setToast({ type: "success", msg: `Uploaded ${res.created.length} claims` }); await load(); setTimeout(() => setToast(null), 1500); }
                            };
                            reader.readAsText(f);
                            e.target.value = "";
                        }} style={{ display: "none" }} />
                        <button className={styles.btn} onClick={handleExportCSV}>Export CSV</button>
                    </div>
                </div>

                <div className={styles.filters}>
                    <div>
                        Status:
                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        Category:
                        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
                            <option value="">All</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        Employee:
                        <input placeholder="Search employee" value={filterEmployee} onChange={e => { setFilterEmployee(e.target.value); setPage(1); }} />
                    </div>
                </div>

                <div className={styles.summaryStrip}>
                    <div>Total claims (page): <strong>{totals.totalCount}</strong></div>
                    <div>Total amount (page): <strong>{formatCurrency(totals.totalAmount)}</strong></div>
                    <div>Pending: <strong>{totals.byStatus["Pending"] || 0}</strong></div>
                    <div>Approved: <strong>{totals.byStatus["Approved"] || 0}</strong></div>
                    <div>Rejected: <strong>{totals.byStatus["Rejected"] || 0}</strong></div>
                </div>

                <div className={styles.tableWrap}>
                    {loading ? <div>Loading...</div> : (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Employee</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th>Approver</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {claims.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.employeeName}</td>
                                            <td>{c.category}</td>
                                            <td>{formatCurrency(c.amount, c.currency)}</td>
                                            <td>{new Date(c.submittedAt).toLocaleDateString()}</td>
                                            <td><span className={styles.statusTag + " " + styles["status_" + c.status.toLowerCase()]}>{c.status}</span></td>
                                            <td>{c.approver || "-"}</td>
                                            <td>
                                                <button className={styles.smallBtn} onClick={() => setDrawerClaim(c)}>View</button>
                                                {c.status === "Pending" && <button className={styles.smallBtn} onClick={async () => { await handleApprove(c.id); }}>Approve</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className={styles.pager}>
                                <button className={styles.btn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                                <div>Page {page}</div>
                                <button className={styles.btn} onClick={() => setPage(p => p + 1)} disabled={claims.length < pageSize}>Next</button>
                            </div>
                        </>
                    )}
                </div>

                {showNewModal && <NewClaimForm categories={categories} onSubmit={handleSubmitClaim} onClose={() => setShowNewModal(false)} />}

                {drawerClaim && <ClaimDetails claim={drawerClaim} onClose={() => setDrawerClaim(null)} onApprove={handleApprove} onReject={handleReject} />}

                {toast && <div className={styles.toast + " " + (toast.type === "success" ? styles.toastSuccess : styles.toastError)}>{toast.msg}</div>}
            </div>
        </>
    );
}

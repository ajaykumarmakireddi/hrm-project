// src/pages/PayrollEmployeeAssignment.jsx
import React, { useEffect, useState, useRef } from "react";
import styles from "./PayrollEmployeeAssignment.module.css";

/*
Employee Salary Assignment page
Implements features from payroll_employeeAssignment.pdf:
- Employee assignment list (table) with filters and actions
- Create / Edit Assignment modal with:
  - Employee selection (auto-fill), structure assignment (version), effective dates
  - Base salary entry and toggles for CTC calculation
  - Component preview (read-only recalculation)
  - Overrides table (optional)
  - Additional salary items (one-time / monthly)
  - Legal/statutory settings, payment settings
  - CTC & Net Salary preview (live)
  - Versioning history & revision actions
- Validation rules and user actions (Save Draft, Publish, Clone, Download CTC)
This uses an in-file mock API for demo; replace with real API later.
*/

/* ---------------- Mock API ------------------ */
const mockDB = {
    employees: [
        { id: "E001", name: "Aarti Sharma", dept: "HR", designation: "Manager", location: "Bangalore", basic: 40000 },
        { id: "E002", name: "Ravi Kumar", dept: "Engineering", designation: "SDE II", location: "Hyderabad", basic: 35000 },
        { id: "E003", name: "Sonia Verma", dept: "Sales", designation: "Associate", location: "Mumbai", basic: 25000 },
    ],
    structures: [
        { id: "S1", name: "Default Structure", versions: [{ v: "v1", components: [{ name: "Basic", type: "Earning", calc: "Fixed", value: "basic" }, { name: "HRA", type: "Earning", calc: "%basic", value: 20 }, { name: "PF", type: "Deduction", calc: "%basic", value: 12 }] }] },
        { id: "S2", name: "Sales Structure", versions: [{ v: "v1", components: [{ name: "Basic", type: "Earning", calc: "Fixed", value: "basic" }, { name: "Commission", type: "Earning", calc: "Formula", value: "target*0.02" }, { name: "PF", type: "Deduction", calc: "%basic", value: 12 }] }] },
    ],
    assignments: [
        // sample assignment
        {
            id: "A-1001",
            employeeId: "E001",
            employeeName: "Aarti Sharma",
            department: "HR",
            designation: "Manager",
            structureId: "S1",
            structureVersion: "v1",
            effectiveFrom: "2025-11-01",
            effectiveTo: null,
            baseSalary: 40000,
            calculateCTCFromBase: true,
            overrides: [],
            additionalItems: [],
            statutory: { PF: true, ESI: false, pension: true, taxRegion: "IN-01" },
            payment: { method: "Bank Transfer", bankName: "HDFC", accountNumber: "****1234", ifsc: "HDFC0000" },
            status: "Active",
            history: [
                { version: 1, effectiveFrom: "2024-11-01", effectiveTo: null, changedBy: "Admin", summary: "Initial Assignment" },
            ],
            notes: "",
        },
    ],
};

function delay(ms = 150) {
    return new Promise((res) => setTimeout(res, ms));
}

const api = {
    async fetchEmployees() { await delay(); return mockDB.employees.slice(); },
    async fetchStructures() { await delay(); return mockDB.structures.slice(); },
    async fetchAssignments({ filter = {} } = {}) {
        await delay();
        let list = mockDB.assignments.slice();
        if (filter.department) list = list.filter(a => a.department === filter.department);
        if (filter.status) list = list.filter(a => a.status === filter.status);
        if (filter.employee) list = list.filter(a => a.employeeName.toLowerCase().includes(filter.employee.toLowerCase()));
        return list;
    },
    async fetchAssignmentById(id) { await delay(); return mockDB.assignments.find(a => a.id === id) || null; },
    async saveAssignment(payload) {
        await delay();
        if (!payload.id) {
            // create
            const id = `A-${Math.floor(Math.random() * 9000) + 1000}`;
            const rec = { ...payload, id };
            mockDB.assignments.unshift(rec);
            return { ok: true, assignment: rec };
        } else {
            const idx = mockDB.assignments.findIndex(a => a.id === payload.id);
            if (idx >= 0) { mockDB.assignments[idx] = { ...payload }; return { ok: true, assignment: mockDB.assignments[idx] }; }
            return { ok: false, message: "Not found" };
        }
    },
    async exportAssignmentPDF(id) {
        await delay();
        // return fake blob text
        return { ok: true, pdf: `CTC Document for ${id}` };
    }
};

/* ---------------- Helpers ------------------ */
const currency = (n) => `₹ ${Number(n || 0).toLocaleString()}`;
const todayIso = () => new Date().toISOString().slice(0, 10);

/* calc helper: derive components from structure and base */
function computeComponents(structure, version, baseSalary, overrides = [], additionalItems = []) {
    // structure: { versions: [{v, components: [{name, type, calc, value}]}] }
    const ver = (structure?.versions || []).find(v => v.v === version) || (structure?.versions || [])[0] || null;
    const comps = [];
    if (!ver) return { comps: [], monthlyTotal: 0, annualCTC: 0, netSalary: 0 };
    ver.components.forEach(c => {
        let val = 0;
        if (c.calc === "Fixed") {
            val = typeof c.value === "number" ? c.value : Number(c.value) || 0;
        } else if (c.calc === "%basic") {
            val = Math.round((Number(baseSalary || 0) * Number(c.value || 0)) / 100);
        } else if (c.calc === "basic") {
            val = Number(baseSalary || 0);
        } else if (c.calc === "Formula") {
            // keep simple: formula not computed
            val = 0;
        }
        comps.push({ name: c.name, type: c.type, value: val });
    });
    // apply overrides
    overrides.forEach(o => {
        const idx = comps.findIndex(x => x.name === o.name);
        if (idx >= 0) comps[idx].value = o.overrideValue;
        else comps.push({ name: o.name, type: o.type || "Earning", value: o.overrideValue });
    });
    // additional items (one-time not included in monthly CT C unless monthly)
    additionalItems.forEach(ai => {
        if (ai.occurrence === "Monthly") comps.push({ name: ai.name, type: ai.type === "Earning" ? "Earning" : "Deduction", value: ai.amount });
    });
    const monthlyTotal = comps.reduce((s, c) => s + (c.type === "Earning" ? c.value : -c.value), 0);
    const employerContrib = 0; // simplified
    const annualCTC = Math.round((monthlyTotal + employerContrib) * 12);
    const netSalary = monthlyTotal; // simplified: gross - deductions applied already
    return { comps, monthlyTotal, annualCTC, netSalary };
}

/* ---------------- Reusable small components ------------------ */
const Badge = ({ children, type = "info" }) => <span className={`${styles.badge} ${styles["badge_" + type]}`}>{children}</span>;

/* ---------------- New/Edit Modal ------------------ */
function AssignmentModal({ open, initial = null, employees, structures, onClose, onSave }) {
    const [form, setForm] = useState(() => initial ? ({ ...initial }) : {
        employeeId: "",
        employeeName: "",
        department: "",
        designation: "",
        structureId: structures?.[0]?.id || "",
        structureVersion: structures?.[0]?.versions?.[0]?.v || "",
        effectiveFrom: todayIso(),
        effectiveTo: "",
        baseSalary: 0,
        calculateCTCFromBase: true,
        overrides: [],
        additionalItems: [],
        statutory: { PF: true, ESI: false, pension: false, taxRegion: "" },
        payment: { method: "Bank Transfer", bankName: "", accountNumber: "", ifsc: "", accountHolder: "" },
        status: "Draft",
        notes: "",
        history: [],
    });
    const [errors, setErrors] = useState({});
    const fileRef = useRef();

    useEffect(() => {
        if (initial) setForm({ ...initial });
        // eslint-disable-next-line
    }, [initial]);

    // autofill when employeeId chosen
    function onEmployeeChange(eid) {
        const emp = employees.find(e => e.id === eid);
        setForm(f => ({
            ...f,
            employeeId: emp?.id || "",
            employeeName: emp?.name || "",
            department: emp?.dept || "",
            designation: emp?.designation || "",
            baseSalary: emp?.basic || f.baseSalary,
        }));
    }

    function validate() {
        const e = {};
        if (!form.employeeName) e.employeeName = "Employee is required";
        if (!form.structureId) e.structureId = "Choose a salary structure";
        if (!form.effectiveFrom) e.effectiveFrom = "Effective from is required";
        if (!form.baseSalary || Number(form.baseSalary) <= 0) e.baseSalary = "Base salary must be > 0";
        // date overlap check omitted in mock
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function addOverride() {
        setForm(f => ({ ...f, overrides: f.overrides.concat({ id: Date.now(), name: "", overrideType: "Fixed", overrideValue: 0, notes: "" }) }));
    }
    function removeOverride(idx) {
        setForm(f => ({ ...f, overrides: f.overrides.filter((_, i) => i !== idx) }));
    }
    function updateOverride(idx, key, value) {
        setForm(f => ({ ...f, overrides: f.overrides.map((o, i) => i === idx ? { ...o, [key]: value } : o) }));
    }

    function addAdditional() {
        setForm(f => ({ ...f, additionalItems: f.additionalItems.concat({ id: Date.now(), name: "", type: "Earning", amount: 0, occurrence: "One-time", effectiveMonth: "" }) }));
    }
    function removeAdditional(idx) {
        setForm(f => ({ ...f, additionalItems: f.additionalItems.filter((_, i) => i !== idx) }));
    }
    function updateAdditional(idx, key, value) {
        setForm(f => ({ ...f, additionalItems: f.additionalItems.map((a, i) => i === idx ? { ...a, [key]: value } : a) }));
    }

    async function submit(e) {
        e && e.preventDefault();
        if (!validate()) return;
        // append history entry
        const change = { version: (form.history?.length || 0) + 1, effectiveFrom: form.effectiveFrom, effectiveTo: form.effectiveTo || null, changedBy: "You", summary: form.notes || "Assignment created/edited" };
        const payload = { ...form, history: (form.history || []).concat(change) };
        const res = await api.saveAssignment(payload);
        if (res.ok) {
            onSave(res.assignment);
            onClose();
        } else {
            alert("Failed to save");
        }
    }

    const selectedStructure = structures.find(s => s.id === form.structureId);
    const { comps, monthlyTotal, annualCTC, netSalary } = computeComponents(selectedStructure, form.structureVersion, form.baseSalary, form.overrides, form.additionalItems);

    if (!open) return null;
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <form className={styles.centerModal} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
                <div className={styles.modalHeader}>
                    <h3>{form.id ? `Edit Assignment ${form.id}` : "Create Salary Assignment"}</h3>
                    <div className={styles.modalHeaderRight}>
                        <span className={styles.subtle}>Status: <strong>{form.status}</strong></span>
                        <button type="button" className={styles.iconClose} onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.leftCol}>
                        <label className={styles.label}>Employee</label>
                        <select value={form.employeeId} onChange={(e) => onEmployeeChange(e.target.value)} className={styles.input}>
                            <option value="">Select employee</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} — {emp.id}</option>)}
                        </select>
                        {errors.employeeName && <div className={styles.fieldError}>{errors.employeeName}</div>}

                        <label className={styles.label}>Employee Code (auto)</label>
                        <input className={styles.input} value={form.employeeId} readOnly />

                        <label className={styles.label}>Department</label>
                        <input className={styles.input} value={form.department} readOnly />

                        <label className={styles.label}>Designation</label>
                        <input className={styles.input} value={form.designation} readOnly />

                        <hr />

                        <label className={styles.label}>Salary Structure</label>
                        <select className={styles.input} value={form.structureId} onChange={e => setForm(f => ({ ...f, structureId: e.target.value, structureVersion: (structures.find(s => s.id === e.target.value)?.versions[0].v) || "" }))}>
                            <option value="">Choose structure</option>
                            {structures.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.structureId && <div className={styles.fieldError}>{errors.structureId}</div>}

                        <label className={styles.label}>Version</label>
                        <select className={styles.input} value={form.structureVersion} onChange={e => setForm(f => ({ ...f, structureVersion: e.target.value }))}>
                            {(structures.find(s => s.id === form.structureId)?.versions || []).map(v => <option key={v.v} value={v.v}>{v.v}</option>)}
                        </select>

                        <div className={styles.row}>
                            <div>
                                <label className={styles.label}>Effective From</label>
                                <input type="date" className={styles.input} value={form.effectiveFrom} onChange={e => setForm(f => ({ ...f, effectiveFrom: e.target.value }))} />
                                {errors.effectiveFrom && <div className={styles.fieldError}>{errors.effectiveFrom}</div>}
                            </div>
                            <div>
                                <label className={styles.label}>Effective To (optional)</label>
                                <input type="date" className={styles.input} value={form.effectiveTo || ""} onChange={e => setForm(f => ({ ...f, effectiveTo: e.target.value }))} />
                            </div>
                        </div>

                        <hr />

                        <label className={styles.label}>Base Salary (Basic Pay)</label>
                        <input type="number" className={styles.input} value={form.baseSalary} onChange={e => setForm(f => ({ ...f, baseSalary: Number(e.target.value) }))} />
                        {errors.baseSalary && <div className={styles.fieldError}>{errors.baseSalary}</div>}

                        <label className={styles.label}><input type="checkbox" checked={form.calculateCTCFromBase} onChange={e => setForm(f => ({ ...f, calculateCTCFromBase: e.target.checked }))} /> Calculate CTC from Base</label>

                        <label className={styles.label}>Notes</label>
                        <textarea className={styles.input} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}></textarea>

                        <div className={styles.actionRow}>
                            <button type="button" className={styles.btn} onClick={() => { setForm(f => ({ ...f, status: "Draft" })); alert("Saved draft locally (simulate)") }}>Save Draft</button>
                            <button type="button" className={styles.btn} onClick={() => { setForm(f => ({ ...f, status: "Published" })); alert("Published (simulate)") }}>Publish Assignment</button>
                            <button type="submit" className={styles.btnPrimary}>Save & Close</button>
                        </div>
                    </div>

                    <div className={styles.rightCol}>
                        <h4>Component Preview</h4>
                        <div className={styles.previewBox}>
                            <table className={styles.previewTable}>
                                <thead><tr><th>Component</th><th>Type</th><th>Monthly</th></tr></thead>
                                <tbody>
                                    {comps.map((c, i) => (
                                        <tr key={i}>
                                            <td>{c.name}</td>
                                            <td>{c.type}</td>
                                            <td>{currency(c.value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr><td colSpan="2"><strong>Monthly Total</strong></td><td><strong>{currency(monthlyTotal)}</strong></td></tr>
                                    <tr><td colSpan="2">Annual CTC (est.)</td><td>{currency(annualCTC)}</td></tr>
                                    <tr><td colSpan="2">Net Salary (est.)</td><td>{currency(netSalary)}</td></tr>
                                </tfoot>
                            </table>
                        </div>

                        <hr />

                        <h4>Overrides (optional)</h4>
                        <div>
                            <button type="button" className={styles.smallBtn} onClick={addOverride}>Add Override</button>
                            <div className={styles.overrideList}>
                                {form.overrides.map((o, idx) => (
                                    <div key={o.id} className={styles.overrideRow}>
                                        <input className={styles.inputSmall} placeholder="Component name" value={o.name} onChange={e => updateOverride(idx, "name", e.target.value)} />
                                        <select className={styles.inputSmall} value={o.overrideType} onChange={e => updateOverride(idx, "overrideType", e.target.value)}>
                                            <option value="Fixed">Fixed</option>
                                            <option value="Percentage">Percentage</option>
                                        </select>
                                        <input className={styles.inputSmall} type="number" value={o.overrideValue} onChange={e => updateOverride(idx, "overrideValue", Number(e.target.value))} />
                                        <button className={styles.removeSmall} type="button" onClick={() => removeOverride(idx)}>Remove</button>
                                    </div>
                                ))}
                                {form.overrides.length === 0 && <div className={styles.muted}>No overrides</div>}
                            </div>
                        </div>

                        <hr />

                        <h4>Additional Salary Items</h4>
                        <button type="button" className={styles.smallBtn} onClick={addAdditional}>Add Item</button>
                        <div className={styles.overrideList}>
                            {form.additionalItems.map((a, idx) => (
                                <div key={a.id} className={styles.overrideRow}>
                                    <input className={styles.inputSmall} placeholder="Item name" value={a.name} onChange={e => updateAdditional(idx, "name", e.target.value)} />
                                    <select className={styles.inputSmall} value={a.type} onChange={e => updateAdditional(idx, "type", e.target.value)}>
                                        <option>Earning</option><option>Deduction</option>
                                    </select>
                                    <input className={styles.inputSmall} type="number" value={a.amount} onChange={e => updateAdditional(idx, "amount", Number(e.target.value))} />
                                    <select className={styles.inputSmall} value={a.occurrence} onChange={e => updateAdditional(idx, "occurrence", e.target.value)}>
                                        <option>One-time</option><option>Monthly</option>
                                    </select>
                                    <button className={styles.removeSmall} onClick={() => removeAdditional(idx)}>Remove</button>
                                </div>
                            ))}
                            {form.additionalItems.length === 0 && <div className={styles.muted}>No additional items</div>}
                        </div>

                        <hr />

                        <h4>Legal & Payment Settings</h4>
                        <label className={styles.label}><input type="checkbox" checked={form.statutory.PF} onChange={e => setForm(f => ({ ...f, statutory: { ...f.statutory, PF: e.target.checked } }))} /> PF enabled</label>
                        <label className={styles.label}><input type="checkbox" checked={form.statutory.ESI} onChange={e => setForm(f => ({ ...f, statutory: { ...f.statutory, ESI: e.target.checked } }))} /> ESI enabled</label>
                        <label className={styles.label}>Tax Region</label>
                        <input className={styles.input} value={form.statutory.taxRegion} onChange={e => setForm(f => ({ ...f, statutory: { ...f.statutory, taxRegion: e.target.value } }))} />
                        <label className={styles.label}>Payment Method</label>
                        <select className={styles.input} value={form.payment.method} onChange={e => setForm(f => ({ ...f, payment: { ...f.payment, method: e.target.value } }))}>
                            <option>Bank Transfer</option><option>Cheque</option><option>Cash</option><option>Wallet</option>
                        </select>
                        <label className={styles.label}>Bank Name</label><input className={styles.input} value={form.payment.bankName} onChange={e => setForm(f => ({ ...f, payment: { ...f.payment, bankName: e.target.value } }))} />
                        <label className={styles.label}>Account Number</label><input className={styles.input} value={form.payment.accountNumber} onChange={e => setForm(f => ({ ...f, payment: { ...f.payment, accountNumber: e.target.value } }))} />
                    </div>
                </div>
            </form>
        </div>
    );
}

/* ---------------- History Drawer (read-only) ---------------- */
function HistoryDrawer({ open, assignment, onClose }) {
    if (!open || !assignment) return null;
    return (
        <div className={styles.drawerBackdrop} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.drawerHeader}>
                    <h4>Version History — {assignment.employeeName}</h4>
                    <button className={styles.iconClose} onClick={onClose}>✕</button>
                </div>
                <div className={styles.drawerBody}>
                    <table className={styles.table}>
                        <thead><tr><th>Version</th><th>Effective From</th><th>Effective To</th><th>Changed By</th><th>Summary</th></tr></thead>
                        <tbody>
                            {(assignment.history || []).map(h => (
                                <tr key={h.version}><td>{h.version}</td><td>{h.effectiveFrom}</td><td>{h.effectiveTo || "—"}</td><td>{h.changedBy}</td><td>{h.summary}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: 12 }}>
                        <button className={styles.btn} onClick={() => alert("Download CTC letter (simulate)")}>Download CTC Letter</button>
                        <button className={styles.btn} onClick={() => alert("Export as PDF (simulate)")}>Export Assignment as PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Main Page ---------------- */
export default function PayrollEmployeeAssignment({navigate}) {
    const [employees, setEmployees] = useState([]);
    const [structures, setStructures] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDept, setFilterDept] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterEmployee, setFilterEmployee] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInitial, setModalInitial] = useState(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [toast, setToast] = useState(null);

    async function loadAll() {
        setLoading(true);
        const em = await api.fetchEmployees();
        const st = await api.fetchStructures();
        const as = await api.fetchAssignments({ filter: { department: filterDept, status: filterStatus, employee: filterEmployee } });
        setEmployees(em); setStructures(st); setAssignments(as);
        setLoading(false);
    }

    useEffect(() => { loadAll(); }, [filterDept, filterStatus, filterEmployee]);

    function openNew() { setModalInitial(null); setModalOpen(true); }
    async function onSaveAssignment(a) { setToast("Saved assignment"); setTimeout(() => setToast(null), 1500); await loadAll(); }

    return (
        <>
            <p className="path">
                <span onClick={() => navigate("/payroll")}>Payroll</span>{" "}
                <i className="bi bi-chevron-right"></i> Salary Assignment
            </p>
            <div className={styles.page}>
                <div className={styles.headerRow}>
                    <h2>Employee Salary Assignment</h2>
                    <div className={styles.headerActions}>
                        <button className={styles.btn} onClick={openNew}>Create Assignment</button>
                        <button className={styles.btn} onClick={() => alert("Bulk Assign (simulate)")}>Bulk Assign</button>
                        <button className={styles.btn} onClick={() => alert("Import (CSV/XLSX) (simulate)")}>Import Assignments</button>
                        <button className={styles.btn} onClick={() => alert("Export Assignments (simulate)")}>Export Assignments</button>
                    </div>
                </div>

                <div className={styles.filters}>
                    <div>
                        Department:
                        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                            <option value="">All</option>
                            {[...new Set(employees.map(e => e.dept))].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        Status:
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">All</option>
                            <option>Active</option><option>Draft</option><option>Expired</option>
                        </select>
                    </div>
                    <div>
                        Search Employee:
                        <input placeholder="Name or code" value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} />
                    </div>
                </div>

                <div className={styles.tableWrap}>
                    {loading ? <div className={styles.loading}>Loading...</div> : (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Employee</th><th>Code</th><th>Department</th><th>Designation</th><th>Structure</th><th>Effective From</th><th>Effective To</th><th>Status</th><th>CTC(yr)</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.length === 0 && (<tr><td colSpan="10">No assignments</td></tr>)}
                                    {assignments.map(a => {
                                        const struct = structures.find(s => s.id === a.structureId);
                                        const { annualCTC } = computeComponents(struct, a.structureVersion, a.baseSalary, a.overrides, a.additionalItems);
                                        return (
                                            <tr key={a.id}>
                                                <td>{a.employeeName}</td>
                                                <td>{a.employeeId}</td>
                                                <td>{a.department}</td>
                                                <td>{a.designation}</td>
                                                <td>{struct?.name || "—"} / {a.structureVersion}</td>
                                                <td>{a.effectiveFrom}</td>
                                                <td>{a.effectiveTo || "—"}</td>
                                                <td><Badge type={a.status === "Active" ? "success" : a.status === "Draft" ? "info" : "danger"}>{a.status}</Badge></td>
                                                <td>{currency(annualCTC)}</td>
                                                <td>
                                                    <button className={styles.smallBtn} onClick={async () => { const full = await api.fetchAssignmentById(a.id); setModalInitial(full); setModalOpen(true); }}>Edit</button>
                                                    <button className={styles.smallBtn} onClick={async () => { const full = await api.fetchAssignmentById(a.id); setActiveAssignment(full); setHistoryOpen(true); }}>History</button>
                                                    <button className={styles.smallBtn} onClick={async () => { const res = await api.exportAssignmentPDF(a.id); if (res.ok) { setToast("Downloaded CTC (simulate)"); setTimeout(() => setToast(null), 1200); } }}>CTC</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>

                {modalOpen && <AssignmentModal open={modalOpen} initial={modalInitial} employees={employees} structures={structures} onClose={() => { setModalOpen(false); setModalInitial(null); }} onSave={onSaveAssignment} />}
                {historyOpen && <HistoryDrawer open={historyOpen} assignment={activeAssignment} onClose={() => { setHistoryOpen(false); setActiveAssignment(null); }} />}

                {toast && <div className={styles.toast}>{toast}</div>}
            </div>
        </>
    );
}

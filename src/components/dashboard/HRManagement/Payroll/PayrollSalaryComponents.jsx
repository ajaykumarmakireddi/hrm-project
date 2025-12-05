// src/pages/PayrollSalaryComponents.jsx
import React, { useEffect, useState, useRef } from "react";
import styles from "./PayrollSalaryComponents.module.css";

/*
Payroll Salary Components Module
Features:
- Header toolbar (create/import/export, country selector, component groups)
- Category tabs (Earnings, Deductions, Reimbursements, Employer Contributions, Tax Components, Custom)
- Table per category with full columns from PDF (page 4-5)
- Create/Edit Component centered modal with sections described on PDF (page 5)
- Calculation modes support (Fixed, %base, %gross, Formula, Slab, Attendance-linked, Prorated, One-time)
- Taxation settings, statutory config region-wise, behavior toggles (page 6-8)
- Component Details modal (page 9)
- CSV import/export, preview & validation
- Mock API in-file
- Simple validation engine & formula checker stub (detect simple circular refs)
*/

// -------------------- Mock API --------------------
const mockDB = {
    countries: ["India", "USA", "UK", "UAE"],
    groups: ["Allowances", "Bonuses", "Reimbursements", "Employer Contributions", "Tax Components", "Custom"],
    components: [
        {
            id: "C-1001",
            name: "Basic Pay",
            code: "BASIC",
            category: "Earnings",
            subCategory: "Fixed",
            countries: ["India", "USA"],
            calcMode: "Fixed",
            calcValue: 0,
            taxable: true,
            statutoryLink: null,
            visibility: "Payslip",
            status: "Active",
            behavior: { proration: true, includedInGross: true, includedInCTC: true, lockAfterCycle: true, carryForward: false },
            createdAt: new Date().toISOString(),
            history: []
        },
        {
            id: "C-1002",
            name: "HRA",
            code: "HRA",
            category: "Earnings",
            subCategory: "Allowance",
            countries: ["India"],
            calcMode: "%base",
            calcValue: 40,
            taxable: false,
            statutoryLink: null,
            visibility: "Payslip",
            status: "Active",
            behavior: { proration: true, includedInGross: true, includedInCTC: true, lockAfterCycle: false, carryForward: false },
            createdAt: new Date().toISOString(),
            history: []
        },
        {
            id: "C-2001",
            name: "Employee PF",
            code: "PF_EMP",
            category: "Deductions",
            subCategory: "Statutory",
            countries: ["India"],
            calcMode: "%basic",
            calcValue: 12,
            taxable: false,
            statutoryLink: "PF",
            visibility: "Breakdown",
            status: "Active",
            behavior: { proration: true, includedInGross: false, includedInCTC: true, lockAfterCycle: true, carryForward: false },
            createdAt: new Date().toISOString(),
            history: []
        },
    ]
};

function mockDelay(ms = 120) { return new Promise(res => setTimeout(res, ms)); }

const api = {
    async listCountries() { await mockDelay(); return mockDB.countries.slice(); },
    async listGroups() { await mockDelay(); return mockDB.groups.slice(); },
    async listComponents(filter = {}) {
        await mockDelay();
        let list = mockDB.components.slice();
        if (filter.country) list = list.filter(c => c.countries.includes(filter.country));
        if (filter.category) list = list.filter(c => c.category === filter.category);
        if (filter.search) list = list.filter(c => c.name.toLowerCase().includes(filter.search.toLowerCase()) || c.code.toLowerCase().includes(filter.search.toLowerCase()));
        return { ok: true, data: list };
    },
    async createComponent(payload) {
        await mockDelay();
        const id = `C-${Math.floor(Math.random() * 900000) + 1000}`;
        const rec = { ...payload, id, createdAt: new Date().toISOString(), history: [] };
        mockDB.components.unshift(rec);
        return { ok: true, component: rec };
    },
    async updateComponent(id, payload) {
        await mockDelay();
        const idx = mockDB.components.findIndex(c => c.id === id);
        if (idx === -1) return { ok: false, message: "Not found" };
        const updated = { ...mockDB.components[idx], ...payload, history: (mockDB.components[idx].history || []).concat({ changedAt: new Date().toISOString(), note: payload.note || "Updated" }) };
        mockDB.components[idx] = updated;
        return { ok: true, component: updated };
    },
    async exportCSV(list) {
        await mockDelay();
        const header = ["id", "name", "code", "category", "subCategory", "countries", "calcMode", "calcValue", "taxable", "statutoryLink", "visibility", "status"].join(",");
        const rows = list.map(c => [
            c.id, c.name, c.code, c.category, c.subCategory || "", (c.countries || []).join("|"), c.calcMode, String(c.calcValue || ""), c.taxable ? "Yes" : "No", c.statutoryLink || "", c.visibility, c.status
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
        return header + "\n" + rows.join("\n");
    }
};

// -------------------- Helpers --------------------
const uniqueCode = (name) => name.trim().toUpperCase().replace(/\s+/g, "_").slice(0, 20);
const nowDate = () => new Date().toISOString();
const calcModes = ["Fixed", "%base", "%gross", "Formula", "Conditional", "Slab", "Attendance", "Prorated", "One-time"];

// Very small safe formula checker (no eval) - supports simple tokens and SUM()
function checkFormulaSyntax(expr) {
    if (!expr || String(expr).trim() === "") return { ok: true };
    const invalidChars = /[^\d\w\s\+\-\*\/\(\),\.\%]/;
    if (invalidChars.test(expr)) return { ok: false, error: "Formula contains unsupported characters" };
    // basic parentheses balance
    let bal = 0;
    for (let ch of expr) {
        if (ch === "(") bal++; if (ch === ")") bal--;
        if (bal < 0) return { ok: false, error: "Mismatched parentheses" };
    }
    if (bal !== 0) return { ok: false, error: "Mismatched parentheses" };
    return { ok: true };
}

// Simple circular dependency check stub: ensure no direct references to same code
function detectCircularDependencies(components) {
    // in real system: build graph from formulas; here just a stub that passes
    return { ok: true, cycles: [] };
}

// -------------------- UI Components --------------------

function HeaderToolbar({ country, setCountry, onCreate, onImportClick, onExportAll, groups }) {
    return (
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <h2 className={styles.title}>Salary Components</h2>
                <div className={styles.toolbarMeta}>
                    <label className={styles.smallLabel}>Country</label>
                    <select className={styles.countrySelect} value={country} onChange={e => setCountry(e.target.value)}>
                        <option value="">All</option>
                        {mockDB.countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className={styles.headerRight}>
                <div className={styles.groupSelect}>
                    <label className={styles.smallLabel}>Component Groups</label>
                    <select>
                        <option value="">All Groups</option>
                        {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                <button className={styles.btn} onClick={onCreate}>Create Component</button>
                <label className={styles.btn}>
                    Import
                    <input type="file" accept=".csv" onChange={onImportClick} style={{ display: "none" }} />
                </label>
                <button className={styles.btn} onClick={onExportAll}>Export CSV</button>
            </div>
        </div>
    );
}

function CategoryTabs({ active, setActive }) {
    const tabs = ["Earnings", "Deductions", "Reimbursements", "Employer Contributions", "Tax Components", "Custom"];
    return (
        <div className={styles.tabs}>
            {tabs.map(t => (
                <button key={t} className={`${styles.tab} ${active === t ? styles.tabActive : ""}`} onClick={() => setActive(t)}>{t}</button>
            ))}
        </div>
    );
}

function ComponentsTable({ data, onView, onEdit, onDuplicate, onArchive }) {
    return (
        <div className={styles.tableWrap}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Component Name</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Calc Mode</th>
                        <th>Value</th>
                        <th>Taxable</th>
                        <th>Statutory</th>
                        <th>Visibility</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 && (<tr><td colSpan="10" className={styles.empty}>No components</td></tr>)}
                    {data.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.code}</td>
                            <td>{c.subCategory || c.category}</td>
                            <td>{c.calcMode}</td>
                            <td>{c.calcMode === "Fixed" ? c.calcValue : c.calcMode === "%base" || c.calcMode === "%gross" ? `${c.calcValue}%` : (c.calcMode === "Formula" ? "Formula" : String(c.calcValue || ""))}</td>
                            <td>{c.taxable ? "Yes" : "No"}</td>
                            <td>{c.statutoryLink || "—"}</td>
                            <td>{c.visibility}</td>
                            <td><span className={`${styles.statusTag} ${styles["status_" + c.status.toLowerCase()]}`}>{c.status}</span></td>
                            <td className={styles.actionsCell}>
                                <button className={styles.smallBtn} onClick={() => onView(c)}>View</button>
                                <button className={styles.smallBtn} onClick={() => onEdit(c)}>Edit</button>
                                <button className={styles.smallBtn} onClick={() => onDuplicate(c)}>Duplicate</button>
                                <button className={styles.smallBtn} onClick={() => onArchive(c)}>Archive</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Centered modal for create/edit component
function ComponentModal({ open, initial, onClose, onSave, countries }) {
    const [form, setForm] = useState(() => initial ? { ...initial } : {
        name: "", code: "", category: "Earnings", subCategory: "", countries: [], calcMode: "Fixed", calcValue: 0,
        taxable: true, statutoryLink: "", visibility: "Payslip", status: "Active",
        behavior: { proration: false, dependsOnAttendance: false, includedInGross: true, includedInCTC: true, showInPayslip: true, lockAfterCycle: false, carryForward: false },
        notes: ""
    });
    const [errors, setErrors] = useState({});
    useEffect(() => { if (initial) setForm({ ...initial }); else { setForm(f => ({ ...f, countries: [countries?.[0]].filter(Boolean) })); } }, [initial, countries]);

    function validate() {
        const e = {};
        if (!form.name || form.name.trim().length < 2) e.name = "Name required";
        if (!form.code) e.code = "Code required (auto)";
        if (!form.calcMode) e.calcMode = "Choose calculation mode";
        if ((form.calcMode === "Fixed" || form.calcMode.indexOf("%") >= 0) && (form.calcValue === "" || isNaN(Number(form.calcValue)))) e.calcValue = "Numeric value required";
        if (form.calcMode === "Formula") {
            const chk = checkFormulaSyntax(form.calcValue);
            if (!chk.ok) e.calcValue = chk.error || "Invalid formula";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submit(e) {
        e && e.preventDefault();
        if (!validate()) return;
        const payload = { ...form };
        if (!payload.code) payload.code = uniqueCode(payload.name);
        if (!payload.id) {
            const res = await api.createComponent(payload);
            if (res.ok) { onSave(res.component); onClose(); }
            else alert("Create failed");
        } else {
            const res = await api.updateComponent(payload.id, payload);
            if (res.ok) { onSave(res.component); onClose(); }
            else alert("Update failed");
        }
    }

    if (!open) return null;
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <form className={styles.modal} onClick={e => e.stopPropagation()} onSubmit={submit}>
                <div className={styles.modalHeader}>
                    <h3>{form.id ? `Edit Component — ${form.name}` : "Create Component"}</h3>
                    <div>
                        <button type="button" className={styles.btn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.btnPrimary}>{form.id ? "Save" : "Create"}</button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.leftCol}>
                        <label className={styles.label}>Component Name</label>
                        <input className={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value, code: uniqueCode(e.target.value) })} />
                        {errors.name && <div className={styles.fieldError}>{errors.name}</div>}

                        <label className={styles.label}>Component Code</label>
                        <input className={styles.input} value={form.code || uniqueCode(form.name)} onChange={e => setForm({ ...form, code: e.target.value })} />
                        {errors.code && <div className={styles.fieldError}>{errors.code}</div>}

                        <label className={styles.label}>Category</label>
                        <select className={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            <option>Earnings</option><option>Deductions</option><option>Reimbursements</option><option>Employer Contributions</option><option>Tax Components</option><option>Custom</option>
                        </select>

                        <label className={styles.label}>Sub-category</label>
                        <input className={styles.input} value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })} placeholder="e.g., Allowance, Bonus" />

                        <label className={styles.label}>Country applicability</label>
                        <div className={styles.chips}>
                            {countries.map(c => (
                                <label key={c} className={styles.chip}>
                                    <input type="checkbox" checked={(form.countries || []).includes(c)} onChange={e => {
                                        const checked = e.target.checked;
                                        setForm(f => ({ ...f, countries: checked ? [...(f.countries || []), c] : (f.countries || []).filter(x => x !== c) }));
                                    }} /> {c}
                                </label>
                            ))}
                        </div>

                        <hr />

                        <label className={styles.label}>Calculation Mode</label>
                        <select className={styles.input} value={form.calcMode} onChange={e => setForm({ ...form, calcMode: e.target.value })}>
                            {calcModes.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        {errors.calcMode && <div className={styles.fieldError}>{errors.calcMode}</div>}

                        <label className={styles.label}>Value / Formula</label>
                        <input className={styles.input} value={form.calcValue} onChange={e => setForm({ ...form, calcValue: e.target.value })} placeholder="Enter number or formula (if Formula mode)" />
                        {errors.calcValue && <div className={styles.fieldError}>{errors.calcValue}</div>}

                        <hr />

                        <label className={styles.label}>Taxable</label>
                        <select className={styles.input} value={form.taxable ? "Yes" : "No"} onChange={e => setForm({ ...form, taxable: e.target.value === "Yes" })}>
                            <option value="Yes">Yes</option><option value="No">No</option>
                        </select>

                        <label className={styles.label}>Statutory Link (if any)</label>
                        <input className={styles.input} value={form.statutoryLink || ""} onChange={e => setForm({ ...form, statutoryLink: e.target.value })} placeholder="e.g., PF, ESI, PT" />

                        <label className={styles.label}>Visibility</label>
                        <select className={styles.input} value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })}>
                            <option>Payslip</option><option>Hidden</option><option>Breakdown</option>
                        </select>

                        <label className={styles.label}>Status</label>
                        <select className={styles.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option>Active</option><option>Inactive</option><option>Archived</option>
                        </select>

                    </div>

                    <div className={styles.rightCol}>
                        <h4>Behavior Settings</h4>
                        <label className={styles.label}><input type="checkbox" checked={form.behavior.proration} onChange={e => setForm({ ...form, behavior: { ...form.behavior, proration: e.target.checked } })} /> Proration (prorate on join/exit)</label>
                        <label className={styles.label}><input type="checkbox" checked={form.behavior.dependsOnAttendance} onChange={e => setForm({ ...form, behavior: { ...form.behavior, dependsOnAttendance: e.target.checked } })} /> Depends on attendance</label>
                        <label className={styles.label}><input type="checkbox" checked={form.behavior.includedInGross} onChange={e => setForm({ ...form, behavior: { ...form.behavior, includedInGross: e.target.checked } })} /> Included in Gross</label>
                        <label className={styles.label}><input type="checkbox" checked={form.behavior.includedInCTC} onChange={e => setForm({ ...form, behavior: { ...form.behavior, includedInCTC: e.target.checked } })} /> Included in CTC</label>
                        <label className={styles.label}><input type="checkbox" checked={form.behavior.showInPayslip} onChange={e => setForm({ ...form, behavior: { ...form.behavior, showInPayslip: e.target.checked } })} /> Show in Payslip</label>
                        <label className={styles.label}><input type="checkbox" checked={form.behavior.lockAfterCycle} onChange={e => setForm({ ...form, behavior: { ...form.behavior, lockAfterCycle: e.target.checked } })} /> Lock editing after cycle</label>
                        <label className={styles.label}><input type="checkbox" checked={form.behavior.carryForward} onChange={e => setForm({ ...form, behavior: { ...form.behavior, carryForward: e.target.checked } })} /> Carry forward (reimbursements)</label>

                        <hr />

                        <h4>Statutory Configuration (region-wise)</h4>
                        <p className={styles.muted}>Configure region-specific rules in production; here we store a label for mapping.</p>
                        <label className={styles.label}>Region Mapping Key</label>
                        <input className={styles.input} value={form.regionKey || ""} onChange={e => setForm({ ...form, regionKey: e.target.value })} placeholder="e.g., PF_RULE_IND" />

                        <hr />
                        <label className={styles.label}>Notes / Formula description</label>
                        <textarea className={styles.input} rows={6} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

                        <div className={styles.modalActions}>
                            <button type="button" className={styles.btn} onClick={onClose}>Cancel</button>
                            <button type="submit" className={styles.btnPrimary}>Save Component</button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}

function DetailsModal({ open, component, onClose }) {
    if (!open || !component) return null;
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Component Details — {component.name}</h3>
                    <div>
                        <button className={styles.btn} onClick={onClose}>Close</button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.detailCol}>
                        <h4>Summary</h4>
                        <div><strong>Code</strong>: {component.code}</div>
                        <div><strong>Category</strong>: {component.category} / {component.subCategory}</div>
                        <div><strong>Countries</strong>: {(component.countries || []).join(", ")}</div>
                        <div><strong>Calc Mode</strong>: {component.calcMode} — {component.calcMode === "Formula" ? component.calcValue : (component.calcMode === "%base" || component.calcMode === "%gross" ? `${component.calcValue}%` : component.calcValue)}</div>
                        <div><strong>Taxable</strong>: {component.taxable ? "Yes" : "No"}</div>
                        <div><strong>Statutory Link</strong>: {component.statutoryLink || "—"}</div>
                    </div>

                    <div className={styles.detailCol}>
                        <h4>Behavior & Payslip</h4>
                        <pre className={styles.pre}>{JSON.stringify(component.behavior || {}, null, 2)}</pre>
                        <h4>Usage in Structures</h4>
                        <p className={styles.muted}>This would show where the component is used. (Mocked)</p>
                        <h4>History</h4>
                        <div className={styles.historyList}>
                            {(component.history || []).length === 0 && <div className={styles.muted}>No history entries</div>}
                            {(component.history || []).map((h, i) => <div key={i} className={styles.historyItem}><strong>{new Date(h.changedAt).toLocaleString()}</strong> — {h.note || "Updated"}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// -------------------- Main Page --------------------
export default function PayrollSalaryComponents({navigate}) {
    const [country, setCountry] = useState("");
    const [groups, setGroups] = useState([]);
    const [activeTab, setActiveTab] = useState("Earnings");
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editInitial, setEditInitial] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const fileRef = useRef();
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState(null);

    async function load() {
        setLoading(true);
        const gr = await api.listGroups();
        const res = await api.listComponents({ country, category: activeTab, search });
        setGroups(gr);
        if (res.ok) setComponents(res.data);
        setLoading(false);
    }

    useEffect(() => { load(); }, [country, activeTab, search]);

    function onCreate() { setEditInitial(null); setShowCreate(true); }
    function onImportClick(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = async () => {
            // naive CSV parse - expects header with name,code,category,calcMode,calcValue,countries
            const text = reader.result;
            const lines = text.split(/\r?\n/).filter(Boolean);
            if (lines.length < 2) { setToast("CSV must include header + rows"); setTimeout(() => setToast(null), 1500); return; }
            const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
            const rows = lines.slice(1).map(l => {
                const cols = l.split(",").map(c => c.trim());
                const obj = {};
                headers.forEach((h, i) => obj[h] = cols[i] || "");
                return obj;
            });
            // validate rows
            const valid = [];
            const errs = [];
            rows.forEach((r, idx) => {
                if (!r.name || !r.code || !r.calcmode) errs.push({ row: idx + 2, err: "name/code/calcMode required" });
                else valid.push({
                    name: r.name, code: r.code, category: r.category || activeTab, subCategory: r.subcategory || "", countries: (r.countries || "").split("|").map(x => x.trim()).filter(Boolean),
                    calcMode: r.calcmode, calcValue: r.calcvalue || 0, taxable: (r.taxable || "no").toLowerCase().startsWith("y"), statutoryLink: r.statutorylink || "", visibility: r.visibility || "Payslip", status: "Active"
                });
            });
            if (errs.length) { setToast(`CSV had ${errs.length} errors (first: row ${errs[0].row})`); setTimeout(() => setToast(null), 1800); }
            // create valid
            for (const v of valid) await api.createComponent(v);
            setToast(`Imported ${valid.length} components`); setTimeout(() => setToast(null), 1600);
            await load();
        };
        reader.readAsText(f);
        e.target.value = "";
    }

    async function onExportAll() {
        const resCsv = await api.exportCSV(components);
        const blob = new Blob([resCsv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `salary-components-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setToast("Exported CSV");
        setTimeout(() => setToast(null), 1200);
    }

    function onView(c) { setSelectedComponent(c); setShowDetails(true); }
    function onEdit(c) { setEditInitial(c); setShowCreate(true); }
    async function onDuplicate(c) {
        const dup = { ...c, name: c.name + " (Copy)", code: uniqueCode(c.name + "_copy"), status: "Draft" };
        const res = await api.createComponent(dup);
        if (res.ok) { setToast("Duplicated"); setTimeout(() => setToast(null), 1000); await load(); }
    }
    async function onArchive(c) {
        const res = await api.updateComponent(c.id, { status: "Archived", note: "Archived by user" });
        if (res.ok) { setToast("Archived"); setTimeout(() => setToast(null), 1000); await load(); }
    }

    async function onSaveComponent(component) {
        setToast("Saved");
        setTimeout(() => setToast(null), 900);
        await load();
    }

    return (
        <>
            <p className="path">
                <span onClick={() => navigate("/payroll")}>Payroll</span>{" "}
                <i className="bi bi-chevron-right"></i> Payroll Salary Components
            </p>
            <div className={styles.page}>
                <HeaderToolbar country={country} setCountry={setCountry} onCreate={onCreate} onImportClick={(e) => onImportClick(e)} onExportAll={onExportAll} groups={groups} />

                <div className={styles.controls}>
                    <CategoryTabs active={activeTab} setActive={setActiveTab} />
                    <div className={styles.searchRow}>
                        <input className={styles.searchInput} placeholder="Search by name or code" value={search} onChange={e => setSearch(e.target.value)} />
                        <button className={styles.btn} onClick={load}>Search</button>
                    </div>
                </div>

                <div className={styles.main}>
                    {loading ? <div className={styles.loading}>Loading components...</div> : <ComponentsTable data={components} onView={onView} onEdit={onEdit} onDuplicate={onDuplicate} onArchive={onArchive} />}
                </div>

                {showCreate && <ComponentModal open={showCreate} initial={editInitial} onClose={() => { setShowCreate(false); setEditInitial(null); }} onSave={onSaveComponent} countries={mockDB.countries} />}

                {showDetails && <DetailsModal open={showDetails} component={selectedComponent} onClose={() => { setShowDetails(false); setSelectedComponent(null); }} />}

                {toast && <div className={styles.toast}>{toast}</div>}
            </div>
        </>
    );
}

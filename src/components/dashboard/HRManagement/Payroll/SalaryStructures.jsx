// src/pages/SalaryStructures.jsx
import React, { useEffect, useState } from "react";
import styles from "./SalaryStructures.module.css";

/*
 Updated: All popups (structure editor, selected-structure view, import modal, etc.)
 are rendered as centered modals instead of drawers.
*/

const dbMock = {}; // keep earlier mock in api closure below (omitted for brevity)

/* --- Reused in-file mock API (same semantics as previous version) --- */
const api = (function () {
  const db = {
    nextId: 900,
    structures: [
      {
        id: "S-101",
        name: "Default Monthly Structure",
        country: "India",
        currency: "INR",
        payCycle: "Monthly",
        employeeType: "Full-time",
        applicable: {
          departments: ["HR", "Engineering"],
          grades: ["G1", "G2"],
        },
        effectiveFrom: "2025-01-01",
        version: 1,
        earnings: [
          {
            id: "E-1",
            name: "Basic",
            calcType: "Fixed",
            value: 30000,
            includeInGross: true,
            includeInCTC: true,
          },
          {
            id: "E-2",
            name: "HRA",
            calcType: "%base",
            value: 40,
            includeInGross: true,
            includeInCTC: true,
          },
        ],
        deductions: [
          {
            id: "D-1",
            name: "PF",
            calcType: "%basic",
            employeePct: 12,
            employerPct: 12,
            statutory: true,
          },
        ],
        componentGroups: ["Fixed Earnings", "Statutory Deductions"],
        formulaSummary:
          "Gross = SUM(All Earnings); Net = Gross - SUM(All Deductions)",
        countryStatutory: {
          PF_employee_pct: 12,
          PF_employer_pct: 12,
          ESI_limit: 21000,
        },
        assignedEmployeesCount: 24,
        status: "Active",
        createdAt: new Date().toISOString(),
        history: [
          {
            version: 1,
            changedAt: new Date().toISOString(),
            notes: "Initial structure",
          },
        ],
      },
    ],
    componentGroups: [
      "Fixed Earnings",
      "Variable Earnings",
      "Reimbursements",
      "Employer Contributions",
      "Statutory Deductions",
      "Voluntary Deductions",
    ],
    employees: [
      { id: "E001", name: "Aarti Sharma", dept: "HR", grade: "G1" },
      { id: "E002", name: "Ravi Kumar", dept: "Engineering", grade: "G2" },
      { id: "E003", name: "Sonia Verma", dept: "Sales", grade: "G3" },
    ],
  };

  function sleep(ms = 120) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return {
    async listStructures(filter = {}) {
      await sleep();
      let list = db.structures.slice();
      if (filter.country)
        list = list.filter((s) => s.country === filter.country);
      if (filter.status) list = list.filter((s) => s.status === filter.status);
      if (filter.name)
        list = list.filter((s) =>
          s.name.toLowerCase().includes(filter.name.toLowerCase())
        );
      return { ok: true, data: list };
    },
    async fetchStructure(id) {
      await sleep();
      return {
        ok: true,
        structure: db.structures.find((s) => s.id === id) || null,
      };
    },
    async createOrUpdate(struct) {
      await sleep();
      if (!struct.id) {
        const id = `S-${++db.nextId}`;
        const rec = {
          ...struct,
          id,
          version: 1,
          createdAt: new Date().toISOString(),
          history: [
            {
              version: 1,
              changedAt: new Date().toISOString(),
              notes: struct.notes || "Created",
            },
          ],
        };
        db.structures.push(rec);
        return { ok: true, structure: rec };
      } else {
        const idx = db.structures.findIndex((s) => s.id === struct.id);
        if (idx === -1) return { ok: false, message: "Not found" };
        const newVersion = (db.structures[idx].version || 1) + 1;
        const updated = { ...struct, version: newVersion };
        updated.history = (db.structures[idx].history || []).concat({
          version: newVersion,
          changedAt: new Date().toISOString(),
          notes: struct.notes || "Updated",
        });
        db.structures[idx] = updated;
        return { ok: true, structure: updated };
      }
    },
    async exportStructureJSON(id) {
      await sleep();
      const s = db.structures.find((x) => x.id === id);
      return { ok: true, json: JSON.stringify(s, null, 2) };
    },
    async importStructureJSON(json) {
      await sleep();
      try {
        const s = JSON.parse(json);
        s.id = s.id || `S-${++db.nextId}`;
        db.structures.push(s);
        return { ok: true, structure: s };
      } catch (e) {
        return { ok: false, message: "Invalid JSON" };
      }
    },
    async listComponentGroups() {
      await sleep();
      return db.componentGroups.slice();
    },
    async assignEmployees(id, list) {
      await sleep();
      const s = db.structures.find((x) => x.id === id);
      if (!s) return { ok: false };
      s.assignedEmployeesCount = (s.assignedEmployeesCount || 0) + list.length;
      return { ok: true, assignedCount: s.assignedEmployeesCount };
    },
    async fetchEmployees() {
      await sleep();
      return db.employees.slice();
    },
  };
})();

/* ---------- Small helpers ---------- */
const Badge = ({ children, type = "info" }) => (
  <span className={`${styles.badge} ${styles["badge_" + type]}`}>
    {children}
  </span>
);

/* ---------- Structure Modal (Create/Edit) - unchanged logic & centered modal ---------- */
function StructureModal({ open, initial, onClose, onSave, groups, countries }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial }
      : {
          name: "",
          country: countries[0] || "India",
          currency: "INR",
          payCycle: "Monthly",
          employeeType: "Full-time",
          applicable: { departments: [], roles: [], grades: [] },
          effectiveFrom: new Date().toISOString().slice(0, 10),
          earnings: [],
          deductions: [],
          componentGroups: [],
          formulaSummary: "",
          countryStatutory: {},
          notes: "",
        }
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm({ ...initial });
    else
      setForm((s) => ({
        ...s,
        country: countries[0] || "India",
        currency: countries[0] === "India" ? "INR" : "USD",
      }));
    // eslint-disable-next-line
  }, [initial, countries]);

  function addEarning() {
    setForm((f) => ({
      ...f,
      earnings: f.earnings.concat({
        id: `E-${Date.now()}`,
        name: "",
        calcType: "Fixed",
        value: 0,
        includeInGross: true,
        includeInCTC: true,
        proration: false,
        rounding: "None",
      }),
    }));
  }
  function removeEarning(i) {
    setForm((f) => ({
      ...f,
      earnings: f.earnings.filter((_, idx) => idx !== i),
    }));
  }
  function addDeduction() {
    setForm((f) => ({
      ...f,
      deductions: f.deductions.concat({
        id: `D-${Date.now()}`,
        name: "",
        calcType: "Fixed",
        employeePct: 0,
        employerPct: 0,
        statutory: false,
      }),
    }));
  }
  function removeDeduction(i) {
    setForm((f) => ({
      ...f,
      deductions: f.deductions.filter((_, idx) => idx !== i),
    }));
  }
  function validate() {
    const e = {};
    if (!form.name || form.name.trim().length < 3)
      e.name = "Name required (min 3 chars)";
    if (!form.payCycle) e.payCycle = "Pay cycle required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function submit(e) {
    e && e.preventDefault();
    if (!validate()) return;
    const res = await api.createOrUpdate(form);
    if (res.ok) {
      onSave(res.structure);
      onClose();
    } else {
      alert("Failed to save");
    }
  }

  if (!open) return null;
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={(ev) => ev.stopPropagation()}
        onSubmit={submit}
      >
        <div className={styles.modalHeader}>
          <h3>
            {form.id
              ? `Edit Structure — ${form.name}`
              : "Create Salary Structure"}
          </h3>
          <div>
            <button type="button" className={"cancelbtn"} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={"submitbtn"}>
              {form.id ? "Save" : "Create"}
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formCol}>
            <label className={styles.label}>Structure Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <div className={styles.fieldError}>{errors.name}</div>
            )}

            <div className={styles.row}>
              <div>
                <label className={styles.label}>Country</label>
                <select
                  className={styles.input}
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>Currency</label>
                <input
                  className={styles.input}
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={styles.label}>Pay Cycle</label>
                <select
                  className={styles.input}
                  value={form.payCycle}
                  onChange={(e) =>
                    setForm({ ...form, payCycle: e.target.value })
                  }
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Hourly</option>
                </select>
              </div>
            </div>

            <label className={styles.label}>Employee Type</label>
            <select
              className={styles.input}
              value={form.employeeType}
              onChange={(e) =>
                setForm({ ...form, employeeType: e.target.value })
              }
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contractor</option>
            </select>

            <label className={styles.label}>
              Applicable Departments / Roles / Grades (comma separated)
            </label>
            <input
              className={styles.input}
              value={[...(form.applicable.departments || [])].join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  applicable: {
                    ...form.applicable,
                    departments: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                })
              }
              placeholder="HR, Engineering"
            />

            <label className={styles.label}>Effective From</label>
            <input
              type="date"
              className={styles.input}
              value={form.effectiveFrom}
              onChange={(e) =>
                setForm({ ...form, effectiveFrom: e.target.value })
              }
            />

            <hr />

            <div>
              <h4>Earnings</h4>
              <div className={styles.smallActions}>
                <button
                  type="button"
                  className={"submitbtn"}
                  onClick={addEarning}
                >
                  Add Earning
                </button>
              </div>
              {form.earnings.map((eg, i) => (
                <div key={eg.id} className={styles.itemRow}>
                  <input
                    className={styles.inputSmall}
                    placeholder="Name"
                    value={eg.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        const copy = [...f.earnings];
                        copy[i] = { ...copy[i], name: v };
                        return { ...f, earnings: copy };
                      });
                    }}
                  />
                  <select
                    className={styles.inputSmall}
                    value={eg.calcType}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        const copy = [...f.earnings];
                        copy[i] = { ...copy[i], calcType: v };
                        return { ...f, earnings: copy };
                      });
                    }}
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="%base">% of Base</option>
                    <option value="%gross">% of Gross</option>
                    <option value="Formula">Formula</option>
                  </select>
                  <input
                    className={styles.inputSmall}
                    placeholder="Value"
                    value={eg.value}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        const copy = [...f.earnings];
                        copy[i] = { ...copy[i], value: v };
                        return { ...f, earnings: copy };
                      });
                    }}
                  />
                  <label className={styles.smallLabel}>
                    <input
                      type="checkbox"
                      checked={eg.includeInGross}
                      onChange={(e) => {
                        const v = e.target.checked;
                        setForm((f) => {
                          const copy = [...f.earnings];
                          copy[i] = { ...copy[i], includeInGross: v };
                          return { ...f, earnings: copy };
                        });
                      }}
                    />{" "}
                    Include in Gross
                  </label>
                  <button
                    type="button"
                    className={"cancelbtn"}
                    onClick={() => removeEarning(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <hr />

            <div>
              <h4>Deductions</h4>
              <div className={styles.smallActions}>
                <button
                  type="button"
                  className={"submitbtn"}
                  onClick={addDeduction}
                >
                  Add Deduction
                </button>
              </div>
              {form.deductions.map((dg, i) => (
                <div key={dg.id} className={styles.itemRow}>
                  <input
                    className={styles.inputSmall}
                    placeholder="Name"
                    value={dg.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        const copy = [...f.deductions];
                        copy[i] = { ...copy[i], name: v };
                        return { ...f, deductions: copy };
                      });
                    }}
                  />
                  <select
                    className={styles.inputSmall}
                    value={dg.calcType}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        const copy = [...f.deductions];
                        copy[i] = { ...copy[i], calcType: v };
                        return { ...f, deductions: copy };
                      });
                    }}
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="%basic">% of Basic</option>
                    <option value="Slab">Slab-based</option>
                    <option value="Formula">Formula</option>
                  </select>
                  <input
                    className={styles.inputSmall}
                    placeholder="Value / Slab"
                    value={dg.employeePct || dg.value || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => {
                        const copy = [...f.deductions];
                        copy[i] = { ...copy[i], employeePct: v };
                        return { ...f, deductions: copy };
                      });
                    }}
                  />
                  <label className={styles.smallLabel}>
                    <input
                      type="checkbox"
                      checked={dg.statutory}
                      onChange={(e) => {
                        const v = e.target.checked;
                        setForm((f) => {
                          const copy = [...f.deductions];
                          copy[i] = { ...copy[i], statutory: v };
                          return { ...f, deductions: copy };
                        });
                      }}
                    />{" "}
                    Statutory
                  </label>
                  <button
                    className={"cancelbtn"}
                    type="button"
                    onClick={() => removeDeduction(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formCol}>
            <h4>Component Groups</h4>
            <div className={styles.groups}>
              {groups.map((g) => (
                <label key={g} className={styles.groupLabel}>
                  <input
                    type="checkbox"
                    checked={(form.componentGroups || []).includes(g)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm((f) => ({
                        ...f,
                        componentGroups: checked
                          ? [...(f.componentGroups || []), g]
                          : (f.componentGroups || []).filter((x) => x !== g),
                      }));
                    }}
                  />{" "}
                  {g}
                </label>
              ))}
            </div>

            <h4>Formula Builder (simple)</h4>
            <small className={styles.muted}>
              Use variables (Base, HRA, Basic). Example: Gross = SUM(Basic, HRA)
            </small>
            <textarea
              className={styles.textarea}
              rows={6}
              value={form.formulaSummary}
              onChange={(e) =>
                setForm({ ...form, formulaSummary: e.target.value })
              }
            />

            <h4>Country Statutory Settings</h4>
            <div className={styles.statBox}>
              <label className={styles.label}>PF employee %</label>
              <input
                className={styles.inputSmall}
                value={form.countryStatutory?.PF_employee_pct || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    countryStatutory: {
                      ...f.countryStatutory,
                      PF_employee_pct: e.target.value,
                    },
                  }))
                }
              />
              <label className={styles.label}>PF employer %</label>
              <input
                className={styles.inputSmall}
                value={form.countryStatutory?.PF_employer_pct || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    countryStatutory: {
                      ...f.countryStatutory,
                      PF_employer_pct: e.target.value,
                    },
                  }))
                }
              />
              <label className={styles.label}>ESI salary limit</label>
              <input
                className={styles.inputSmall}
                value={form.countryStatutory?.ESI_limit || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    countryStatutory: {
                      ...f.countryStatutory,
                      ESI_limit: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <h4>Versioning / Notes</h4>
            <input
              className={styles.input}
              placeholder="Change notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className={styles.modalActions}>
              <button type="button" className={"cancelbtn"} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={"submitbtn"}>
                {form.id ? "Update & New Version" : "Create Structure"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------- View Structure Modal (was drawer) - now centered modal ---------- */
function ViewStructureModal({ open, structure, onClose, onExport }) {
  if (!open || !structure) return null;
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            {structure.name} — v{structure.version}
          </h3>
          <div>
            <button className={"cancelbtn"} onClick={onClose}>
              Close
            </button>
            <button
              className={"submitbtn"}
              onClick={() => onExport(structure.id)}
            >
              Export
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          <h4>Summary</h4>
          <div>
            <strong>Country:</strong> {structure.country}
          </div>
          <div>
            <strong>Pay Cycle:</strong> {structure.payCycle}
          </div>
          <div>
            <strong>Assigned Employees:</strong>{" "}
            {structure.assignedEmployeesCount}
          </div>

          <h4 style={{ marginTop: 12 }}>Earnings</h4>
          <table className={"square-table"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Calc Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {(structure.earnings || []).map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.calcType}</td>
                  <td>{e.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ marginTop: 12 }}>Deductions</h4>
          <table className={"square-table"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {(structure.deductions || []).map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.calcType}</td>
                  <td>{d.employeePct || d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ marginTop: 12 }}>Component Groups</h4>
          <div className={styles.groups}>
            {(structure.componentGroups || []).map((g) => (
              <span key={g} className={styles.groupBadge}>
                {g}
              </span>
            ))}
          </div>

          <h4 style={{ marginTop: 12 }}>Formula Summary</h4>
          <pre className={styles.pre}>{structure.formulaSummary}</pre>

          <h4 style={{ marginTop: 12 }}>Version History</h4>
          <table className={"square-table"}>
            <thead>
              <tr>
                <th>Version</th>
                <th>Changed At</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {(structure.history || []).map((h) => (
                <tr key={h.version}>
                  <td>{h.version}</td>
                  <td>{new Date(h.changedAt).toLocaleString()}</td>
                  <td>{h.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main page ---------- */
export default function SalaryStructures({ navigate }) {
  const [structures, setStructures] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [groups, setGroups] = useState([]);
  const [countries] = useState(["India", "USA", "UAE", "UK"]);
  const [toast, setToast] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [employees, setEmployees] = useState([]);

  async function load() {
    setLoading(true);
    const res = await api.listStructures({
      country: filterCountry,
      status: filterStatus,
      name: searchName,
    });
    const gr = await api.listComponentGroups();
    const em = await api.fetchEmployees();
    if (res.ok) setStructures(res.data);
    setGroups(gr);
    setEmployees(em);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filterCountry, filterStatus, searchName]);

  async function onCreateOrUpdate(struct) {
    setToast("Saved structure");
    setTimeout(() => setToast(null), 1400);
    await load();
  }

  async function openEdit(id) {
    const res = await api.fetchStructure(id);
    if (res.ok && res.structure) {
      setEditing(res.structure);
      setShowModal(true);
    }
  }

  async function onExport(id) {
    const res = await api.exportStructureJSON(id);
    if (res.ok) {
      const blob = new Blob([res.json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `salary-structure-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setToast("Exported JSON");
      setTimeout(() => setToast(null), 1200);
    }
  }

  async function importJSONFile(file) {
    const text = await file.text();
    const res = await api.importStructureJSON(text);
    if (res.ok) {
      setToast("Imported structure");
      setTimeout(() => setToast(null), 1200);
      await load();
    } else {
      setToast("Import failed");
      setTimeout(() => setToast(null), 1200);
    }
  }

  async function assignEmployees(id) {
    const res = await api.assignEmployees(id, employees);
    if (res.ok) {
      setToast(`Assigned ${employees.length} employees`);
      setTimeout(() => setToast(null), 1200);
      await load();
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
          <div className={styles.topActions}>
            <button
              className={"homebtn"}
              onClick={() => {
                setEditing(null);
                setShowModal(true);
              }}
            >
              Create Salary Structure
            </button>

            <label className={"homebtn"}>
              Import Structures
              <input
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={(e) => importJSONFile(e.target.files[0])}
              />
            </label>

            <button
              className={"homebtn"}
              onClick={() => {
                navigator.clipboard &&
                  navigator.clipboard.writeText("Exported list stub");
                setToast("Exported list (simulate)");
                setTimeout(() => setToast(null), 1200);
              }}
            >
              Export Structures
            </button>

            <button
              className={"homebtn"}
              onClick={() => alert("Manage component groups (simulate)")}
            >
              Manage Component Groups
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className={styles.filter}>
            <div>
              Country:
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="">All</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Status:
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>
            <div>
              Search:
              <input
                placeholder="Structure name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={"d-flex justify-content-center mt-3"}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <table className={"square-table w-75"}>
              <thead>
                <tr>
                  <th>Structure Name</th>
                  <th>Country</th>
                  <th>Currency</th>
                  <th>Pay Cycle</th>
                  <th>Components</th>
                  <th>Assigned</th>
                  <th>Status</th>
                  <th>Last Modified</th>
                  <th colSpan={4}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {structures.length === 0 && (
                  <tr>
                    <td colSpan="9">No structures found</td>
                  </tr>
                )}
                {structures.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.country}</td>
                    <td>{s.currency}</td>
                    <td>{s.payCycle}</td>
                    <td>
                      {(s.earnings?.length || 0) + (s.deductions?.length || 0)}
                    </td>
                    <td>{s.assignedEmployeesCount || 0}</td>
                    <td>
                      <Badge type={s.status === "Active" ? "success" : "info"}>
                        {s.status}
                      </Badge>
                    </td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className={"table-view-btn"}
                        onClick={() => {
                          setSelectedStructure(s);
                        }}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className={"table-approved-btn"}
                        onClick={() => openEdit(s.id)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className={"table-pending-btn"}
                        onClick={() => onExport(s.id)}
                      >
                        Export
                      </button>
                    </td>
                    <td>
                      <button
                        className={"table-view-btn"}
                        onClick={() => assignEmployees(s.id)}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <StructureModal
            open={showModal}
            initial={editing}
            onClose={() => {
              setShowModal(false);
              setEditing(null);
            }}
            onSave={onCreateOrUpdate}
            groups={groups}
            countries={countries}
          />
        )}

        {selectedStructure && (
          <ViewStructureModal
            open={!!selectedStructure}
            structure={selectedStructure}
            onClose={() => setSelectedStructure(null)}
            onExport={onExport}
          />
        )}

        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    </>
  );
}

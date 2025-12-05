// PayrollDashboard.jsx
import React, { useState, useMemo } from "react";
import styles from "./PayCycles.module.css";
import Modal from "./Modal";
import { initialPayCycles, generateFutureCycles } from "./mockData";

/**
 * PayrollDashboard
 * - Implements header toolbar (Create, Auto-Generate, Country selector, Bulk Edit, Export)
 * - Active Pay Cycles table with columns matching the PDF spec
 * - Upcoming / Scheduled cycles table
 * - Archived cycles section
 * - Quick Actions (sync / generate / approve / rollback)
 * - Centered modals for Create / Edit / Bulk Edit / Confirm / Country settings
 */

export default function PayCycles({ navigate }) {
  // data/state
  const [payCycles, setPayCycles] = useState(initialPayCycles);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState({ open: false, action: null });
  const [filterStatus, setFilterStatus] = useState("All");

  // derived lists
  const activeCycles = useMemo(
    () => payCycles.filter((c) => c.status !== "Archived"),
    [payCycles]
  );
  const archivedCycles = useMemo(
    () => payCycles.filter((c) => c.status === "Archived"),
    [payCycles]
  );
  const upcomingCycles = useMemo(
    () => generateFutureCycles(payCycles, 3),
    [payCycles]
  );

  // handlers
  function toggleRow(id) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function openCreate() {
    setEditingCycle(null);
    setShowCreateModal(true);
  }

  function openEdit(cycle) {
    setEditingCycle(cycle);
    setShowCreateModal(true);
  }

  function saveCycle(formData) {
    if (editingCycle) {
      setPayCycles((prev) => prev.map((c) => (c.id === editingCycle.id ? { ...c, ...formData } : c)));
    } else {
      setPayCycles((prev) => [{ id: Date.now(), ...formData }, ...prev]);
    }
    setShowCreateModal(false);
    setEditingCycle(null);
  }

  function archiveSelected() {
    setPayCycles((prev) => prev.map((c) => (selectedRows.includes(c.id) ? { ...c, status: "Archived" } : c)));
    setSelectedRows([]);
    setShowConfirm({ open: false, action: null });
  }

  function autoGenerate() {
    // Simple demo of auto-generate: create next monthly cycle for each active monthly cycle
    setPayCycles((prev) => {
      const generated = [];
      prev.forEach((c) => {
        if (c.payFrequency === "Monthly") {
          const start = new Date(c.startDate);
          const next = new Date(start);
          next.setMonth(next.getMonth() + 1);
          const end = new Date(next);
          end.setDate(end.getDate() + (new Date(c.endDate).getDate() - 1));
          generated.push({
            id: Date.now() + Math.random(),
            cycleName: `${c.payFrequency} - ${next.toLocaleString("default", { month: "short" })} ${next.getFullYear()}`,
            country: c.country,
            payFrequency: c.payFrequency,
            startDate: next.toISOString().slice(0, 10),
            endDate: new Date(end).toISOString().slice(0, 10),
            cutOffDate: c.cutOffDate,
            payDate: c.payDate,
            status: "Draft",
          });
        }
      });
      return [...generated, ...prev];
    });
  }

  function exportCycles() {
    // Export selected or all as CSV - simplified
    const rows = (selectedRows.length ? payCycles.filter((p) => selectedRows.includes(p.id)) : payCycles)
      .map((c) => `${c.cycleName},${c.country},${c.payFrequency},${c.startDate},${c.endDate},${c.cutOffDate},${c.payDate},${c.status}`)
      .join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paycycles_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function quickAction(action) {
    // Demo quick actions behavior
    if (action === "syncAttendance") {
      alert("Attendance synced (demo).");
    } else if (action === "generateDraft") {
      alert("Draft payroll generated (demo).");
    } else if (action === "approve") {
      setPayCycles((prev) => prev.map((c) => (c.status === "Draft" ? { ...c, status: "Approved" } : c)));
    } else if (action === "rollback") {
      setPayCycles((prev) => prev.map((c) => (c.status === "Approved" ? { ...c, status: "Draft" } : c)));
    }
  }

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/payroll")}>Payroll</span>{" "}
        <i className="bi bi-chevron-right"></i> Pay Cycles
      </p>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Payroll — Pay Cycles</h1>
          <div className={styles.toolbar}>
            <button className={styles.primary} onClick={openCreate}>Create Pay Cycle</button>
            <button onClick={autoGenerate}>Auto-Generate Cycles</button>
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} aria-label="Country selector">
              <option>India</option>
              <option>US</option>
              <option>UAE</option>
              <option>UK</option>
            </select>
            <button onClick={() => setShowBulkModal(true)} disabled={selectedRows.length === 0}>
              Bulk Edit ({selectedRows.length})
            </button>
            <button onClick={exportCycles}>Export Cycles</button>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Active Pay Cycles</h2>

            <div className={styles.filters}>
              <label>
                Status:
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option>All</option>
                  <option>Draft</option>
                  <option>Approved</option>
                  <option>Locked</option>
                  <option>Disbursed</option>
                </select>
              </label>
              <div className={styles.actionsRow}>
                <button onClick={() => setShowConfirm({ open: true, action: "archive" })} disabled={selectedRows.length === 0}>Archive Selected</button>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={selectedRows.length === activeCycles.length && activeCycles.length > 0} onChange={(e) => setSelectedRows(e.target.checked ? activeCycles.map(c => c.id) : [])} /></th>
                    <th>Cycle Name</th>
                    <th>Country</th>
                    <th>Pay Frequency</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Cut-off Date</th>
                    <th>Pay Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCycles
                    .filter((c) => filterStatus === "All" || c.status === filterStatus)
                    .map((cycle) => (
                      <tr key={cycle.id}>
                        <td><input type="checkbox" checked={selectedRows.includes(cycle.id)} onChange={() => toggleRow(cycle.id)} /></td>
                        <td>{cycle.cycleName}</td>
                        <td>{cycle.country}</td>
                        <td>{cycle.payFrequency}</td>
                        <td>{cycle.startDate}</td>
                        <td>{cycle.endDate}</td>
                        <td>{cycle.cutOffDate}</td>
                        <td>{cycle.payDate}</td>
                        <td><span className={styles.status}>{cycle.status}</span></td>
                        <td className={styles.rowActions}>
                          <button onClick={() => openEdit(cycle)}>Edit</button>
                          <button onClick={() => setPayCycles((prev) => prev.map((c) => c.id === cycle.id ? { ...c, status: "Locked" } : c))}>Lock</button>
                          <button onClick={() => setPayCycles((prev) => prev.map((c) => c.id === cycle.id ? { ...c, status: "Disbursed" } : c))}>Disburse</button>
                          <button onClick={() => setPayCycles((prev) => prev.map((c) => c.id === cycle.id ? { ...c, status: "Archived" } : c))}>Archive</button>
                        </td>
                      </tr>
                    ))}
                  {activeCycles.length === 0 && <tr><td colSpan="10" style={{ textAlign: "center" }}>No active cycles</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Upcoming & Scheduled Cycles</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cycle Name</th>
                    <th>Country</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Pay Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingCycles.map((u) => (
                    <tr key={u.id}>
                      <td>{u.cycleName}</td>
                      <td>{u.country}</td>
                      <td>{u.startDate}</td>
                      <td>{u.endDate}</td>
                      <td>{u.payDate}</td>
                      <td>
                        <button onClick={() => openEdit(u)}>Edit</button>
                        <button onClick={() => setPayCycles((prev) => [{ ...u, status: "Draft" }, ...prev])}>Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Archived Cycles</h2>
            <div className={styles.archiveNote}>
              Contains completed/locked/financial-year grouped cycles. Export options: Payslips, Bank file, Tax files.
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cycle Name</th>
                    <th>Country</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Pay Date</th>
                    <th>Export</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedCycles.map((a) => (
                    <tr key={a.id}>
                      <td>{a.cycleName}</td>
                      <td>{a.country}</td>
                      <td>{a.startDate}</td>
                      <td>{a.endDate}</td>
                      <td>{a.payDate}</td>
                      <td><button onClick={() => alert("Trigger export (demo).")}>Export</button></td>
                    </tr>
                  ))}
                  {archivedCycles.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center" }}>No archived cycles</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <aside className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <ul>
              <li><button onClick={() => quickAction("syncAttendance")}>Sync Attendance</button></li>
              <li><button onClick={() => quickAction("syncLeaves")}>Sync Leaves</button></li>
              <li><button onClick={() => quickAction("generateDraft")}>Generate Draft Payroll</button></li>
              <li><button onClick={() => quickAction("approve")}>Approve Cycle</button></li>
              <li><button onClick={() => quickAction("rollback")}>Rollback Draft</button></li>
            </ul>
          </aside>
        </main>

        {/* Modals (centered) */}
        {showCreateModal && (
          <Modal title={editingCycle ? "Edit Pay Cycle" : "Create Pay Cycle"} onClose={() => { setShowCreateModal(false); setEditingCycle(null); }}>
            <CreateEditForm initial={editingCycle} country={selectedCountry} onCancel={() => setShowCreateModal(false)} onSave={saveCycle} />
          </Modal>
        )}

        {showBulkModal && (
          <Modal title="Bulk Edit Pay Cycles" onClose={() => setShowBulkModal(false)}>
            <BulkEditForm selectedIds={selectedRows} onApply={(changes) => {
              setPayCycles((prev) => prev.map((c) => selectedRows.includes(c.id) ? { ...c, ...changes } : c));
              setShowBulkModal(false);
              setSelectedRows([]);
            }} onCancel={() => setShowBulkModal(false)} />
          </Modal>
        )}

        {showConfirm.open && showConfirm.action === "archive" && (
          <Modal title="Confirm Archive" onClose={() => setShowConfirm({ open: false, action: null })}>
            <div>
              <p>Are you sure you want to archive {selectedRows.length} selected cycle(s)?</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                <button onClick={() => setShowConfirm({ open: false, action: null })}>Cancel</button>
                <button onClick={archiveSelected} className={styles.danger}>Archive</button>
              </div>
            </div>
          </Modal>
        )}
      </div>

    </>
  );
}

/* CreateEditForm component (internal) */
function CreateEditForm({ initial = null, country, onCancel, onSave }) {
  const [form, setForm] = useState(() => initial || {
    cycleName: "",
    country,
    payFrequency: "Monthly",
    startDate: "",
    endDate: "",
    cutOffDate: "",
    payDate: "",
    status: "Draft",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    // basic validation: start < end
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      alert("Start date must be before end date");
      return;
    }
    onSave(form);
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <label>
        Pay Cycle Name
        <input name="cycleName" value={form.cycleName} onChange={handleChange} placeholder="Auto-suggested label" />
      </label>
      <label>
        Country / Region
        <select name="country" value={form.country} onChange={handleChange}>
          <option>India</option>
          <option>US</option>
          <option>UAE</option>
          <option>UK</option>
        </select>
      </label>
      <label>
        Pay Frequency
        <select name="payFrequency" value={form.payFrequency} onChange={handleChange}>
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Biweekly</option>
          <option>Semi-monthly</option>
          <option>Custom</option>
        </select>
      </label>
      <div className={styles.row}>
        <label>
          Start Date
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </label>
        <label>
          End Date
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          Cut-off Date
          <input type="date" name="cutOffDate" value={form.cutOffDate} onChange={handleChange} />
        </label>
        <label>
          Pay Date
          <input type="date" name="payDate" value={form.payDate} onChange={handleChange} />
        </label>
      </div>

      {/* Country-specific dynamic settings placeholder (per PDF: page 3-4) */}
      <fieldset className={styles.dynamic}>
        <legend>Country-specific / Advanced Settings</legend>
        <label>
          Allow Mid-cycle Joinees
          <select name="midJoin" onChange={(e) => { }} defaultValue="Yes">
            <option>Yes</option><option>No</option>
          </select>
        </label>
        <label>
          Auto Generate Payroll Draft
          <select name="autoDraft" onChange={(e) => { }} defaultValue="Yes">
            <option>Yes</option><option>No</option>
          </select>
        </label>
      </fieldset>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.primary}>Save</button>
      </div>
    </form>
  );
}

/* BulkEditForm (internal) */
function BulkEditForm({ selectedIds = [], onApply, onCancel }) {
  const [changes, setChanges] = useState({ status: "", country: "" });
  function apply() {
    onApply(changes);
  }
  return (
    <div className={styles.form}>
      <p>Applying changes to {selectedIds.length} cycle(s).</p>
      <label>
        Set Status
        <select value={changes.status} onChange={(e) => setChanges((s) => ({ ...s, status: e.target.value }))}>
          <option value="">--no change--</option>
          <option>Draft</option>
          <option>Approved</option>
          <option>Locked</option>
          <option>Disbursed</option>
          <option>Archived</option>
        </select>
      </label>
      <label>
        Set Country
        <select value={changes.country} onChange={(e) => setChanges((s) => ({ ...s, country: e.target.value }))}>
          <option value="">--no change--</option>
          <option>India</option>
          <option>US</option>
          <option>UAE</option>
        </select>
      </label>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={apply} className={styles.primary}>Apply</button>
      </div>
    </div>
  );
}

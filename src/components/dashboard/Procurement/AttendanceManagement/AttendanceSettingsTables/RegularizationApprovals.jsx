import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const approverRoleOptions = ["Team Lead", "Manager", "HR", "Admin", "None"];

const defaultEntries = [
  {
    enableRegularization: true,
    maxRequestsPerMonth: 3,
    autoApproveRegularization: false,
    regularizationApproverRole: "Manager",
  },
  {
    enableRegularization: false,
    maxRequestsPerMonth: 0,
    autoApproveRegularization: false,
    regularizationApproverRole: "None",
  },
];

const blankNewEntry = {
  enableRegularization: false,
  maxRequestsPerMonth: 0,
  autoApproveRegularization: false,
  regularizationApproverRole: "None",
};

const RegularizationApprovals = () => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // Enter edit mode (keep backup for cancel)
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(entries)));
    setEditMode(true);
  };

  // Cancel -> revert to backup
  const handleCancel = () => {
    if (backupEntries) setEntries(backupEntries);
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEditMode(false);
  };

  // Save -> commit (we already updated entries live)
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEditMode(false);
  };

  // Update single field
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Delete row
  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Add row
  const handleAddEntry = () => {
    if (newEntry.maxRequestsPerMonth < 0) {
      alert("Max requests per month must be 0 or greater.");
      return;
    }
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Regularization & Approvals</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Enable Regularization</th>
              <th>Max Requests Per Month</th>
              <th>Auto Approve Regularization</th>
              <th>Regularization Approver Role</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Enable Regularization */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.enableRegularization}
                        onChange={(e) => updateField(idx, "enableRegularization", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.enableRegularization ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.enableRegularization ? "Yes" : "No"
                  )}
                </td>

                {/* Max Requests Per Month */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={row.maxRequestsPerMonth}
                      onChange={(e) => updateField(idx, "maxRequestsPerMonth", Number(e.target.value))}
                    />
                  ) : (
                    row.maxRequestsPerMonth ?? 0
                  )}
                </td>

                {/* Auto Approve Regularization */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.autoApproveRegularization}
                        onChange={(e) => updateField(idx, "autoApproveRegularization", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.autoApproveRegularization ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.autoApproveRegularization ? "Yes" : "No"
                  )}
                </td>

                {/* Regularization Approver Role */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.regularizationApproverRole}
                      onChange={(e) => updateField(idx, "regularizationApproverRole", e.target.value)}
                    >
                      {approverRoleOptions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.regularizationApproverRole
                  )}
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(idx)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New entry row */}
            {editMode && (
              <tr className={styles.newRow}>
                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.enableRegularization}
                      onChange={(e) => setNewEntry({ ...newEntry, enableRegularization: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.enableRegularization ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={newEntry.maxRequestsPerMonth}
                    onChange={(e) => setNewEntry({ ...newEntry, maxRequestsPerMonth: Number(e.target.value) })}
                  />
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.autoApproveRegularization}
                      onChange={(e) => setNewEntry({ ...newEntry, autoApproveRegularization: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.autoApproveRegularization ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td>
                  <select
                    className={styles.select}
                    value={newEntry.regularizationApproverRole}
                    onChange={(e) => setNewEntry({ ...newEntry, regularizationApproverRole: e.target.value })}
                  >
                    {approverRoleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>

                <td className={styles.actionsCell}>
                  <button className={styles.addBtn} onClick={handleAddEntry}>
                    + Add
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center p-3">
        {!editMode ? (
          <button className="submitbtn" onClick={handleEnterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className="submitbtn" onClick={handleSave}>
              Save
            </button>
            <button className="cancelbtn" onClick={handleCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default RegularizationApprovals;

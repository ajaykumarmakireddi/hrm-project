import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const roundingOptions = [
  "None",
  "Nearest 5 minutes",
  "Nearest 10 minutes",
  "Nearest 15 minutes",
  "Nearest 30 minutes",
  "Nearest 60 minutes",
];

const defaultEntries = [
  {
    showLateMark: true,
    showWorkedDurationFormat: true,
    breakHandling: false,
    roundingTimeDuration: "Nearest 15 minutes",
  },
  {
    showLateMark: false,
    showWorkedDurationFormat: true,
    breakHandling: true,
    roundingTimeDuration: "Nearest 30 minutes",
  },
];

const blankNewEntry = {
  showLateMark: false,
  showWorkedDurationFormat: false,
  breakHandling: false,
  roundingTimeDuration: roundingOptions[0],
};

const ReportingDisplay = () => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // Enter edit mode (keep backup)
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(entries)));
    setEditMode(true);
  };

  // Cancel -> revert
  const handleCancel = () => {
    if (backupEntries) setEntries(backupEntries);
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEditMode(false);
  };

  // Save -> commit
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEditMode(false);
  };

  // Update a field for an existing row
  const updateField = (index, field, value) => {
    const copy = [...entries];
    copy[index] = { ...copy[index], [field]: value };
    setEntries(copy);
  };

  // Delete a row
  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Add row
  const handleAddEntry = () => {
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Reporting & Display Options</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Show Late Mark</th>
              <th>Show Worked Duration Format</th>
              <th>Break Handling</th>
              <th>Rounding Time Duration</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Show Late Mark (toggle) */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.showLateMark}
                        onChange={(e) => updateField(idx, "showLateMark", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.showLateMark ? "On" : "Off"}</span>
                    </label>
                  ) : (
                    row.showLateMark ? "On" : "Off"
                  )}
                </td>

                {/* Show Worked Duration Format (toggle) */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.showWorkedDurationFormat}
                        onChange={(e) => updateField(idx, "showWorkedDurationFormat", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.showWorkedDurationFormat ? "On" : "Off"}</span>
                    </label>
                  ) : (
                    row.showWorkedDurationFormat ? "On" : "Off"
                  )}
                </td>

                {/* Break Handling (toggle) */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.breakHandling}
                        onChange={(e) => updateField(idx, "breakHandling", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.breakHandling ? "On" : "Off"}</span>
                    </label>
                  ) : (
                    row.breakHandling ? "On" : "Off"
                  )}
                </td>

                {/* Rounding Time Duration (dropdown) */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.roundingTimeDuration}
                      onChange={(e) => updateField(idx, "roundingTimeDuration", e.target.value)}
                    >
                      {roundingOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.roundingTimeDuration
                  )}
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(idx)} title="Delete">
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
                      checked={!!newEntry.showLateMark}
                      onChange={(e) => setNewEntry({ ...newEntry, showLateMark: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.showLateMark ? "On" : "Off"}</span>
                  </label>
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.showWorkedDurationFormat}
                      onChange={(e) => setNewEntry({ ...newEntry, showWorkedDurationFormat: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.showWorkedDurationFormat ? "On" : "Off"}</span>
                  </label>
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.breakHandling}
                      onChange={(e) => setNewEntry({ ...newEntry, breakHandling: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.breakHandling ? "On" : "Off"}</span>
                  </label>
                </td>

                <td>
                  <select
                    className={styles.select}
                    value={newEntry.roundingTimeDuration}
                    onChange={(e) => setNewEntry({ ...newEntry, roundingTimeDuration: e.target.value })}
                  >
                    {roundingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
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

export default ReportingDisplay;

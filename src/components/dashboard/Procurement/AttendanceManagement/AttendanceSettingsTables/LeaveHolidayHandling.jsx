import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const weeklyOffOptions = [
  "Count as Working Day",
  "Exclude (no work)",
  "Count as Leave",
  "Flexible",
];

const defaultEntries = [
  {
    autoMarkAbsent: true,
    considerApprovedLeaveAsPresent: false,
    considerHolidaysAsPresent: true,
    weeklyOffHandling: "Exclude (no work)",
  },
  {
    autoMarkAbsent: false,
    considerApprovedLeaveAsPresent: true,
    considerHolidaysAsPresent: false,
    weeklyOffHandling: "Count as Working Day",
  },
];

const blankNewEntry = {
  autoMarkAbsent: false,
  considerApprovedLeaveAsPresent: false,
  considerHolidaysAsPresent: false,
  weeklyOffHandling: weeklyOffOptions[0],
};

const LeaveHolidayHandling = () => {
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
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Leave & Holiday Handling</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Auto Mark Absent</th>
              <th>Consider Approved Leave as Present</th>
              <th>Consider Holidays as Present</th>
              <th>Weekly Off Handling</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Auto Mark Absent */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.autoMarkAbsent}
                        onChange={(e) => updateField(idx, "autoMarkAbsent", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.autoMarkAbsent ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.autoMarkAbsent ? "Yes" : "No"
                  )}
                </td>

                {/* Consider Approved Leave as Present */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.considerApprovedLeaveAsPresent}
                        onChange={(e) => updateField(idx, "considerApprovedLeaveAsPresent", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.considerApprovedLeaveAsPresent ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.considerApprovedLeaveAsPresent ? "Yes" : "No"
                  )}
                </td>

                {/* Consider Holidays as Present */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.considerHolidaysAsPresent}
                        onChange={(e) => updateField(idx, "considerHolidaysAsPresent", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.considerHolidaysAsPresent ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.considerHolidaysAsPresent ? "Yes" : "No"
                  )}
                </td>

                {/* Weekly Off Handling */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.weeklyOffHandling}
                      onChange={(e) => updateField(idx, "weeklyOffHandling", e.target.value)}
                    >
                      {weeklyOffOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.weeklyOffHandling
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
                      checked={!!newEntry.autoMarkAbsent}
                      onChange={(e) => setNewEntry({ ...newEntry, autoMarkAbsent: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.autoMarkAbsent ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.considerApprovedLeaveAsPresent}
                      onChange={(e) => setNewEntry({ ...newEntry, considerApprovedLeaveAsPresent: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.considerApprovedLeaveAsPresent ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.considerHolidaysAsPresent}
                      onChange={(e) => setNewEntry({ ...newEntry, considerHolidaysAsPresent: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.considerHolidaysAsPresent ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td>
                  <select
                    className={styles.select}
                    value={newEntry.weeklyOffHandling}
                    onChange={(e) => setNewEntry({ ...newEntry, weeklyOffHandling: e.target.value })}
                  >
                    {weeklyOffOptions.map((opt) => (
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

export default LeaveHolidayHandling;

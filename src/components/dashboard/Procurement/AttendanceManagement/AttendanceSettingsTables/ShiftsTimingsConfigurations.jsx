import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const defaultEntries = [
  {
    // times use "HH:MM" (24-hour) string format, suitable for <input type="time">
    checkInTime: "09:00",
    checkOutTime: "17:00",
    minWorkingHours: "08:00", // HH:MM - minimum working hours required
    halfDayHours: "04:00", // HH:MM - half day threshold
    overtimeEnabled: true,
    overtimeAfter: "08:30", // HH:MM - calculate overtime after this worked hours
  },
  {
    checkInTime: "10:00",
    checkOutTime: "18:00",
    minWorkingHours: "08:00",
    halfDayHours: "04:00",
    overtimeEnabled: false,
    overtimeAfter: "00:00",
  },
];

const blankNewEntry = {
  checkInTime: "09:00",
  checkOutTime: "17:00",
  minWorkingHours: "08:00",
  halfDayHours: "04:00",
  overtimeEnabled: false,
  overtimeAfter: "00:00",
};

const ShiftsTimingsConfigurations = ({ navigate }) => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // enter edit mode: keep a backup for cancel
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(entries)));
    setEditMode(true);
  };

  // cancel editing -> revert
  const handleCancel = () => {
    if (backupEntries) setEntries(backupEntries);
    setNewEntry(blankNewEntry);
    setBackupEntries(null);
    setEditMode(false);
  };

  // save -> commit (we already update live), just exit edit mode and clear backup
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEditMode(false);
  };

  // Update a simple field for an existing row
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Delete a row
  const handleDelete = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  // Add new entry
  const handleAddEntry = () => {
    // simple validation: require checkIn and checkOut
    if (!newEntry.checkInTime || !newEntry.checkOutTime) {
      alert("Please provide both Check-In and Check-Out times.");
      return;
    }

    // If overtime enabled, require overtimeAfter to be set (non-empty)
    if (newEntry.overtimeEnabled && !newEntry.overtimeAfter) {
      alert("Please provide overtime threshold (HH:MM) when overtime is enabled.");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  // small helper to display a time or a dash
  const renderTime = (t) => (t ? t : "-");

  return (
    <>
      <h4 className={styles.title}>Shift and Timings Configuration</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Check-In Time</th>
              <th>Check-Out Time</th>
              <th>Minimum Working Hours Required (HH:MM)</th>
              <th>Half Day Working Hours (HH:MM)</th>
              <th>Overtime Calculation</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Check-In Time */}
                <td>
                  {editMode ? (
                    <input
                      className={styles.input}
                      type="time"
                      value={row.checkInTime}
                      onChange={(e) => updateField(idx, "checkInTime", e.target.value)}
                    />
                  ) : (
                    <span>{renderTime(row.checkInTime)}</span>
                  )}
                </td>

                {/* Check-Out Time */}
                <td>
                  {editMode ? (
                    <input
                      className={styles.input}
                      type="time"
                      value={row.checkOutTime}
                      onChange={(e) => updateField(idx, "checkOutTime", e.target.value)}
                    />
                  ) : (
                    <span>{renderTime(row.checkOutTime)}</span>
                  )}
                </td>

                {/* Minimum Working Hours Required (HH:MM) */}
                <td>
                  {editMode ? (
                    <input
                      className={styles.input}
                      type="time"
                      value={row.minWorkingHours}
                      onChange={(e) => updateField(idx, "minWorkingHours", e.target.value)}
                    />
                  ) : (
                    <span>{renderTime(row.minWorkingHours)}</span>
                  )}
                </td>

                {/* Half Day Working Hours (HH:MM) */}
                <td>
                  {editMode ? (
                    <input
                      className={styles.input}
                      type="time"
                      value={row.halfDayHours}
                      onChange={(e) => updateField(idx, "halfDayHours", e.target.value)}
                    />
                  ) : (
                    <span>{renderTime(row.halfDayHours)}</span>
                  )}
                </td>

                {/* Overtime Calculation => toggle + HH:MM input */}
                <td>
                  {editMode ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="checkbox"
                          checked={!!row.overtimeEnabled}
                          onChange={(e) => updateField(idx, "overtimeEnabled", e.target.checked)}
                        />
                        <span style={{ fontSize: 12 }}>
                          Enabled
                        </span>
                      </label>

                      <input
                        className={styles.input}
                        type="time"
                        value={row.overtimeAfter}
                        onChange={(e) => updateField(idx, "overtimeAfter", e.target.value)}
                        disabled={!row.overtimeEnabled}
                        title={row.overtimeEnabled ? "Overtime threshold (HH:MM)" : "Enable overtime to set threshold"}
                      />
                    </div>
                  ) : (
                    <span>
                      {row.overtimeEnabled
                        ? `Enabled after ${row.overtimeAfter || "-" }`
                        : "Disabled"}
                    </span>
                  )}
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(idx)}
                      title="Delete"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New entry row (visible only in edit mode) */}
            {editMode && (
              <tr className={styles.newRow}>
                {/* Check-In Time */}
                <td>
                  <input
                    className={styles.input}
                    type="time"
                    value={newEntry.checkInTime}
                    onChange={(e) => setNewEntry({ ...newEntry, checkInTime: e.target.value })}
                  />
                </td>

                {/* Check-Out Time */}
                <td>
                  <input
                    className={styles.input}
                    type="time"
                    value={newEntry.checkOutTime}
                    onChange={(e) => setNewEntry({ ...newEntry, checkOutTime: e.target.value })}
                  />
                </td>

                {/* Minimum Working Hours Required */}
                <td>
                  <input
                    className={styles.input}
                    type="time"
                    value={newEntry.minWorkingHours}
                    onChange={(e) => setNewEntry({ ...newEntry, minWorkingHours: e.target.value })}
                  />
                </td>

                {/* Half Day Working Hours */}
                <td>
                  <input
                    className={styles.input}
                    type="time"
                    value={newEntry.halfDayHours}
                    onChange={(e) => setNewEntry({ ...newEntry, halfDayHours: e.target.value })}
                  />
                </td>

                {/* Overtime Calculation */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={!!newEntry.overtimeEnabled}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            overtimeEnabled: e.target.checked,
                          })
                        }
                      />
                      <span style={{ fontSize: 12 }}>Enabled</span>
                    </label>

                    <input
                      className={styles.input}
                      type="time"
                      value={newEntry.overtimeAfter}
                      onChange={(e) => setNewEntry({ ...newEntry, overtimeAfter: e.target.value })}
                      disabled={!newEntry.overtimeEnabled}
                      title="Overtime threshold (HH:MM)"
                    />
                  </div>
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

      {/* Action buttons */}
      <div className={"d-flex justify-content-center p-3"}>
        {!editMode ? (
          <button className={"submitbtn"} onClick={handleEnterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className={"submitbtn"} onClick={handleSave}>
              Save
            </button>
            <button className={"cancelbtn"} onClick={handleCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ShiftsTimingsConfigurations;

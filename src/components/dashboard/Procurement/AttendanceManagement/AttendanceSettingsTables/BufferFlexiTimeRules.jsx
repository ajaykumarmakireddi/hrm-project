import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const defaultEntries = [
  {
    checkInBufferMinutes: 10,
    lateCheckInAction: "Mark Late",
    earlyCheckOutAction: "Warn",
    ignoreFirstXMinutesLate: 5,
  },
  {
    checkInBufferMinutes: 0,
    lateCheckInAction: "No Action",
    earlyCheckOutAction: "No Action",
    ignoreFirstXMinutesLate: 0,
  },
];

const blankNewEntry = {
  checkInBufferMinutes: 0,
  lateCheckInAction: "Mark Late",
  earlyCheckOutAction: "Warn",
  ignoreFirstXMinutesLate: 0,
};

const actionOptions = [
  "No Action",
  "Mark Late",
  "Warn",
  "Deduct Pay",
  "Escalate",
];

const BufferFlexiTimeRules = () => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // Enter edit mode
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

  // Update field for existing entry
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Delete a row
  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Add a new row
  const handleAddEntry = () => {
    // validate numeric fields
    if (newEntry.checkInBufferMinutes < 0 || newEntry.ignoreFirstXMinutesLate < 0) {
      alert("Minutes must be 0 or greater.");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Buffer & Flexi Time Rules</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Check-In Buffer Time (minutes)</th>
              <th>Late Check-In Action</th>
              <th>Early Check-Out Action</th>
              <th>Ignore First X Minutes Late</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                
                {/* Check-In Buffer Time */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={row.checkInBufferMinutes}
                      onChange={(e) =>
                        updateField(idx, "checkInBufferMinutes", Number(e.target.value))
                      }
                    />
                  ) : (
                    `${row.checkInBufferMinutes} min`
                  )}
                </td>

                {/* Late Check-In Action */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.lateCheckInAction}
                      onChange={(e) =>
                        updateField(idx, "lateCheckInAction", e.target.value)
                      }
                    >
                      {actionOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    row.lateCheckInAction
                  )}
                </td>

                {/* Early Check-Out Action */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.earlyCheckOutAction}
                      onChange={(e) =>
                        updateField(idx, "earlyCheckOutAction", e.target.value)
                      }
                    >
                      {actionOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    row.earlyCheckOutAction
                  )}
                </td>

                {/* Ignore First X Minutes Late */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={row.ignoreFirstXMinutesLate}
                      onChange={(e) =>
                        updateField(idx, "ignoreFirstXMinutesLate", Number(e.target.value))
                      }
                    />
                  ) : (
                    `${row.ignoreFirstXMinutesLate} min`
                  )}
                </td>

                {/* Delete Button */}
                {editMode && (
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(idx)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* NEW ENTRY ROW */}
            {editMode && (
              <tr className={styles.newRow}>
                {/* Check-In Buffer Time */}
                <td>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={newEntry.checkInBufferMinutes}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        checkInBufferMinutes: Number(e.target.value),
                      })
                    }
                  />
                </td>

                {/* Late Check-In Action */}
                <td>
                  <select
                    className={styles.select}
                    value={newEntry.lateCheckInAction}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, lateCheckInAction: e.target.value })
                    }
                  >
                    {actionOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </td>

                {/* Early Check-Out Action */}
                <td>
                  <select
                    className={styles.select}
                    value={newEntry.earlyCheckOutAction}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, earlyCheckOutAction: e.target.value })
                    }
                  >
                    {actionOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </td>

                {/* Ignore First X Minutes Late */}
                <td>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={newEntry.ignoreFirstXMinutesLate}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        ignoreFirstXMinutesLate: Number(e.target.value),
                      })
                    }
                  />
                </td>

                {/* Add Button */}
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
          <button className="submitbtn" onClick={handleEnterEdit}>Edit</button>
        ) : (
          <>
            <button className="submitbtn" onClick={handleSave}>Save</button>
            <button className="cancelbtn" onClick={handleCancel}>Cancel</button>
          </>
        )}
      </div>
    </>
  );
};

export default BufferFlexiTimeRules;

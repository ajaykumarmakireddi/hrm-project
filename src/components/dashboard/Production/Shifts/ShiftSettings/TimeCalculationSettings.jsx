import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";

const roundingRuleOptions = ["Round Up", "Round Down", "Nearest"];
const breakDeductionOptions = ["Automatic", "Manual", "Disabled"];

const dummyRows = [
  {
    roundingRule: "Round Up",
    roundingInterval: 5,
    breakDeduction: "Automatic",
    minPunchInterval: 2,
  },
  {
    roundingRule: "Nearest",
    roundingInterval: 10,
    breakDeduction: "Manual",
    minPunchInterval: 3,
  },
  {
    roundingRule: "Round Down",
    roundingInterval: 15,
    breakDeduction: "Disabled",
    minPunchInterval: 1,
  },
  {
    roundingRule: "Nearest",
    roundingInterval: 5,
    breakDeduction: "Automatic",
    minPunchInterval: 2,
  },
];

const blankRow = {
  roundingRule: "",
  roundingInterval: "",
  breakDeduction: "",
  minPunchInterval: "",
};

const TimeCalculationSettings = () => {
  const [rows, setRows] = useState(dummyRows);
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState(null);
  const [newRow, setNewRow] = useState(blankRow);

  // Enter edit mode
  const enterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(rows)));
    setEditMode(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    if (backupRows) setRows(backupRows);
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Save
  const save = () => {
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Update row field
  const updateField = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  // Delete row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Add new row
  const addRow = () => {
    if (
      !newRow.roundingRule ||
      !newRow.roundingInterval ||
      !newRow.breakDeduction ||
      !newRow.minPunchInterval
    ) {
      alert("Please fill all fields before adding.");
      return;
    }
    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  return (
    <>
      <h4 className={styles.title}>Time Calculation Settings</h4>

      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Rounding Rule</th>
              <th>Rounding Interval (mins)</th>
              <th>Break Deduction</th>
              <th>Minimum Punch Interval</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {/* Existing Rows */}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Rounding Rule */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.roundingRule}
                      onChange={(e) =>
                        updateField(idx, "roundingRule", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {roundingRuleOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.roundingRule}</span>
                  )}
                </td>

                {/* Rounding Interval */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.roundingInterval}
                      onChange={(e) =>
                        updateField(idx, "roundingInterval", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.roundingInterval}</span>
                  )}
                </td>

                {/* Break Deduction */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.breakDeduction}
                      onChange={(e) =>
                        updateField(idx, "breakDeduction", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {breakDeductionOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.breakDeduction}</span>
                  )}
                </td>

                {/* Minimum Punch Interval */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.minPunchInterval}
                      onChange={(e) =>
                        updateField(idx, "minPunchInterval", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.minPunchInterval}</span>
                  )}
                </td>

                {/* Delete */}
                {editMode && (
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteRow(idx)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New Row */}
            {editMode && (
              <tr>
                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.roundingRule}
                    onChange={(e) =>
                      setNewRow({ ...newRow, roundingRule: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {roundingRuleOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={newRow.roundingInterval}
                    onChange={(e) =>
                      setNewRow({ ...newRow, roundingInterval: e.target.value })
                    }
                  />
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.breakDeduction}
                    onChange={(e) =>
                      setNewRow({ ...newRow, breakDeduction: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {breakDeductionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={newRow.minPunchInterval}
                    onChange={(e) =>
                      setNewRow({
                        ...newRow,
                        minPunchInterval: e.target.value,
                      })
                    }
                  />
                </td>

                <td className={styles.actionsCell}>
                  <button className={styles.addBtn} onClick={addRow}>
                    + Add
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Buttons */}
      <div className="d-flex justify-content-center p-3">
        {!editMode ? (
          <button className="submitbtn" onClick={enterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className="submitbtn" onClick={save}>
              Save
            </button>
            <button className="cancelbtn" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default TimeCalculationSettings;

import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const otCalculationOptions = ["Before Shift", "After Shift", "Both"];
const otCompensationOptions = ["Paid", "Comp-Off", "None"];

const dummyRows = [
  {
    enableOT: true,
    otCalculation: "Before Shift",
    minOTMinutes: 30,
    otCompMode: "Paid",
    otRateMultiplier: 1.5,
    requireApproval: true,
    maxOTPerDay: 120,
  },
  {
    enableOT: false,
    otCalculation: "After Shift",
    minOTMinutes: 45,
    otCompMode: "Comp-Off",
    otRateMultiplier: 1.2,
    requireApproval: false,
    maxOTPerDay: 90,
  },
  {
    enableOT: true,
    otCalculation: "Both",
    minOTMinutes: 60,
    otCompMode: "None",
    otRateMultiplier: 1.0,
    requireApproval: true,
    maxOTPerDay: 150,
  },
  {
    enableOT: true,
    otCalculation: "After Shift",
    minOTMinutes: 20,
    otCompMode: "Paid",
    otRateMultiplier: 2.0,
    requireApproval: false,
    maxOTPerDay: 180,
  },
];

const blankRow = {
  enableOT: false,
  otCalculation: "",
  minOTMinutes: "",
  otCompMode: "",
  otRateMultiplier: "",
  requireApproval: false,
  maxOTPerDay: "",
};

const OvertimeRulesSettings = () => {
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
      !newRow.otCalculation ||
      !newRow.minOTMinutes ||
      !newRow.otCompMode ||
      !newRow.otRateMultiplier ||
      !newRow.maxOTPerDay
    ) {
      alert("Please fill all fields before adding.");
      return;
    }
    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  return (
    <>
      <h4 className={styles.title}>Overtime Rules Settings</h4>

      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Enable OT</th>
              <th>OT Calculation</th>
              <th>Min OT Minutes</th>
              <th>Compensation Mode</th>
              <th>OT Rate Multiplier</th>
              <th>Require Manager Approval</th>
              <th>Max OT / Day</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {/* Existing Rows */}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Enable OT */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.enableOT}
                      setChecked={(val) =>
                        updateField(idx, "enableOT", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch checked={row.enableOT} disabled />
                  )}
                </td>

                {/* OT Calculation */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.otCalculation}
                      onChange={(e) =>
                        updateField(idx, "otCalculation", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {otCalculationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.otCalculation}</span>
                  )}
                </td>

                {/* Minimum OT Minutes */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.minOTMinutes}
                      onChange={(e) =>
                        updateField(idx, "minOTMinutes", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.minOTMinutes}</span>
                  )}
                </td>

                {/* OT Compensation */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.otCompMode}
                      onChange={(e) =>
                        updateField(idx, "otCompMode", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {otCompensationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.otCompMode}</span>
                  )}
                </td>

                {/* OT Rate Multiplier */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      step="0.1"
                      className={styles.input}
                      value={row.otRateMultiplier}
                      onChange={(e) =>
                        updateField(idx, "otRateMultiplier", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.otRateMultiplier}</span>
                  )}
                </td>

                {/* Require Manager Approval */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.requireApproval}
                      setChecked={(val) =>
                        updateField(idx, "requireApproval", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch checked={row.requireApproval} disabled />
                  )}
                </td>

                {/* Max OT Per Day */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.maxOTPerDay}
                      onChange={(e) =>
                        updateField(idx, "maxOTPerDay", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.maxOTPerDay}</span>
                  )}
                </td>

                {/* Delete Action */}
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
                  <BootstrapSwitch
                    checked={newRow.enableOT}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, enableOT: val })
                    }
                  />
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.otCalculation}
                    onChange={(e) =>
                      setNewRow({ ...newRow, otCalculation: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {otCalculationOptions.map((opt) => (
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
                    value={newRow.minOTMinutes}
                    onChange={(e) =>
                      setNewRow({ ...newRow, minOTMinutes: e.target.value })
                    }
                  />
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.otCompMode}
                    onChange={(e) =>
                      setNewRow({ ...newRow, otCompMode: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {otCompensationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.input}
                    value={newRow.otRateMultiplier}
                    onChange={(e) =>
                      setNewRow({ ...newRow, otRateMultiplier: e.target.value })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={newRow.requireApproval}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, requireApproval: val })
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={newRow.maxOTPerDay}
                    onChange={(e) =>
                      setNewRow({ ...newRow, maxOTPerDay: e.target.value })
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

export default OvertimeRulesSettings;

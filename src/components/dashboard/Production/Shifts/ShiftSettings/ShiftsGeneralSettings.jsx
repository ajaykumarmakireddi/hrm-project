import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const shiftOptions = [
  "Morning Shift (9AM-5PM)",
  "Afternoon Shift (1PM-9PM)",
  "Night Shift (10PM-6AM)",
  "Flexible Shift",
  "Rotational Shift",
];

const dummyRows = [
  {
    enableShiftManagement: true,
    defaultShift: "Morning Shift (9AM-5PM)",
    maxShiftsPerDay: 2,
    allowMultipleShifts: false,
  },
  {
    enableShiftManagement: false,
    defaultShift: "Night Shift (10PM-6AM)",
    maxShiftsPerDay: 1,
    allowMultipleShifts: false,
  },
  {
    enableShiftManagement: true,
    defaultShift: "Flexible Shift",
    maxShiftsPerDay: 3,
    allowMultipleShifts: true,
  },
];

const blankRow = {
  enableShiftManagement: false,
  defaultShift: "",
  maxShiftsPerDay: "",
  allowMultipleShifts: false,
};

const ShiftsGeneralSettings = () => {
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

  // Add new row
  const addRow = () => {
    if (!newRow.defaultShift) {
      alert("Please select a shift.");
      return;
    }
    if (!newRow.maxShiftsPerDay) {
      alert("Please enter max shifts/day.");
      return;
    }

    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  // Delete row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <>
      <h4 className={styles.title}>General Settings</h4>

      <div className={"d-flex justify-content-center"}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Enable Shift Mgmt</th>
              <th>Default Shift</th>
              <th>Max Shifts / Day</th>
              <th>Allow Multiple Shifts</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {/* Existing Rows */}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Enable Shift Mgmt */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.enableShiftManagement}
                      setChecked={(val) =>
                        updateField(idx, "enableShiftManagement", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch
                      checked={row.enableShiftManagement}
                      disabled={true}
                    />
                  )}
                </td>

                {/* Default Shift */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.defaultShift}
                      onChange={(e) =>
                        updateField(idx, "defaultShift", e.target.value)
                      }
                    >
                      <option value="">Select shift…</option>
                      {shiftOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.defaultShift}</span>
                  )}
                </td>

                {/* Max shifts/day */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.maxShiftsPerDay}
                      onChange={(e) =>
                        updateField(idx, "maxShiftsPerDay", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.maxShiftsPerDay}</span>
                  )}
                </td>

                {/* Allow Multiple */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.allowMultipleShifts}
                      setChecked={(val) =>
                        updateField(idx, "allowMultipleShifts", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch
                      checked={row.allowMultipleShifts}
                      disabled={true}
                    />
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

            {/* New row */}
            {editMode && (
              <tr>
                <td>
                  <BootstrapSwitch
                    checked={newRow.enableShiftManagement}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, enableShiftManagement: val })
                    }
                  />
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.defaultShift}
                    onChange={(e) =>
                      setNewRow({ ...newRow, defaultShift: e.target.value })
                    }
                  >
                    <option value="">Select shift…</option>
                    {shiftOptions.map((opt) => (
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
                    value={newRow.maxShiftsPerDay}
                    onChange={(e) =>
                      setNewRow({
                        ...newRow,
                        maxShiftsPerDay: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={newRow.allowMultipleShifts}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, allowMultipleShifts: val })
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

      {/* Bottom buttons */}
      <div className={"d-flex justify-content-center p-3"}>
        {!editMode ? (
          <button className={"submitbtn"} onClick={enterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className={"submitbtn"} onClick={save}>
              Save
            </button>
            <button className={"cancelbtn"} onClick={cancelEdit}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ShiftsGeneralSettings;

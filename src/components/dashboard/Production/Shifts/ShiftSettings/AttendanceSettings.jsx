import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const statusOptions = ["Duration", "Time-based", "Custom"];

const dummyRows = [
  {
    allowCheckInWithoutShift: true,
    autoAssignShift: false,
    minWorkingHours: 8,
    attendanceStatusLogic: "Duration",
    halfDayCriteria: 4,
  },
  {
    allowCheckInWithoutShift: false,
    autoAssignShift: true,
    minWorkingHours: 9,
    attendanceStatusLogic: "Time-based",
    halfDayCriteria: 5,
  },
  {
    allowCheckInWithoutShift: true,
    autoAssignShift: true,
    minWorkingHours: 7,
    attendanceStatusLogic: "Custom",
    halfDayCriteria: 3,
  },
  {
    allowCheckInWithoutShift: false,
    autoAssignShift: false,
    minWorkingHours: 6,
    attendanceStatusLogic: "Duration",
    halfDayCriteria: 3,
  },
];

const blankRow = {
  allowCheckInWithoutShift: false,
  autoAssignShift: false,
  minWorkingHours: "",
  attendanceStatusLogic: "",
  halfDayCriteria: "",
};

const AttendanceSettings = () => {
  const [rows, setRows] = useState(dummyRows);
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState(null);
  const [newRow, setNewRow] = useState(blankRow);

  // Enter Edit Mode
  const enterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(rows)));
    setEditMode(true);
  };

  // Cancel Editing
  const cancelEdit = () => {
    if (backupRows) setRows(backupRows);
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Save Changes
  const save = () => {
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Update field
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
      !newRow.minWorkingHours ||
      !newRow.attendanceStatusLogic ||
      !newRow.halfDayCriteria
    ) {
      alert("Please fill all fields before adding.");
      return;
    }
    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  return (
    <>
      <h4 className={styles.title}>Attendance Settings</h4>

      <div className={"d-flex justify-content-center"}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Allow Check-in w/o Shift</th>
              <th>Auto Assign Best Shift</th>
              <th>Min Working Hrs</th>
              <th>Attendance Status Logic</th>
              <th>Half Day Criteria</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {/* Existing Rows */}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Allow Check-in Without Shift */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.allowCheckInWithoutShift}
                      setChecked={(val) =>
                        updateField(idx, "allowCheckInWithoutShift", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch
                      checked={row.allowCheckInWithoutShift}
                      disabled
                    />
                  )}
                </td>

                {/* Auto Assign Best Shift */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.autoAssignShift}
                      setChecked={(val) =>
                        updateField(idx, "autoAssignShift", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch checked={row.autoAssignShift} disabled />
                  )}
                </td>

                {/* Minimum Working Hours */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.minWorkingHours}
                      onChange={(e) =>
                        updateField(idx, "minWorkingHours", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.minWorkingHours}</span>
                  )}
                </td>

                {/* Attendance Status Logic */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.attendanceStatusLogic}
                      onChange={(e) =>
                        updateField(
                          idx,
                          "attendanceStatusLogic",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select...</option>
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.attendanceStatusLogic}</span>
                  )}
                </td>

                {/* Half Day Criteria */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.halfDayCriteria}
                      onChange={(e) =>
                        updateField(idx, "halfDayCriteria", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.halfDayCriteria}</span>
                  )}
                </td>

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
                    checked={newRow.allowCheckInWithoutShift}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, allowCheckInWithoutShift: val })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={newRow.autoAssignShift}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, autoAssignShift: val })
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={newRow.minWorkingHours}
                    onChange={(e) =>
                      setNewRow({ ...newRow, minWorkingHours: e.target.value })
                    }
                  />
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.attendanceStatusLogic}
                    onChange={(e) =>
                      setNewRow({
                        ...newRow,
                        attendanceStatusLogic: e.target.value,
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {statusOptions.map((opt) => (
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
                    value={newRow.halfDayCriteria}
                    onChange={(e) =>
                      setNewRow({ ...newRow, halfDayCriteria: e.target.value })
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

export default AttendanceSettings;

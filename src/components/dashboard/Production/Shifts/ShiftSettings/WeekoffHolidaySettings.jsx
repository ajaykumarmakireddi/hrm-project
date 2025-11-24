import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const weekDays = [
  { value: "Mon", label: "Mon" },
  { value: "Tue", label: "Tue" },
  { value: "Wed", label: "Wed" },
  { value: "Thu", label: "Thu" },
  { value: "Fri", label: "Fri" },
  { value: "Sat", label: "Sat" },
  { value: "Sun", label: "Sun" },
];

const weekoffPatterns = ["Fixed", "Rotational", "Alternate"];
const holidayCompensationOptions = ["Comp-off", "OT", "Double-pay"];

const dummyRows = [
  {
    weekoffPattern: "Fixed",
    weekoffDays: ["Sat", "Sun"],
    autoAssignCompOff: true,
    holidayWorkComp: "Comp-off",
  },
  {
    weekoffPattern: "Rotational",
    weekoffDays: ["Mon"],
    autoAssignCompOff: false,
    holidayWorkComp: "OT",
  },
  {
    weekoffPattern: "Alternate",
    weekoffDays: ["Fri", "Sun"],
    autoAssignCompOff: true,
    holidayWorkComp: "Double-pay",
  },
  {
    weekoffPattern: "Fixed",
    weekoffDays: ["Sun"],
    autoAssignCompOff: false,
    holidayWorkComp: "OT",
  },
];

const blankRow = {
  weekoffPattern: "",
  weekoffDays: [],
  autoAssignCompOff: false,
  holidayWorkComp: "",
};

const WeekoffHolidaySettings = () => {
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

  // Save changes
  const save = () => {
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Update row property
  const updateField = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  // Toggle day selection for existing rows
  const toggleDay = (idx, day) => {
    const updated = [...rows];
    const days = updated[idx].weekoffDays;

    if (days.includes(day)) {
      updated[idx].weekoffDays = days.filter((d) => d !== day);
    } else {
      updated[idx].weekoffDays = [...days, day];
    }

    setRows(updated);
  };

  // Toggle day selection for new row
  const toggleNewDay = (day) => {
    const days = newRow.weekoffDays;

    if (days.includes(day)) {
      setNewRow({ ...newRow, weekoffDays: days.filter((d) => d !== day) });
    } else {
      setNewRow({ ...newRow, weekoffDays: [...days, day] });
    }
  };

  // Delete row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Add new entry
  const addRow = () => {
    if (
      !newRow.weekoffPattern ||
      !newRow.weekoffDays.length ||
      !newRow.holidayWorkComp
    ) {
      alert("Please fill all fields before adding.");
      return;
    }

    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  return (
    <>
      <h4 className={styles.title}>Week-off & Holiday Settings</h4>

      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Week-off Pattern</th>
              <th>Week-off Days</th>
              <th>Auto Assign Comp-off</th>
              <th>Holiday Work Compensation</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {/* Existing records */}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Week-off Pattern */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.weekoffPattern}
                      onChange={(e) =>
                        updateField(idx, "weekoffPattern", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {weekoffPatterns.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.weekoffPattern}</span>
                  )}
                </td>

                {/* Week-off Days (Multi-select buttons) */}
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    {weekDays.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        className={`btn btn-sm ${
                          row.weekoffDays.includes(d.value)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        disabled={!editMode}
                        onClick={() => toggleDay(idx, d.value)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </td>

                {/* Auto Assign Comp-off */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.autoAssignCompOff}
                      setChecked={(val) =>
                        updateField(idx, "autoAssignCompOff", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch checked={row.autoAssignCompOff} disabled />
                  )}
                </td>

                {/* Holiday Work Compensation */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.holidayWorkComp}
                      onChange={(e) =>
                        updateField(idx, "holidayWorkComp", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {holidayCompensationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.holidayWorkComp}</span>
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
                {/* Pattern */}
                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.weekoffPattern}
                    onChange={(e) =>
                      setNewRow({ ...newRow, weekoffPattern: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {weekoffPatterns.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Week-off Days Multi-select */}
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    {weekDays.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        className={`btn btn-sm ${
                          newRow.weekoffDays.includes(d.value)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => toggleNewDay(d.value)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </td>

                {/* Auto Assign Comp-off */}
                <td>
                  <BootstrapSwitch
                    checked={newRow.autoAssignCompOff}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, autoAssignCompOff: val })
                    }
                  />
                </td>

                {/* Holiday Work Compensation */}
                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.holidayWorkComp}
                    onChange={(e) =>
                      setNewRow({ ...newRow, holidayWorkComp: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {holidayCompensationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Add */}
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

      {/* Footer Buttons */}
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

export default WeekoffHolidaySettings;

import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const defaultEntries = [
  {
    attendanceRulesMode: "role-based", // "role-based" | "employee-based" | "both"
    timeZone: "Asia/Kolkata",
    workWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    defaultShiftSchedule: "Morning (9AM-5PM)",
  },
  {
    attendanceRulesMode: "employee-based",
    timeZone: "UTC",
    workWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    defaultShiftSchedule: "Flexible",
  },
];

const blankNewEntry = {
  attendanceRulesMode: "role-based",
  timeZone: "Asia/Kolkata",
  workWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  defaultShiftSchedule: "Morning (9AM-5PM)",
};

const timeZoneOptions = [
  "UTC",
  "Europe/London",
  "America/New_York",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];

const shiftOptions = [
  "Morning (9AM-5PM)",
  "Flexible",
  "Night (10PM-6AM)",
  "Rotational",
];

const allDays = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
];

const GeneralSettings = ({ navigate }) => {
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

  // handle changes from a native multiple select for workWeek
  const handleWorkWeekChange = (index, selectedOptions) => {
    const values = Array.from(selectedOptions).map((opt) => opt.value);
    updateField(index, "workWeek", values);
  };

  // Delete a row
  const handleDelete = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  // Add new entry
  const handleAddEntry = () => {
    // basic validation: require a timeZone and at least one work day
    if (!newEntry.timeZone || !Array.isArray(newEntry.workWeek) || newEntry.workWeek.length === 0) {
      alert("Please select a Time Zone and at least one Work Week day.");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  const renderWorkWeek = (arr) => (Array.isArray(arr) && arr.length ? arr.join(", ") : "-");

  return (
    <>
      <h4 className={styles.title}>General Settings</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Attendance Rules Mode</th>
              <th>Time Zone</th>
              <th>Work Week</th>
              <th>Default Shift Schedule</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Attendance Rules Mode (radio when editing, text otherwise) */}
                <td>
                  {editMode ? (
                    <div>
                      <label style={{ marginRight: 8 }}>
                        <input
                          type="radio"
                          name={`attendanceMode_${idx}`}
                          value="role-based"
                          checked={row.attendanceRulesMode === "role-based"}
                          onChange={() => updateField(idx, "attendanceRulesMode", "role-based")}
                        />{" "}
                        Role-based
                      </label>

                      <label style={{ marginRight: 8 }}>
                        <input
                          type="radio"
                          name={`attendanceMode_${idx}`}
                          value="employee-based"
                          checked={row.attendanceRulesMode === "employee-based"}
                          onChange={() => updateField(idx, "attendanceRulesMode", "employee-based")}
                        />{" "}
                        Employee-based
                      </label>

                      <label>
                        <input
                          type="radio"
                          name={`attendanceMode_${idx}`}
                          value="both"
                          checked={row.attendanceRulesMode === "both"}
                          onChange={() => updateField(idx, "attendanceRulesMode", "both")}
                        />{" "}
                        Both
                      </label>
                    </div>
                  ) : (
                    <span>
                      {row.attendanceRulesMode === "role-based"
                        ? "Role-based"
                        : row.attendanceRulesMode === "employee-based"
                        ? "Employee-based"
                        : "Both"}
                    </span>
                  )}
                </td>

                {/* Time Zone */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.timeZone}
                      onChange={(e) => updateField(idx, "timeZone", e.target.value)}
                    >
                      {timeZoneOptions.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.timeZone}</span>
                  )}
                </td>

                {/* Work Week (multi-select) */}
                <td>
                  {editMode ? (
                    <select
                      multiple
                      className={styles.select}
                      value={row.workWeek}
                      onChange={(e) => handleWorkWeekChange(idx, e.target.selectedOptions)}
                      size={4}
                    >
                      {allDays.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{renderWorkWeek(row.workWeek)}</span>
                  )}
                </td>

                {/* Default Shift Schedule */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.defaultShiftSchedule}
                      onChange={(e) => updateField(idx, "defaultShiftSchedule", e.target.value)}
                    >
                      {shiftOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.defaultShiftSchedule}</span>
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
                {/* Attendance Rules Mode - radios */}
                <td>
                  <div>
                    <label style={{ marginRight: 8 }}>
                      <input
                        type="radio"
                        name="attendanceMode_new"
                        value="role-based"
                        checked={newEntry.attendanceRulesMode === "role-based"}
                        onChange={() => setNewEntry({ ...newEntry, attendanceRulesMode: "role-based" })}
                      />{" "}
                      Role
                    </label>

                    <label style={{ marginRight: 8 }}>
                      <input
                        type="radio"
                        name="attendanceMode_new"
                        value="employee-based"
                        checked={newEntry.attendanceRulesMode === "employee-based"}
                        onChange={() => setNewEntry({ ...newEntry, attendanceRulesMode: "employee-based" })}
                      />{" "}
                      Employee
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="attendanceMode_new"
                        value="both"
                        checked={newEntry.attendanceRulesMode === "both"}
                        onChange={() => setNewEntry({ ...newEntry, attendanceRulesMode: "both" })}
                      />{" "}
                      Both
                    </label>
                  </div>
                </td>

                {/* Time Zone */}
                <td>
                  <select
                    className={styles.select}
                    value={newEntry.timeZone}
                    onChange={(e) => setNewEntry({ ...newEntry, timeZone: e.target.value })}
                  >
                    {timeZoneOptions.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Work Week multi-select */}
                <td>
                  <select
                    multiple
                    className={styles.select}
                    value={newEntry.workWeek}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        workWeek: Array.from(e.target.selectedOptions).map((o) => o.value),
                      })
                    }
                    size={4}
                  >
                    {allDays.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Default Shift Schedule */}
                <td>
                  <select
                    className={styles.select}
                    value={newEntry.defaultShiftSchedule}
                    onChange={(e) => setNewEntry({ ...newEntry, defaultShiftSchedule: e.target.value })}
                  >
                    {shiftOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
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

export default GeneralSettings;

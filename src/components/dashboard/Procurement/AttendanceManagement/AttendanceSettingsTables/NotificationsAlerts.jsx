import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const defaultEntries = [
  {
    lateCheckInNotification: true,
    managerMissedAttendanceNotification: false,
    dailySummaryEmail: true,
    shiftStartReminderTime: "08:50", // HH:MM
  },
  {
    lateCheckInNotification: false,
    managerMissedAttendanceNotification: true,
    dailySummaryEmail: false,
    shiftStartReminderTime: "09:00",
  },
];

const blankNewEntry = {
  lateCheckInNotification: false,
  managerMissedAttendanceNotification: false,
  dailySummaryEmail: false,
  shiftStartReminderTime: "09:00",
};

const NotificationsAlerts = () => {
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
      <h4 className={styles.title}>Notifications & Alerts</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Late Check-In Notification</th>
              <th>Manager Notification for Missed Attendance</th>
              <th>Daily Summary Email</th>
              <th>Shift Start Reminder</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Late Check-In Notification */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.lateCheckInNotification}
                        onChange={(e) => updateField(idx, "lateCheckInNotification", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.lateCheckInNotification ? "On" : "Off"}</span>
                    </label>
                  ) : (
                    row.lateCheckInNotification ? "On" : "Off"
                  )}
                </td>

                {/* Manager Notification for Missed Attendance */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.managerMissedAttendanceNotification}
                        onChange={(e) => updateField(idx, "managerMissedAttendanceNotification", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.managerMissedAttendanceNotification ? "On" : "Off"}</span>
                    </label>
                  ) : (
                    row.managerMissedAttendanceNotification ? "On" : "Off"
                  )}
                </td>

                {/* Daily Summary Email */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.dailySummaryEmail}
                        onChange={(e) => updateField(idx, "dailySummaryEmail", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.dailySummaryEmail ? "On" : "Off"}</span>
                    </label>
                  ) : (
                    row.dailySummaryEmail ? "On" : "Off"
                  )}
                </td>

                {/* Shift Start Reminder (time picker) */}
                <td>
                  {editMode ? (
                    <input
                      className={styles.input}
                      type="time"
                      value={row.shiftStartReminderTime}
                      onChange={(e) => updateField(idx, "shiftStartReminderTime", e.target.value)}
                    />
                  ) : (
                    row.shiftStartReminderTime || "-"
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
                      checked={!!newEntry.lateCheckInNotification}
                      onChange={(e) => setNewEntry({ ...newEntry, lateCheckInNotification: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.lateCheckInNotification ? "On" : "Off"}</span>
                  </label>
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.managerMissedAttendanceNotification}
                      onChange={(e) => setNewEntry({ ...newEntry, managerMissedAttendanceNotification: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.managerMissedAttendanceNotification ? "On" : "Off"}</span>
                  </label>
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.dailySummaryEmail}
                      onChange={(e) => setNewEntry({ ...newEntry, dailySummaryEmail: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.dailySummaryEmail ? "On" : "Off"}</span>
                  </label>
                </td>

                <td>
                  <input
                    className={styles.input}
                    type="time"
                    value={newEntry.shiftStartReminderTime}
                    onChange={(e) => setNewEntry({ ...newEntry, shiftStartReminderTime: e.target.value })}
                  />
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

export default NotificationsAlerts;

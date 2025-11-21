import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

/**
 * NotificationsSettings
 *
 * Table columns:
 * - Notify Manager On Request (toggle)
 * - Notify Employee on Approval / Rejection (toggle)
 * - Send Leave Balance Reminder (toggle + frequency dropdown)
 *
 * Preserves Edit / Save / Cancel, Add, Delete behaviors.
 */

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const defaultEntries = [
  {
    notifyManagerOnRequest: true,
    notifyEmployeeOnDecision: true,
    sendBalanceReminder: true,
    reminderFrequency: "monthly",
  },
  {
    notifyManagerOnRequest: false,
    notifyEmployeeOnDecision: true,
    sendBalanceReminder: false,
    reminderFrequency: "weekly", // stored but unused when toggle is off
  },
];

const blankNewEntry = {
  notifyManagerOnRequest: false,
  notifyEmployeeOnDecision: false,
  sendBalanceReminder: false,
  reminderFrequency: "monthly",
};

const NotificationsSettings = ({ navigate }) => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // enter edit mode: keep backup for cancel
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(entries)));
    setEditMode(true);
  };

  // cancel -> revert
  const handleCancel = () => {
    if (backupEntries) setEntries(backupEntries);
    setNewEntry(blankNewEntry);
    setBackupEntries(null);
    setEditMode(false);
  };

  // save -> commit
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEditMode(false);
    // add API call here if needed
  };

  // update field for existing row
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // toggle boolean field for existing row
  const toggleField = (index, field) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: !updated[index][field] };
    setEntries(updated);
  };

  // delete row
  const handleDelete = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  // add new entry
  const handleAddEntry = () => {
    // simple validation: if reminder toggle is on, frequency must exist
    if (newEntry.sendBalanceReminder && !newEntry.reminderFrequency) {
      alert("Please select a reminder frequency.");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Notification Settings</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Notify Manager On Request</th>
              <th>Notify Employee on Approval / Rejection</th>
              <th>Send Leave Balance Reminder</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Notify Manager On Request (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.notifyManagerOnRequest}
                    onChange={() => {
                      if (editMode) toggleField(idx, "notifyManagerOnRequest");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Notify Employee on Approval / Rejection (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.notifyEmployeeOnDecision}
                    onChange={() => {
                      if (editMode) toggleField(idx, "notifyEmployeeOnDecision");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Send Leave Balance Reminder (toggle + frequency) */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <BootstrapSwitch
                      checked={!!row.sendBalanceReminder}
                      onChange={() => {
                        if (editMode) toggleField(idx, "sendBalanceReminder");
                      }}
                      disabled={!editMode}
                    />

                    {editMode ? (
                      <select
                        className={styles.select}
                        value={row.reminderFrequency}
                        onChange={(e) =>
                          updateField(idx, "reminderFrequency", e.target.value)
                        }
                        disabled={!row.sendBalanceReminder}
                      >
                        {frequencyOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {row.sendBalanceReminder
                          ? frequencyOptions.find(
                              (f) => f.value === row.reminderFrequency
                            )?.label || row.reminderFrequency
                          : "Disabled"}
                      </span>
                    )}
                  </div>
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(idx)}
                      title="Delete"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New entry row (visible only in edit mode) */}
            {editMode && (
              <tr className={styles.newRow}>
                {/* Notify Manager On Request */}
                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.notifyManagerOnRequest}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        notifyManagerOnRequest: !newEntry.notifyManagerOnRequest,
                      })
                    }
                  />
                </td>

                {/* Notify Employee on Approval / Rejection */}
                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.notifyEmployeeOnDecision}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        notifyEmployeeOnDecision:
                          !newEntry.notifyEmployeeOnDecision,
                      })
                    }
                  />
                </td>

                {/* Send Leave Balance Reminder (toggle + frequency) */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <BootstrapSwitch
                      checked={!!newEntry.sendBalanceReminder}
                      onChange={() =>
                        setNewEntry({
                          ...newEntry,
                          sendBalanceReminder: !newEntry.sendBalanceReminder,
                        })
                      }
                    />

                    <select
                      className={styles.select}
                      value={newEntry.reminderFrequency}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          reminderFrequency: e.target.value,
                        })
                      }
                      disabled={!newEntry.sendBalanceReminder}
                    >
                      {frequencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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

export default NotificationsSettings;

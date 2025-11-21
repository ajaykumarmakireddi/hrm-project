import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

/**
 * NotificationsSettings (with action buttons)
 *
 * Columns:
 * - Notify Manager On Request (toggle + button)
 * - Notify Employee on Approval / Rejection (toggle + button)
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
    // UI-only helper to show button state (configured or not)
    managerConfigured: false,
    employeeConfigured: false,
  },
  {
    notifyManagerOnRequest: false,
    notifyEmployeeOnDecision: true,
    sendBalanceReminder: false,
    reminderFrequency: "weekly",
    managerConfigured: false,
    employeeConfigured: false,
  },
];

const blankNewEntry = {
  notifyManagerOnRequest: false,
  notifyEmployeeOnDecision: false,
  sendBalanceReminder: false,
  reminderFrequency: "monthly",
  managerConfigured: false,
  employeeConfigured: false,
};

const AddManageLeaveTypes = ({ navigate }) => {
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

  // Placeholder action for the new buttons.
  // Replace with real behavior (open modal, navigate, API call).
  const handleManagerButton = (index) => {
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      managerConfigured: !updated[index].managerConfigured,
    };
    setEntries(updated);
  };

  const handleEmployeeButton = (index) => {
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      employeeConfigured: !updated[index].employeeConfigured,
    };
    setEntries(updated);
  };

  // New-entry versions of the buttons (operate on the newEntry preview)
  const handleNewManagerButton = () => {
    setNewEntry({ ...newEntry, managerConfigured: !newEntry.managerConfigured });
  };
  const handleNewEmployeeButton = () => {
    setNewEntry({
      ...newEntry,
      employeeConfigured: !newEntry.employeeConfigured,
    });
  };

  return (
    <>
      <h4 className={styles.title}>Add / Manage Leave Types</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Add New Leave Type</th>
              <th>Delete Leave Type</th>
              
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Notify Manager On Request (toggle + button) */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BootstrapSwitch
                      checked={!!row.notifyManagerOnRequest}
                      onChange={() => {
                        if (editMode) toggleField(idx, "notifyManagerOnRequest");
                      }}
                      disabled={!editMode}
                    />

                    {/* Action button next to the toggle */}
                    <button
                      type="button"
                      className={styles.smallButton}
                      onClick={() => {
                        if (!editMode) return;
                        handleManagerButton(idx);
                      }}
                      disabled={!editMode}
                      title="Configure manager notification"
                    >
                      {row.managerConfigured ? "Configured" : "Configure"}
                    </button>
                  </div>
                </td>

                {/* Notify Employee on Approval / Rejection (toggle + button) */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BootstrapSwitch
                      checked={!!row.notifyEmployeeOnDecision}
                      onChange={() => {
                        if (editMode) toggleField(idx, "notifyEmployeeOnDecision");
                      }}
                      disabled={!editMode}
                    />

                    <button
                      type="button"
                      className={styles.smallButton}
                      onClick={() => {
                        if (!editMode) return;
                        handleEmployeeButton(idx);
                      }}
                      disabled={!editMode}
                      title="Configure employee notification"
                    >
                      {row.employeeConfigured ? "Configured" : "Configure"}
                    </button>
                  </div>
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
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BootstrapSwitch
                      checked={!!newEntry.notifyManagerOnRequest}
                      onChange={() =>
                        setNewEntry({
                          ...newEntry,
                          notifyManagerOnRequest: !newEntry.notifyManagerOnRequest,
                        })
                      }
                    />

                    <button
                      type="button"
                      className={styles.smallButton}
                      onClick={() => handleNewManagerButton()}
                      title="Configure manager notification"
                    >
                      {newEntry.managerConfigured ? "Configured" : "Configure"}
                    </button>
                  </div>
                </td>

                {/* Notify Employee on Approval / Rejection */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

                    <button
                      type="button"
                      className={styles.smallButton}
                      onClick={() => handleNewEmployeeButton()}
                      title="Configure employee notification"
                    >
                      {newEntry.employeeConfigured ? "Configured" : "Configure"}
                    </button>
                  </div>
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

export default AddManageLeaveTypes;

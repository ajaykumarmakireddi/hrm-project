import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

/**
 * ApprovalWorkFlow
 *
 * Table columns:
 * - Leave Approver (dropdown selector)
 * - Multi-Level Approval (toggle)
 * - Auto-approve if no response in X days (numeric)
 * - Allow Cancellation (toggle)
 * - Allow Editing Existing Request (toggle)
 *
 * Preserves Edit / Save / Cancel, Add, Delete behaviors.
 */

const approverOptions = [
  { value: "manager", label: "Manager" },
  { value: "team_lead", label: "Team Lead" },
  { value: "hr", label: "HR" },
  { value: "self", label: "Self" },
];

const defaultEntries = [
  {
    approver: "manager",
    multiLevelApproval: true,
    autoApproveAfterDays: "3",
    allowCancellation: true,
    allowEditExistingRequest: false,
  },
  {
    approver: "hr",
    multiLevelApproval: false,
    autoApproveAfterDays: "7",
    allowCancellation: false,
    allowEditExistingRequest: true,
  },
];

const blankNewEntry = {
  approver: "manager",
  multiLevelApproval: false,
  autoApproveAfterDays: "",
  allowCancellation: false,
  allowEditExistingRequest: false,
};

const ApprovalWorkFlow = ({ navigate }) => {
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
    // basic validation: approver required; autoApproveAfterDays must be numeric if provided
    if (!newEntry.approver) {
      alert("Please select an approver.");
      return;
    }
    if (
      newEntry.autoApproveAfterDays !== "" &&
      isNaN(Number(newEntry.autoApproveAfterDays))
    ) {
      alert("Auto-approve days must be a number.");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Approval Workflow</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Leave Approver</th>
              <th>Multi-Level Approval</th>
              <th>Auto-approve if no response (days)</th>
              <th>Allow Cancellation</th>
              <th>Allow Editing Existing Request</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Leave Approver */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.approver}
                      onChange={(e) => updateField(idx, "approver", e.target.value)}
                    >
                      {approverOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>
                      {approverOptions.find((o) => o.value === row.approver)?.label ||
                        row.approver}
                    </span>
                  )}
                </td>

                {/* Multi-Level Approval */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.multiLevelApproval}
                    onChange={() => {
                      if (editMode) toggleField(idx, "multiLevelApproval");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Auto-approve if no response in X days */}
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={row.autoApproveAfterDays}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "autoApproveAfterDays", e.target.value)
                    }
                  />
                </td>

                {/* Allow Cancellation */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.allowCancellation}
                    onChange={() => {
                      if (editMode) toggleField(idx, "allowCancellation");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Allow Editing Existing Request */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.allowEditExistingRequest}
                    onChange={() => {
                      if (editMode) toggleField(idx, "allowEditExistingRequest");
                    }}
                    disabled={!editMode}
                  />
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
                <td>
                  <select
                    className={styles.select}
                    value={newEntry.approver}
                    onChange={(e) => setNewEntry({ ...newEntry, approver: e.target.value })}
                  >
                    {approverOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.multiLevelApproval}
                    onChange={() =>
                      setNewEntry({ ...newEntry, multiLevelApproval: !newEntry.multiLevelApproval })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={newEntry.autoApproveAfterDays}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, autoApproveAfterDays: e.target.value })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.allowCancellation}
                    onChange={() =>
                      setNewEntry({ ...newEntry, allowCancellation: !newEntry.allowCancellation })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.allowEditExistingRequest}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        allowEditExistingRequest: !newEntry.allowEditExistingRequest,
                      })
                    }
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

export default ApprovalWorkFlow;

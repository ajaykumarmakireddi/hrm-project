import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

/**
 * VisibilityUsage
 *
 * Table columns:
 * - Allow Partial Day Leave (toggle)
 * - Can Be Clubbed With Other Leave (toggle)
 * - Restrict Leave Together With (multi-select)
 * - Allow Leave During Notice Period (toggle)
 *
 * Preserves Edit / Save / Cancel, Add, Delete behaviors.
 */

// options used in the multi-select for "Restrict Leave Together With"
const leaveOptions = [
  { value: "casual", label: "Casual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "earned", label: "Earned Leave" },
  { value: "medical", label: "Medical Leave" },
];

const defaultEntries = [
  {
    allowPartialDay: true,
    canBeClubbed: false,
    restrictTogetherWith: ["sick"],
    allowDuringNoticePeriod: false,
  },
  {
    allowPartialDay: false,
    canBeClubbed: true,
    restrictTogetherWith: ["casual", "earned"],
    allowDuringNoticePeriod: true,
  },
];

const blankNewEntry = {
  allowPartialDay: false,
  canBeClubbed: false,
  restrictTogetherWith: [],
  allowDuringNoticePeriod: false,
};

const VisibilityUsage = ({ navigate }) => {
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

  // handle change for multi-select on existing row
  const handleMultiSelectChange = (index, e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    updateField(index, "restrictTogetherWith", selected);
  };

  // handle multi-select change for new entry
  const handleNewMultiSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setNewEntry({ ...newEntry, restrictTogetherWith: selected });
  };

  // delete row
  const handleDelete = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  // add new entry
  const handleAddEntry = () => {
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Leave Visibility & Usage</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Allow Partial Day Leave</th>
              <th>Can Be Clubbed With Other Leave</th>
              <th>Restrict Leave Together With</th>
              <th>Allow Leave During Notice Period</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Allow Partial Day (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.allowPartialDay}
                    onChange={() => {
                      if (editMode) toggleField(idx, "allowPartialDay");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Can Be Clubbed With Other Leave (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.canBeClubbed}
                    onChange={() => {
                      if (editMode) toggleField(idx, "canBeClubbed");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Restrict Leave Together With (multi-select) */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      multiple
                      value={row.restrictTogetherWith}
                      onChange={(e) => handleMultiSelectChange(idx, e)}
                      size={Math.min(leaveOptions.length, 4)}
                    >
                      {leaveOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>
                      {Array.isArray(row.restrictTogetherWith) &&
                      row.restrictTogetherWith.length > 0
                        ? row.restrictTogetherWith
                            .map((v) => leaveOptions.find((o) => o.value === v)?.label || v)
                            .join(", ")
                        : "—"}
                    </span>
                  )}
                </td>

                {/* Allow Leave During Notice Period (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.allowDuringNoticePeriod}
                    onChange={() => {
                      if (editMode) toggleField(idx, "allowDuringNoticePeriod");
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
                  <BootstrapSwitch
                    checked={!!newEntry.allowPartialDay}
                    onChange={() =>
                      setNewEntry({ ...newEntry, allowPartialDay: !newEntry.allowPartialDay })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.canBeClubbed}
                    onChange={() =>
                      setNewEntry({ ...newEntry, canBeClubbed: !newEntry.canBeClubbed })
                    }
                  />
                </td>

                <td>
                  <select
                    className={styles.select}
                    multiple
                    value={newEntry.restrictTogetherWith}
                    onChange={handleNewMultiSelectChange}
                    size={Math.min(leaveOptions.length, 4)}
                  >
                    {leaveOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.allowDuringNoticePeriod}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        allowDuringNoticePeriod: !newEntry.allowDuringNoticePeriod,
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

export default VisibilityUsage;

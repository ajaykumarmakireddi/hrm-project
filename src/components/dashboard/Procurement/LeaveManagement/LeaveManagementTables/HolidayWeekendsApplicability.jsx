import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

/**
 * HolidayWeekendsApplicability
 *
 * Table columns:
 * - Include Weekends in Leave Count (toggle)
 * - Include Holidays in Leave Count (toggle)
 * - Sandwich Mode (dropdown: None | Before | After | Both)
 * - Apply Sandwich Rule (toggle)
 *
 * Edit / Save / Cancel, Add, Delete behaviors preserved.
 */

const sandwichOptions = [
  { value: "none", label: "None" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
  { value: "both", label: "Before & After" },
];

const defaultEntries = [
  {
    includeWeekends: true,
    includeHolidays: false,
    sandwichMode: "none", // none | before | after | both
    applySandwichRule: true,
  },
  {
    includeWeekends: false,
    includeHolidays: true,
    sandwichMode: "both",
    applySandwichRule: false,
  },
];

const blankNewEntry = {
  includeWeekends: false,
  includeHolidays: false,
  sandwichMode: "none",
  applySandwichRule: false,
};

const HolidayWeekendsApplicability = ({ navigate }) => {
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
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Holiday & Weekends Applicability</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Include Weekends in Leave Count</th>
              <th>Include Holidays in Leave Count</th>
              <th>Sandwich Mode</th>
              <th>Apply Sandwich Rule</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Include Weekends (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.includeWeekends}
                    onChange={() => {
                      if (editMode) toggleField(idx, "includeWeekends");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Include Holidays (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.includeHolidays}
                    onChange={() => {
                      if (editMode) toggleField(idx, "includeHolidays");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Sandwich Mode (dropdown) */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.sandwichMode}
                      onChange={(e) => updateField(idx, "sandwichMode", e.target.value)}
                    >
                      {sandwichOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>
                      {sandwichOptions.find((s) => s.value === row.sandwichMode)?.label ||
                        row.sandwichMode}
                    </span>
                  )}
                </td>

                {/* Apply Sandwich Rule (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.applySandwichRule}
                    onChange={() => {
                      if (editMode) toggleField(idx, "applySandwichRule");
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
                    checked={!!newEntry.includeWeekends}
                    onChange={() =>
                      setNewEntry({ ...newEntry, includeWeekends: !newEntry.includeWeekends })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.includeHolidays}
                    onChange={() =>
                      setNewEntry({ ...newEntry, includeHolidays: !newEntry.includeHolidays })
                    }
                  />
                </td>

                <td>
                  <select
                    className={styles.select}
                    value={newEntry.sandwichMode}
                    onChange={(e) => setNewEntry({ ...newEntry, sandwichMode: e.target.value })}
                  >
                    {sandwichOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.applySandwichRule}
                    onChange={() =>
                      setNewEntry({ ...newEntry, applySandwichRule: !newEntry.applySandwichRule })
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

export default HolidayWeekendsApplicability;

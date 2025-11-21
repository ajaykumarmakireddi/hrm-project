import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const defaultEntries = [
  {
    // used as an identifier/label in the row — keep something meaningful
    type: "General Leave Rules",
    minimumUnit: "half day", // "half day" | "full day" | "hours"
    minRequiredPerRequest: "0.5", // numeric (string stored)
    minAllowedPerRequest: "0.5",
    minAllowedPerMonth: "5",
    maxContinuousDays: "10",
    documentProofRequired: true,
    proofRequiredAfterXDays: "3",
  },
  {
    type: "Sick Leave Rules",
    minimumUnit: "hours",
    minRequiredPerRequest: "1",
    minAllowedPerRequest: "1",
    minAllowedPerMonth: "10",
    maxContinuousDays: "15",
    documentProofRequired: true,
    proofRequiredAfterXDays: "2",
  },
  {
    type: "Sick Leave Rules",
    minimumUnit: "full day",
    minRequiredPerRequest: "1",
    minAllowedPerRequest: "1",
    minAllowedPerMonth: "10",
    maxContinuousDays: "15",
    documentProofRequired: true,
    proofRequiredAfterXDays: "2",
  },
];

const blankNewEntry = {
  type: "",
  minimumUnit: "half day",
  minRequiredPerRequest: "",
  minAllowedPerRequest: "",
  minAllowedPerMonth: "",
  maxContinuousDays: "",
  documentProofRequired: false,
  proofRequiredAfterXDays: "",
};

const LeaveRolesRestrictions = ({ navigate }) => {
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

  // save -> commit (we already updated state live), just exit edit mode and clear backup
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEditMode(false);
  };

  // Update field for existing row
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Toggle document proof required for a row
  const toggleDocumentProof = (index) => {
    const updated = [...entries];
    updated[index].documentProofRequired = !updated[index].documentProofRequired;
    // if turning off, clear proofRequiredAfterXDays
    if (!updated[index].documentProofRequired) {
      updated[index].proofRequiredAfterXDays = "";
    }
    setEntries(updated);
  };

  // Delete a row
  const handleDelete = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  // Add new entry
  const handleAddEntry = () => {
    const { minimumUnit, minRequiredPerRequest } = newEntry;

    if (!minimumUnit || minRequiredPerRequest === "") {
      alert("Please fill Minimum Unit and Minimum Required Per Request.");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Leave Roles and Restrictions</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              {/* <th>Role / Label</th> */}
              <th>Minimum Leave Unit</th>
              <th>Minimum Leave Required per Request</th>
              <th>Minimum Leave Allowed Per Request</th>
              <th>Minimum Leave Allowed Per Month</th>
              <th>Maximum Continuous Days</th>
              <th>Document Proof Required</th>
              <th>Proof Required After X Days</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Role / Label */}
                {/* <td>
                  {editMode ? (
                    <input
                      className={styles.input}
                      value={row.type}
                      placeholder="Role / Label"
                      onChange={(e) => updateField(idx, "type", e.target.value)}
                    />
                  ) : (
                    <span>{row.type}</span>
                  )}
                </td> */}

                {/* Minimum Leave Unit */}
                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={row.minimumUnit}
                      onChange={(e) =>
                        updateField(idx, "minimumUnit", e.target.value)
                      }
                    >
                      <option value="half day">Half Day</option>
                      <option value="full day">Full Day</option>
                      <option value="hours">Hours</option>
                    </select>
                  ) : (
                    <span>
                      {row.minimumUnit === "half day"
                        ? "Half Day"
                        : row.minimumUnit === "full day"
                        ? "Full Day"
                        : "Hours"}
                    </span>
                  )}
                </td>

                {/* Minimum Leave Required per Request */}
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.1"
                    min="0"
                    value={row.minRequiredPerRequest}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "minRequiredPerRequest", e.target.value)
                    }
                    placeholder="0"
                  />
                </td>

                {/* Minimum Leave Allowed Per Request */}
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.1"
                    min="0"
                    value={row.minAllowedPerRequest}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "minAllowedPerRequest", e.target.value)
                    }
                    placeholder="0"
                  />
                </td>

                {/* Minimum Leave Allowed Per Month */}
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.1"
                    min="0"
                    value={row.minAllowedPerMonth}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "minAllowedPerMonth", e.target.value)
                    }
                    placeholder="0"
                  />
                </td>

                {/* Maximum Continuous Days */}
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="1"
                    min="0"
                    value={row.maxContinuousDays}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "maxContinuousDays", e.target.value)
                    }
                    placeholder="0"
                  />
                </td>

                {/* Document Proof Required (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.documentProofRequired}
                    onChange={() => {
                      if (editMode) toggleDocumentProof(idx);
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Proof Required After X Days — disabled if doc not required */}
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="1"
                    min="0"
                    value={row.proofRequiredAfterXDays}
                    readOnly={!editMode || !row.documentProofRequired}
                    onChange={(e) =>
                      updateField(idx, "proofRequiredAfterXDays", e.target.value)
                    }
                    placeholder={row.documentProofRequired ? "0" : "-"}
                    disabled={!row.documentProofRequired && editMode}
                  />
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
                <td>
                  <input
                    className={styles.input}
                    placeholder="Role / Label"
                    value={newEntry.type}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, type: e.target.value })
                    }
                  />
                </td>

                <td>
                  <select
                    className={styles.select}
                    value={newEntry.minimumUnit}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, minimumUnit: e.target.value })
                    }
                  >
                    <option value="half day">Half Day</option>
                    <option value="full day">Full Day</option>
                    <option value="hours">Hours</option>
                  </select>
                </td>

                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Min req per request"
                    value={newEntry.minRequiredPerRequest}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        minRequiredPerRequest: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Min allowed per request"
                    value={newEntry.minAllowedPerRequest}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        minAllowedPerRequest: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Min allowed per month"
                    value={newEntry.minAllowedPerMonth}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        minAllowedPerMonth: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Max continuous days"
                    value={newEntry.maxContinuousDays}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        maxContinuousDays: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.documentProofRequired}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        documentProofRequired: !newEntry.documentProofRequired,
                        // when turning off, clear the proofAfterXDays
                        proofRequiredAfterXDays: newEntry.documentProofRequired
                          ? ""
                          : newEntry.proofRequiredAfterXDays,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Proof after X days"
                    value={newEntry.proofRequiredAfterXDays}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        proofRequiredAfterXDays: e.target.value,
                      })
                    }
                    disabled={!newEntry.documentProofRequired}
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

export default LeaveRolesRestrictions;

import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

/**
 * LeaveBalanceCredit
 *
 * Table columns:
 * - Prorate Accrual For New Joiners (toggle)
 * - Prorate on Resignation Month (toggle)
 * - Grant Accrual At (radio: beginning | end)
 * - Negative Balance Allowed (toggle)
 * - Maximum Negative Balance (numeric)
 *
 * Edit / Save / Cancel, Add, Delete behaviors preserved.
 */

const defaultEntries = [
  {
    // each row is one ruleset — you can add a label if you want to show something identifying the row
    prorateForNewJoiners: true,
    prorateOnResignationMonth: false,
    grantAccrualAt: "beginning", // "beginning" | "end"
    negativeBalanceAllowed: false,
    maxNegativeBalance: "0",
  },
  {
    prorateForNewJoiners: false,
    prorateOnResignationMonth: true,
    grantAccrualAt: "end",
    negativeBalanceAllowed: true,
    maxNegativeBalance: "5",
  },
];

const blankNewEntry = {
  prorateForNewJoiners: false,
  prorateOnResignationMonth: false,
  grantAccrualAt: "beginning",
  negativeBalanceAllowed: false,
  maxNegativeBalance: "",
};

const LeaveBalanceCredit = ({ navigate }) => {
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
    // If you want to call API here, do it (axios/fetch) and handle errors.
  };

  // Update a field in existing row
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Toggle helpers
  const toggleField = (index, field) => {
    const updated = [...entries];
    updated[index][field] = !updated[index][field];
    setEntries(updated);
  };

  // Delete a row
  const handleDelete = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  // Add new row
  const handleAddEntry = () => {
    // basic validation example: ensure maxNegativeBalance is numeric (optional)
    if (
      newEntry.maxNegativeBalance !== "" &&
      isNaN(Number(newEntry.maxNegativeBalance))
    ) {
      alert("Maximum Negative Balance must be a number.");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
  };

  return (
    <>
      <h4 className={styles.title}>Leave Balance / Credit Rules</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Prorate Accrual For New Joiners</th>
              <th>Prorate on Resignation Month</th>
              <th>Grant Accrual At</th>
              <th>Negative Balance Allowed</th>
              <th>Maximum Negative Balance</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Prorate For New Joiners (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.prorateForNewJoiners}
                    onChange={() => {
                      if (editMode) toggleField(idx, "prorateForNewJoiners");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Prorate On Resignation Month (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.prorateOnResignationMonth}
                    onChange={() => {
                      if (editMode) toggleField(idx, "prorateOnResignationMonth");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Grant Accrual At (radio beginning / end) */}
                <td>
                  {editMode ? (
                    <div role="radiogroup" aria-label={`grant-${idx}`}>
                      <label style={{ marginRight: 10 }}>
                        <input
                          type="radio"
                          name={`grant-${idx}`}
                          value="beginning"
                          checked={row.grantAccrualAt === "beginning"}
                          onChange={(e) =>
                            updateField(idx, "grantAccrualAt", e.target.value)
                          }
                        />{" "}
                        Beginning
                      </label>

                      <label>
                        <input
                          type="radio"
                          name={`grant-${idx}`}
                          value="end"
                          checked={row.grantAccrualAt === "end"}
                          onChange={(e) =>
                            updateField(idx, "grantAccrualAt", e.target.value)
                          }
                        />{" "}
                        End
                      </label>
                    </div>
                  ) : (
                    <span style={{ textTransform: "capitalize" }}>
                      {row.grantAccrualAt === "beginning" ? "Beginning" : "End"}
                    </span>
                  )}
                </td>

                {/* Negative Balance Allowed (toggle) */}
                <td>
                  <BootstrapSwitch
                    checked={!!row.negativeBalanceAllowed}
                    onChange={() => {
                      if (editMode) toggleField(idx, "negativeBalanceAllowed");
                    }}
                    disabled={!editMode}
                  />
                </td>

                {/* Maximum Negative Balance (numeric) */}
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.1"
                    min="0"
                    value={row.maxNegativeBalance}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "maxNegativeBalance", e.target.value)
                    }
                    placeholder="0"
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
                    checked={!!newEntry.prorateForNewJoiners}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        prorateForNewJoiners: !newEntry.prorateForNewJoiners,
                      })
                    }
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.prorateOnResignationMonth}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        prorateOnResignationMonth: !newEntry.prorateOnResignationMonth,
                      })
                    }
                  />
                </td>

                <td>
                  <div role="radiogroup" aria-label="grant-new">
                    <label style={{ marginRight: 10 }}>
                      <input
                        type="radio"
                        name={`grant-new`}
                        value="beginning"
                        checked={newEntry.grantAccrualAt === "beginning"}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, grantAccrualAt: e.target.value })
                        }
                      />{" "}
                      Beginning
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={`grant-new`}
                        value="end"
                        checked={newEntry.grantAccrualAt === "end"}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, grantAccrualAt: e.target.value })
                        }
                      />{" "}
                      End
                    </label>
                  </div>
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newEntry.negativeBalanceAllowed}
                    onChange={() =>
                      setNewEntry({
                        ...newEntry,
                        negativeBalanceAllowed: !newEntry.negativeBalanceAllowed,
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
                    placeholder="Max negative"
                    value={newEntry.maxNegativeBalance}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, maxNegativeBalance: e.target.value })
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

export default LeaveBalanceCredit;

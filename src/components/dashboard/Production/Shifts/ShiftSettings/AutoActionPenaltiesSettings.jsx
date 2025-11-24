import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const notificationOptions = ["Email", "SMS", "In-App", "Push"];

const dummyRows = [
  {
    autoAbsent: true,
    autoAbsentTime: "10:30",
    autoLogoutIdle: false,
    salaryDeductions: [
      { rule: "Late Coming", amount: 100 },
      { rule: "Early Leave", amount: 80 },
    ],
    notifications: ["Email", "In-App"],
  },
  {
    autoAbsent: false,
    autoAbsentTime: "",
    autoLogoutIdle: true,
    salaryDeductions: [
      { rule: "Unapproved Leave", amount: 200 },
    ],
    notifications: ["SMS"],
  },
  {
    autoAbsent: true,
    autoAbsentTime: "11:00",
    autoLogoutIdle: true,
    salaryDeductions: [
      { rule: "No Check-In", amount: 150 },
      { rule: "Long Break", amount: 50 },
    ],
    notifications: ["Push", "In-App"],
  },
  {
    autoAbsent: false,
    autoAbsentTime: "",
    autoLogoutIdle: false,
    salaryDeductions: [],
    notifications: [],
  },
];

const blankRow = {
  autoAbsent: false,
  autoAbsentTime: "",
  autoLogoutIdle: false,
  salaryDeductions: [],
  notifications: [],
};

const AutoActionPenaltiesSettings = () => {
  const [rows, setRows] = useState(dummyRows);
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState(null);
  const [newRow, setNewRow] = useState(blankRow);

  // Enter edit mode
  const enterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(rows)));
    setEditMode(true);
  };

  // Cancel edit
  const cancelEdit = () => {
    if (backupRows) setRows(backupRows);
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Save
  const save = () => {
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Update row field
  const updateField = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  // Toggle notification selection
  const toggleNotification = (index, notif) => {
    const updated = [...rows];
    const selected = updated[index].notifications;

    if (selected.includes(notif)) {
      updated[index].notifications = selected.filter((n) => n !== notif);
    } else {
      updated[index].notifications = [...selected, notif];
    }

    setRows(updated);
  };

  const toggleNewNotif = (notif) => {
    const selected = newRow.notifications;

    if (selected.includes(notif)) {
      setNewRow({ ...newRow, notifications: selected.filter((n) => n !== notif) });
    } else {
      setNewRow({ ...newRow, notifications: [...selected, notif] });
    }
  };

  // Salary Deduction Table Modifiers
  const updateSalaryDeduction = (rowIdx, ruleIdx, field, value) => {
    const updated = [...rows];
    updated[rowIdx].salaryDeductions[ruleIdx][field] = value;
    setRows(updated);
  };

  const addSalaryDeduction = (rowIdx) => {
    const updated = [...rows];
    updated[rowIdx].salaryDeductions.push({ rule: "", amount: 0 });
    setRows(updated);
  };

  const deleteSalaryDeduction = (rowIdx, ruleIdx) => {
    const updated = [...rows];
    updated[rowIdx].salaryDeductions = updated[rowIdx].salaryDeductions.filter(
      (_, i) => i !== ruleIdx
    );
    setRows(updated);
  };

  // New row salary rule
  const addNewSalaryRule = () => {
    setNewRow({
      ...newRow,
      salaryDeductions: [...newRow.salaryDeductions, { rule: "", amount: 0 }],
    });
  };

  const updateNewSalaryRule = (idx, field, value) => {
    const updated = [...newRow.salaryDeductions];
    updated[idx][field] = value;
    setNewRow({ ...newRow, salaryDeductions: updated });
  };

  const deleteNewSalaryRule = (idx) => {
    setNewRow({
      ...newRow,
      salaryDeductions: newRow.salaryDeductions.filter((_, i) => i !== idx),
    });
  };

  // Delete row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Add new row
  const addRow = () => {
    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  return (
    <>
      <h4 className={styles.title}>Auto Action & Penalties Settings</h4>

      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Auto Absent (if NO Check-in)</th>
              <th>Time</th>
              <th>Auto Logout on Idle</th>
              <th>Salary Deduction Rules</th>
              <th>Auto Notification Trigger</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {/* Existing Rows */}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Auto Mark Absent */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.autoAbsent}
                      setChecked={(val) => updateField(idx, "autoAbsent", val)}
                    />
                  ) : (
                    <BootstrapSwitch checked={row.autoAbsent} disabled />
                  )}
                </td>

                {/* Time Picker */}
                <td>
                  {editMode ? (
                    <input
                      type="time"
                      className={styles.input}
                      value={row.autoAbsentTime}
                      onChange={(e) =>
                        updateField(idx, "autoAbsentTime", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.autoAbsentTime || "-"}</span>
                  )}
                </td>

                {/* Auto Logout */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.autoLogoutIdle}
                      setChecked={(val) =>
                        updateField(idx, "autoLogoutIdle", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch checked={row.autoLogoutIdle} disabled />
                  )}
                </td>

                {/* Salary Deduction Editable Table */}
                <td>
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Rule</th>
                        <th>Amount</th>
                        {editMode && <th></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {row.salaryDeductions.map((rule, rIdx) => (
                        <tr key={rIdx}>
                          <td>
                            {editMode ? (
                              <input
                                type="text"
                                className={styles.input}
                                value={rule.rule}
                                onChange={(e) =>
                                  updateSalaryDeduction(
                                    idx,
                                    rIdx,
                                    "rule",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              rule.rule
                            )}
                          </td>
                          <td>
                            {editMode ? (
                              <input
                                type="number"
                                className={styles.input}
                                value={rule.amount}
                                onChange={(e) =>
                                  updateSalaryDeduction(
                                    idx,
                                    rIdx,
                                    "amount",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              rule.amount
                            )}
                          </td>

                          {editMode && (
                            <td>
                              <button
                                className={styles.deleteBtn}
                                onClick={() =>
                                  deleteSalaryDeduction(idx, rIdx)
                                }
                              >
                                <i className="bi bi-trash3"></i>
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}

                      {editMode && (
                        <tr>
                          <td colSpan={3}>
                            <button
                              className={styles.addBtn}
                              onClick={() => addSalaryDeduction(idx)}
                            >
                              + Add Rule
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>

                {/* Notification Multi-select */}
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    {notificationOptions.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`btn btn-sm ${
                          row.notifications.includes(n)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        disabled={!editMode}
                        onClick={() => toggleNotification(idx, n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button className={styles.deleteBtn} onClick={() => deleteRow(idx)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New Row */}
            {editMode && (
              <tr>
                {/* Auto Absent */}
                <td>
                  <BootstrapSwitch
                    checked={newRow.autoAbsent}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, autoAbsent: val })
                    }
                  />
                </td>

                {/* Time Picker */}
                <td>
                  <input
                    type="time"
                    className={styles.input}
                    value={newRow.autoAbsentTime}
                    onChange={(e) =>
                      setNewRow({ ...newRow, autoAbsentTime: e.target.value })
                    }
                  />
                </td>

                {/* Auto Logout */}
                <td>
                  <BootstrapSwitch
                    checked={newRow.autoLogoutIdle}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, autoLogoutIdle: val })
                    }
                  />
                </td>

                {/* Salary Deduction table for new row */}
                <td>
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Rule</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {newRow.salaryDeductions.map((rule, idx2) => (
                        <tr key={idx2}>
                          <td>
                            <input
                              type="text"
                              className={styles.input}
                              value={rule.rule}
                              onChange={(e) =>
                                updateNewSalaryRule(idx2, "rule", e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className={styles.input}
                              value={rule.amount}
                              onChange={(e) =>
                                updateNewSalaryRule(idx2, "amount", e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => deleteNewSalaryRule(idx2)}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td colSpan={3}>
                          <button className={styles.addBtn} onClick={addNewSalaryRule}>
                            + Add Rule
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>

                {/* Notifications multi-select */}
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    {notificationOptions.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`btn btn-sm ${
                          newRow.notifications.includes(n)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => toggleNewNotif(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </td>

                {/* Add Button */}
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

      {/* Bottom Actions */}
      <div className="d-flex justify-content-center p-3">
        {!editMode ? (
          <button className="submitbtn" onClick={enterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className="submitbtn" onClick={save}>Save</button>
            <button className="cancelbtn" onClick={cancelEdit}>Cancel</button>
          </>
        )}
      </div>
    </>
  );
};

export default AutoActionPenaltiesSettings;

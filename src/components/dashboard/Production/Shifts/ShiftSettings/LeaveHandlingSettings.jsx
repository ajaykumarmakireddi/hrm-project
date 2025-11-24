import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const autoApprovalOptions = ["Manual", "Auto", "Conditional"];

const dummyRows = [
  {
    allowShortLeave: true,
    maxShortLeavesPerMonth: 4,
    shortLeaveDuration: 2,
    lateMarkConvertAfter: 3,
    autoApprovalRule: "Manual",
  },
  {
    allowShortLeave: false,
    maxShortLeavesPerMonth: 2,
    shortLeaveDuration: 1,
    lateMarkConvertAfter: 2,
    autoApprovalRule: "Auto",
  },
  {
    allowShortLeave: true,
    maxShortLeavesPerMonth: 6,
    shortLeaveDuration: 3,
    lateMarkConvertAfter: 4,
    autoApprovalRule: "Conditional",
  },
  {
    allowShortLeave: true,
    maxShortLeavesPerMonth: 3,
    shortLeaveDuration: 1,
    lateMarkConvertAfter: 2,
    autoApprovalRule: "Auto",
  },
];

const blankRow = {
  allowShortLeave: false,
  maxShortLeavesPerMonth: "",
  shortLeaveDuration: "",
  lateMarkConvertAfter: "",
  autoApprovalRule: "",
};

const LeaveHandlingSettings = () => {
  const [rows, setRows] = useState(dummyRows);
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState(null);
  const [newRow, setNewRow] = useState(blankRow);

  // Enter edit mode
  const enterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(rows)));
    setEditMode(true);
  };

  // Cancel editing
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

  // Update field
  const updateField = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  // Delete row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Add row
  const addRow = () => {
    if (
      !newRow.maxShortLeavesPerMonth ||
      !newRow.shortLeaveDuration ||
      !newRow.lateMarkConvertAfter ||
      !newRow.autoApprovalRule
    ) {
      alert("Please fill all fields before adding.");
      return;
    }

    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  return (
    <>
      <h4 className={styles.title}>Leave Handling Settings</h4>

      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Allow Short Leave</th>
              <th>Max Short Leaves / Month</th>
              <th>Short Leave Duration</th>
              <th>Late Mark → Leave After</th>
              <th>Auto Approval Rule</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Allow Short Leave */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.allowShortLeave}
                      setChecked={(val) =>
                        updateField(idx, "allowShortLeave", val)
                      }
                    />
                  ) : (
                    <BootstrapSwitch checked={row.allowShortLeave} disabled />
                  )}
                </td>

                {/* Maximum Short Leaves */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.maxShortLeavesPerMonth}
                      onChange={(e) =>
                        updateField(idx, "maxShortLeavesPerMonth", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.maxShortLeavesPerMonth}</span>
                  )}
                </td>

                {/* Short Leave Duration */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.shortLeaveDuration}
                      onChange={(e) =>
                        updateField(idx, "shortLeaveDuration", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.shortLeaveDuration}</span>
                  )}
                </td>

                {/* Late Mark Conversion */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      className={styles.input}
                      value={row.lateMarkConvertAfter}
                      onChange={(e) =>
                        updateField(idx, "lateMarkConvertAfter", e.target.value)
                      }
                    />
                  ) : (
                    <span>{row.lateMarkConvertAfter}</span>
                  )}
                </td>

                {/* Auto Approval Rule */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.autoApprovalRule}
                      onChange={(e) =>
                        updateField(idx, "autoApprovalRule", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {autoApprovalOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.autoApprovalRule}</span>
                  )}
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
                <td>
                  <BootstrapSwitch
                    checked={newRow.allowShortLeave}
                    setChecked={(val) =>
                      setNewRow({ ...newRow, allowShortLeave: val })
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={newRow.maxShortLeavesPerMonth}
                    onChange={(e) =>
                      setNewRow({
                        ...newRow,
                        maxShortLeavesPerMonth: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={newRow.shortLeaveDuration}
                    onChange={(e) =>
                      setNewRow({
                        ...newRow,
                        shortLeaveDuration: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.input}
                    value={newRow.lateMarkConvertAfter}
                    onChange={(e) =>
                      setNewRow({
                        ...newRow,
                        lateMarkConvertAfter: e.target.value,
                      })
                    }
                  />
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.autoApprovalRule}
                    onChange={(e) =>
                      setNewRow({
                        ...newRow,
                        autoApprovalRule: e.target.value,
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {autoApprovalOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

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

      {/* Bottom Buttons */}
      <div className="d-flex justify-content-center p-3">
        {!editMode ? (
          <button className="submitbtn" onClick={enterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className="submitbtn" onClick={save}>
              Save
            </button>
            <button className="cancelbtn" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default LeaveHandlingSettings;

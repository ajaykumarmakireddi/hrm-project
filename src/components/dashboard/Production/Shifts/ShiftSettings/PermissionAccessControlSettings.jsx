import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";

const roleOptions = ["Admin", "Manager", "Supervisor", "HR", "Employee"];

const dummyRows = [
  {
    editShiftAccess: ["Admin", "Manager"],
    approveOTAccess: ["Manager", "Supervisor"],
    createShiftAccess: ["Admin"],
  },
  {
    editShiftAccess: ["HR"],
    approveOTAccess: ["Admin"],
    createShiftAccess: ["HR", "Manager"],
  },
  {
    editShiftAccess: ["Supervisor", "Employee"],
    approveOTAccess: ["Supervisor"],
    createShiftAccess: ["Supervisor"],
  },
  {
    editShiftAccess: ["Admin"],
    approveOTAccess: ["Manager", "Admin"],
    createShiftAccess: ["Manager"],
  },
];

const blankRow = {
  editShiftAccess: [],
  approveOTAccess: [],
  createShiftAccess: [],
};

const PermissionAccessControlSettings = () => {
  const [rows, setRows] = useState(dummyRows);
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState(null);
  const [newRow, setNewRow] = useState(blankRow);

  // Enter edit mode
  const enterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(rows)));
    setEditMode(true);
  };

  // Cancel
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

  // Delete row
  const deleteRow = (idx) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  // Add new row
  const addRow = () => {
    if (
      newRow.editShiftAccess.length === 0 ||
      newRow.approveOTAccess.length === 0 ||
      newRow.createShiftAccess.length === 0
    ) {
      alert("Please fill all multi-select fields.");
      return;
    }

    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  // Multi-select functions
  const addRole = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = [...updated[index][field], value];
    setRows(updated);
  };

  const removeRole = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = updated[index][field].filter((r) => r !== value);
    setRows(updated);
  };

  const addNewRowRole = (field, value) => {
    setNewRow({ ...newRow, [field]: [...newRow[field], value] });
  };

  const removeNewRowRole = (field, value) => {
    setNewRow({
      ...newRow,
      [field]: newRow[field].filter((r) => r !== value),
    });
  };

  // Helper: Render Multi-select Chips + Dropdown
  const renderMultiSelect = (roleList, onRemove, onAdd, editable = true) => {
    return (
      <>
        {/* Selected Roles */}
        <div className="d-flex gap-1 flex-wrap mb-1">
          {roleList.map((role, idx) => (
            <span
              key={idx}
              className="badge bg-primary d-flex align-items-center gap-1"
              style={{ padding: "6px 10px", fontSize: "12px" }}
            >
              {role}
              {editable && (
                <i
                  className="bi bi-x-lg"
                  style={{ cursor: "pointer" }}
                  onClick={() => onRemove(role)}
                ></i>
              )}
            </span>
          ))}

          {roleList.length === 0 && (
            <span className="text-muted" style={{ fontSize: "12px" }}>
              No roles selected
            </span>
          )}
        </div>

        {/* Dropdown */}
        {editable && (
          <select
            className={`form-select ${styles.select}`}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== "--select--") onAdd(val);
              e.target.value = "--select--";
            }}
          >
            <option>--select--</option>
            {roleOptions
              .filter((r) => !roleList.includes(r))
              .map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
          </select>
        )}
      </>
    );
  };

  return (
    <>
      <h4 className={styles.title}>Permission Access Control Settings</h4>

      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Who can Edit Shifts</th>
              <th>Who can Approve OT</th>
              <th>Who can Create Shifts</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {/* Existing Rows */}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Edit Shift Access */}
                <td>
                  {renderMultiSelect(
                    row.editShiftAccess,
                    (val) => removeRole(idx, "editShiftAccess", val),
                    (val) => addRole(idx, "editShiftAccess", val),
                    editMode
                  )}
                </td>

                {/* Approve OT */}
                <td>
                  {renderMultiSelect(
                    row.approveOTAccess,
                    (val) => removeRole(idx, "approveOTAccess", val),
                    (val) => addRole(idx, "approveOTAccess", val),
                    editMode
                  )}
                </td>

                {/* Create Shifts */}
                <td>
                  {renderMultiSelect(
                    row.createShiftAccess,
                    (val) => removeRole(idx, "createShiftAccess", val),
                    (val) => addRole(idx, "createShiftAccess", val),
                    editMode
                  )}
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteRow(idx)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New Row (only in edit mode) */}
            {editMode && (
              <tr>
                {/* Edit Shift Permission */}
                <td>
                  {renderMultiSelect(
                    newRow.editShiftAccess,
                    (val) => removeNewRowRole("editShiftAccess", val),
                    (val) => addNewRowRole("editShiftAccess", val),
                    true
                  )}
                </td>

                {/* Approve OT */}
                <td>
                  {renderMultiSelect(
                    newRow.approveOTAccess,
                    (val) => removeNewRowRole("approveOTAccess", val),
                    (val) => addNewRowRole("approveOTAccess", val),
                    true
                  )}
                </td>

                {/* Create Shifts */}
                <td>
                  {renderMultiSelect(
                    newRow.createShiftAccess,
                    (val) => removeNewRowRole("createShiftAccess", val),
                    (val) => addNewRowRole("createShiftAccess", val),
                    true
                  )}
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

      {/* Footer Buttons */}
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

export default PermissionAccessControlSettings;

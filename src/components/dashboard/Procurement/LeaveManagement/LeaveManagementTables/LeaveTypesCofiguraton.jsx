import React, { useState } from "react";
import styles from "../LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const defaultEntries = [
  {
    type: "Casual Leave",
    days: "5",
    frequency: "monthly",
    maxDays: "10",
    carryForward: true,
    carryforwardLimit: "5",
    encashmentAllowed: false,
    enhancementRate: "0",
  },
  {
    type: "Sick Leave",
    days: "3",
    frequency: "monthly",
    maxDays: "6",
    carryForward: false,
    carryforwardLimit: "2",
    encashmentAllowed: false,
    enhancementRate: "0",
  },
  {
    type: "Medical Leave",
    days: "10",
    frequency: "yearly",
    maxDays: "20",
    carryForward: true,
    carryforwardLimit: "10",
    encashmentAllowed: false,
    enhancementRate: "0",
  },
  {
    type: "Earned Leave",
    days: "7",
    frequency: "quarterly",
    maxDays: "15",
    carryForward: true,
    carryforwardLimit: "7",
    encashmentAllowed: true,
    enhancementRate: "2.5",
  },
];

const blankNewLeave = {
  type: "",
  days: "",
  frequency: "",
  maxDays: "",
  carryForward: false,
  carryforwardLimit: "",
  encashmentAllowed: false,
  enhancementRate: "",
};

const LeaveTypesConfiguration = ({ navigate }) => {
  const [leaveEntries, setLeaveEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newLeave, setNewLeave] = useState(blankNewLeave);
  const [backupEntries, setBackupEntries] = useState(null);

  // enter edit mode: keep a backup for cancel
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(leaveEntries)));
    setEditMode(true);
  };

  // cancel editing -> revert
  const handleCancel = () => {
    if (backupEntries) setLeaveEntries(backupEntries);
    setNewLeave(blankNewLeave);
    setBackupEntries(null);
    setEditMode(false);
  };

  // save -> commit (we already updated state live), just exit edit mode and clear backup
  const handleSave = () => {
    setBackupEntries(null);
    setNewLeave(blankNewLeave);
    setEditMode(false);
  };

  // Update row while editing
  const updateField = (index, field, value) => {
    const updated = [...leaveEntries];
    updated[index] = { ...updated[index], [field]: value };
    setLeaveEntries(updated);
  };

  // Toggle carry forward for a row
  const toggleCarryForward = (index) => {
    const updated = [...leaveEntries];
    updated[index].carryForward = !updated[index].carryForward;
    setLeaveEntries(updated);
  };

  // Toggle encashment for a row
  const toggleEncashment = (index) => {
    const updated = [...leaveEntries];
    updated[index].encashmentAllowed = !updated[index].encashmentAllowed;
    setLeaveEntries(updated);
  };

  // Delete a leave type
  const handleDelete = (index) => {
    const updated = leaveEntries.filter((_, i) => i !== index);
    setLeaveEntries(updated);
  };

  // Add new leave type
  const handleAddLeave = () => {
    const {
      type,
      days,
      frequency,
      maxDays,
      carryForward,
      carryforwardLimit,
      enhancementRate,
    } = newLeave;

    if (!type || !days || !frequency || !maxDays) {
      alert("Please fill Type, Days, Frequency and Max Days for the new leave.");
      return;
    }

    setLeaveEntries([...leaveEntries, newLeave]);
    setNewLeave(blankNewLeave);
  };

  return (
    <>
      <h4 className={styles.title}>Leave Type Configurations</h4>

      <div className={styles.tableContainer}>
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Accrual Days</th>
              <th>Accrual Frequency</th>
              <th>Max Days Allowed</th>
              <th>Carry Forward</th>
              <th>Carryforward Limit</th>
              <th>Leave Encashment Allowed</th>
              <th>Enhancement Rate (%)</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {leaveEntries.map((leave, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Leave Type - make editable only in edit mode */}
                <td>
                  {editMode ? (
                    <input
                      className={styles.input}
                      value={leave.type}
                      onChange={(e) => updateField(idx, "type", e.target.value)}
                      placeholder="Type"
                    />
                  ) : (
                    <span>{leave.type}</span>
                  )}
                </td>

                <td>
                  <input
                    className={styles.input}
                    value={leave.days}
                    readOnly={!editMode}
                    onChange={(e) => updateField(idx, "days", e.target.value)}
                    type="number"
                    min="0"
                  />
                </td>

                <td>
                  {editMode ? (
                    <select
                      className={styles.select}
                      value={leave.frequency}
                      onChange={(e) =>
                        updateField(idx, "frequency", e.target.value)
                      }
                    >
                      <option value="">--select--</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  ) : (
                    <span>{leave.frequency}</span>
                  )}
                </td>

                <td>
                  <input
                    className={styles.input}
                    value={leave.maxDays}
                    readOnly={!editMode}
                    onChange={(e) => updateField(idx, "maxDays", e.target.value)}
                    type="number"
                    min="0"
                  />
                </td>

                {/* Carry Forward toggle */}
                <td>
                  <BootstrapSwitch
                    checked={!!leave.carryForward}
                    onChange={() => {
                      if (editMode) toggleCarryForward(idx);
                    }}
                    disabled={!editMode}
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    value={leave.carryforwardLimit}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "carryforwardLimit", e.target.value)
                    }
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!leave.encashmentAllowed}
                    onChange={() => {
                      if (editMode) toggleEncashment(idx);
                    }}
                    disabled={!editMode}
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    value={leave.enhancementRate}
                    readOnly={!editMode}
                    onChange={(e) =>
                      updateField(idx, "enhancementRate", e.target.value)
                    }
                    type="number"
                    step="0.1"
                    min="0"
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
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New Leave Row (visible only in edit mode) */}
            {editMode && (
              <tr className={styles.newRow}>
                <td>
                  <input
                    className={styles.input}
                    placeholder="New Type"
                    value={newLeave.type}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, type: e.target.value })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    placeholder="Days"
                    value={newLeave.days}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, days: e.target.value })
                    }
                    type="number"
                    min="0"
                  />
                </td>

                <td>
                  <select
                    className={styles.select}
                    value={newLeave.frequency}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, frequency: e.target.value })
                    }
                  >
                    <option value="">--select--</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </td>

                <td>
                  <input
                    className={styles.input}
                    placeholder="Max Days"
                    value={newLeave.maxDays}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, maxDays: e.target.value })
                    }
                    type="number"
                    min="0"
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newLeave.carryForward}
                    onChange={() =>
                      setNewLeave({
                        ...newLeave,
                        carryForward: !newLeave.carryForward,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    placeholder="Carryforward Limit"
                    value={newLeave.carryforwardLimit}
                    onChange={(e) =>
                      setNewLeave({
                        ...newLeave,
                        carryforwardLimit: e.target.value,
                      })
                    }
                    type="number"
                    min="0"
                  />
                </td>

                <td>
                  <BootstrapSwitch
                    checked={!!newLeave.encashmentAllowed}
                    onChange={() =>
                      setNewLeave({
                        ...newLeave,
                        encashmentAllowed: !newLeave.encashmentAllowed,
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    className={styles.input}
                    placeholder="Enhancement Rate"
                    value={newLeave.enhancementRate}
                    onChange={(e) =>
                      setNewLeave({
                        ...newLeave,
                        enhancementRate: e.target.value,
                      })
                    }
                    type="number"
                    step="0.1"
                    min="0"
                  />
                </td>

                <td className={styles.actionsCell}>
                  <button className={styles.addBtn} onClick={handleAddLeave}>
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

export default LeaveTypesConfiguration;

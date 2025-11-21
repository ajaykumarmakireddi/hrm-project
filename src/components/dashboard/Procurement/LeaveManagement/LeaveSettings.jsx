import React, { useState } from "react";
import styles from "./LeaveSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const LeaveSettings = ({ navigate }) => {
  const [leaveEntries, setLeaveEntries] = useState([
    { type: "Casual Leave", days: "5", frequency: "monthly", maxDays: "10" },
    { type: "Sick Leave", days: "3", frequency: "monthly", maxDays: "6" },
    { type: "Medical Leave", days: "10", frequency: "yearly", maxDays: "20" },
    { type: "Earned Leave", days: "7", frequency: "quarterly", maxDays: "15" },
  ]);

  const [newLeave, setNewLeave] = useState({
    type: "",
    days: "",
    frequency: "",
    maxDays: "",
  });

  const [editMode, setEditMode] = useState(false);

  // Delete a leave type
  const handleDelete = (index) => {
    const updated = leaveEntries.filter((_, i) => i !== index);
    setLeaveEntries(updated);
  };

  // Add new leave type
  const handleAddLeave = () => {
    const { type, days, frequency, maxDays } = newLeave;

    if (!type || !days || !frequency || !maxDays) {
      alert("Please fill all fields.");
      return;
    }

    setLeaveEntries([...leaveEntries, newLeave]);
    setNewLeave({ type: "", days: "", frequency: "", maxDays: "" });
  };

  // Update row while editing
  const updateField = (index, field, value) => {
    const updated = [...leaveEntries];
    updated[index][field] = value;
    setLeaveEntries(updated);
  };

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/leave-management")}>Leave Management</span>
        <i className="bi bi-chevron-right"></i> Leave - Setting
      </p>

      <div className={styles.container}>
        <div className={styles.leaveBox}>
          {/* SIDEBAR */}
          <div className={styles.sidebar}>
            <p>Leave Type</p>
            {leaveEntries.map((leave, idx) => (
              <label key={idx}>{leave.type}</label>
            ))}

            {editMode && (
              <input
                type="text"
                className={styles.newTypeInput}
                placeholder="New Leave Type"
                value={newLeave.type}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, type: e.target.value })
                }
              />
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className={styles.grid}>
            {/* COLUMN HEADINGS */}
            <div className={styles.headerRow}>
              <p className={styles.lgLabel}>Days</p>
              <p className={styles.lgLabel}>Frequency</p>
              <p className={styles.lgLabel}>Max Days</p>
              <p>Active</p>
            </div>

            {/* DATA ROWS */}
            {leaveEntries.map((leave, i) => (
              <div key={i} className={styles.row}>
                <input
                  type="text"
                  className={styles.input}
                  value={leave.days}
                  readOnly={!editMode}
                  onChange={(e) => updateField(i, "days", e.target.value)}
                />

                <select
                  className={styles.input}
                  value={leave.frequency}
                  disabled={!editMode}
                  onChange={(e) => updateField(i, "frequency", e.target.value)}
                >
                  <option value="">--select--</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>

                <input
                  type="text"
                  className={styles.input}
                  value={leave.maxDays}
                  readOnly={!editMode}
                  onChange={(e) => updateField(i, "maxDays", e.target.value)}
                />

                <BootstrapSwitch  />

                {editMode && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(i)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                )}
              </div>
            ))}

            {/* NEW LEAVE ROW */}
            {editMode && (
              <div className={styles.row}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Days"
                  value={newLeave.days}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, days: e.target.value })
                  }
                />

                <select
                  className={styles.input}
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

                <input
                  type="text"
                  className={styles.input}
                  placeholder="Max Days"
                  value={newLeave.maxDays}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, maxDays: e.target.value })
                  }
                />

                <BootstrapSwitch />
              </div>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className={styles.actionContainer}>
          {editMode ? (
            <>
              <button className={styles.addButton} onClick={handleAddLeave}>
                + Add
              </button>

              <button
                className={styles.cancelButton}
                onClick={() => setEditMode(false)}
              >
                Save
              </button>
            </>
          ) : (
            <button
              className={styles.editButton}
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveSettings;

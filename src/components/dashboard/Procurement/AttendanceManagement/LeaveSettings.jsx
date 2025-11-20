import React, { useState } from "react";
// import styles from './LeaveSettings.module.css';
import styles from "./AttendanceForm.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const LeaveSettings = ({navigate}) => {
  const [leaveEntries, setLeaveEntries] = useState([
    { type: "Casual Leave", days: "", frequency: "", maxDays: "" },
    { type: "Sick Leave", days: "", frequency: "", maxDays: "" },
    { type: "Medical Leave", days: "", frequency: "", maxDays: "" },
    { type: "Earned Leave", days: "", frequency: "", maxDays: "" },
  ]);

  const [newLeave, setNewLeave] = useState({
    type: "",
    days: "",
    frequency: "",
    maxDays: "",
  });

  const handleAddLeave = () => {
    const { type, days, frequency, maxDays } = newLeave;
    if (type && days && frequency && maxDays) {
      setLeaveEntries([...leaveEntries, newLeave]);
      setNewLeave({ type: "", days: "", frequency: "", maxDays: "" });
    } else {
      alert("Please fill all fields to add a leave type.");
    }
  };

  const [editClick, setEditClick] = useState(false);

  const onEditClick = () => setEditClick(!editClick);

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/attendance")}>Attendance</span>{" "}
        <i className="bi bi-chevron-right"></i> Leave - Setting
      </p>

      <div className={styles.container}>
        <div className={styles.leaveBox}>
          <div className={styles.leaveSidebar}>
            {leaveEntries.map((leave, idx) => (
              <label key={idx}>{leave.type}:</label>
            ))}
            {editClick && (
              <input
                type="text"
                className={styles.editLeaveInput}
                placeholder="New Leave Type"
                value={newLeave.type}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, type: e.target.value })
                }
              />
            )}
          </div>

          <div className={styles.leaveFormGrid}>
            {leaveEntries.map((leave, i) => (
              <div key={i} className={styles.leaveInnerGird}>
                <input
                  type="text"
                  className={styles.leaveInput}
                  value={leave.days}
                  placeholder="No of Days"
                  readOnly
                />
                <select
                  className={styles.leaveInput}
                  value={leave.frequency}
                  disabled
                >
                  <option>--select--</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <input
                  type="text"
                  className={styles.leaveInput}
                  value={leave.maxDays}
                  placeholder="Maximum Days"
                  readOnly
                />
                <BootstrapSwitch />

                {editClick && (
                  <button className={styles.deleteBin}>
                    <i class="bi bi-trash3"></i>
                  </button>
                )}
              </div>
            ))}

            {/* Row to enter new leave */}
            {editClick && (
              <div className={styles.leaveInnerGird}>
                <input
                  type="text"
                  className={styles.leaveInput}
                  placeholder="No of Days"
                  value={newLeave.days}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, days: e.target.value })
                  }
                />
                <select
                  className={styles.leaveInput}
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
                  className={styles.leaveInput}
                  placeholder="Maximum Days"
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

        {editClick && (
          <div className={styles.editButtonContainer}>
            <button className={styles.approveButton} onClick={handleAddLeave}>
              + Add
            </button>
            <button onClick={onEditClick} className={styles.declineButton}>
              Cancel
            </button>
          </div>
        )}

        {!editClick && (
          <div className={styles.editButtonContainer}>
            <button className={styles.editButton} onClick={onEditClick}>
              Edit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LeaveSettings;

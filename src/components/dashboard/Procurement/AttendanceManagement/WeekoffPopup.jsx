import React, { useState } from "react";
import styles from "./AttendanceForm.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

function WeekoffPopup({ employee, onClose }) {
  const [weekoffs, setWeekoffs] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const handleCheckboxChange = (day) => {
    setWeekoffs((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSubmit = () => {
    const selectedDays = Object.entries(weekoffs)
      .filter(([day, isChecked]) => isChecked)
      .map(([day]) => day);

    console.log("Submitted Week Offs for:", employee.name, selectedDays);
    onClose(); // Close the popup
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Employee Based Week off</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <div className={styles.modalField}>
          <span>Employee ID:</span>
          <input value={employee.id} readOnly />
        </div>

        <div className={styles.modalField}>
          <span>Employee Name:</span>
          <input value={employee.name} readOnly />
        </div>

        <div className={styles.modalField}>
          <span>Mobile Number:</span>
          <input value={employee.mobile} readOnly />
        </div>

        <div className={styles.modalField}>
          <span>Email:</span>
          <input value={employee.email} readOnly />
        </div>

        <div className={styles.weekdayCheckboxes}>
          {Object.keys(weekoffs).map((day) => (
            <label key={day}>
              <BootstrapSwitch
              // type="checkbox"
              // checked={weekoffs[day]}
              // onChange={() => handleCheckboxChange(day)}
              />
              {day}
            </label>
          ))}
          {/* <BootstrapSwitch checked={false} setChecked={() => {}}/> */}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>
          {/* <button className={styles.cancelButton} onClick={onClose}>Cancel</button> */}
        </div>
      </div>
    </div>
  );
}

export default WeekoffPopup;

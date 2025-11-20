import React, { useRef, useState } from "react";
import styles from "./AttendanceForm.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";
import CentralPopupBox from "@/utils/CentralPopupBox";

function RolesPopup({ selectedRows, btnName, btnClass, role }) {
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
  const popupRef = useRef();

  const handleNoClick = () => {
    popupRef.current.closePopup(); // Close from child
  };
  console.log(selectedRows);

  return (
    <>
      <CentralPopupBox btnName={btnName} btnClass={btnClass} ref={popupRef}>
        <h2>Role Based Week off</h2>

        <div className={styles.modalField}>
          <span>Role :</span>
          <input value={role} readOnly />
        </div>

        <div className={styles.modalField}>
          <span>Number of Employees :</span>
          <input value={selectedRows.length} readOnly />
        </div>

        {/* <div className={styles.modalField}>
                    <span>Mobile Number:</span>
                    <input value={employee.mobile} readOnly />
                </div>

                <div className={styles.modalField}>
                    <span>Email:</span>
                    <input value={employee.email} readOnly />
                </div> */}

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
          <button className={styles.cancelButton} onClick={handleNoClick}>
            Cancel
          </button>
        </div>
      </CentralPopupBox>
    </>
  );
}

export default RolesPopup;

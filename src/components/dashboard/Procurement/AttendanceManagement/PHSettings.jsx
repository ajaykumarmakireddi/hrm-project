import React, { useState } from "react";
import styles from "./AttendanceForm.module.css";
import { data } from "react-router-dom";

function PHSettings({ navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState("");
  const handleOpenBox = () => {
    setIsOpen(!isOpen);
    setYear(null);
  };

  const onYearChange = (e) => {
    setIsOpen(false);
    setYear(e.target.value === "null" ? null : e.target.value);
  };

  const holidays = [
    {
      year: `${year}-03-26`,
      day: "Independance Day",
    },
    {
      year: `${year}-03-27`,
      day: "Dhiwali",
    },
    {
      year: `${year}-03-28`,
      day: "Sankrathi",
    },
    {
      year: `${year}-03-29`,
      day: "Dhasara",
    },
  ];

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/attendance")}>Attendance</span>{" "}
        <i className="bi bi-chevron-right"></i> PH - Setting
      </p>

      <div className={styles.container}>
        <button onClick={handleOpenBox} className={styles.phButton}>
          +New Calender
        </button>
        <select
          name=""
          id=""
          onChange={onYearChange}
          className={styles.phButton}
        >
          <option value="null">--select--</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        {isOpen && (
          <div className={styles.leaveBox}>
            <div className={styles.leaveSidebar}></div>
            <div className={styles.leaveFormGridPH}>
              {[...Array(4)].map((_, i) => (
                <>
                  <input key={i} type="date" className={styles.leaveInput} />

                  <input
                    key={i}
                    type="input"
                    className={styles.leaveInput}
                    placeholder="Holiday Name"
                  />
                  {/* <input
                  key={i}
                  type="date"
                  className={styles.leaveInput}
                /> */}
                </>
              ))}
            </div>
          </div>
        )}

        {year && (
          <div className={styles.leaveBox}>
            <div className={styles.leaveSidebar}></div>
            <div className={styles.leaveFormGridPH}>
              {holidays.map((holiday, i) => (
                <>
                  <input
                    key={i}
                    type="date"
                    className={styles.leaveInput}
                    value={holiday.year}
                  />

                  <input
                    key={i}
                    type="input"
                    className={styles.leaveInput}
                    placeholder="Holiday Name"
                    value={holiday.day}
                  />
                  {/* <input
                  key={i}
                  type="date"
                  className={styles.leaveInput}
                /> */}
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PHSettings;

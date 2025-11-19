import React from "react";
import styles from "./ApplyLeaveForm.module.css";

const ApplyLeaveForm = ({navigate}) => {
  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/leave-management")}>Leave Management</span>{" "}
        <i className="bi bi-chevron-right"></i> Apply for Leave
      </p>
      <form className={styles.formGrid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <div className={styles.formRow}>
            <label>Date :</label>
            <input
              type="text"
              readOnly
              value={new Date().toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })}
            />
          </div>
          <div className={styles.formRow}>
            <label>Employee ID :</label>
            <input type="text" placeholder="Enter ID" />
          </div>
          <div className={styles.formRow}>
            <label>Type :</label>
            <select>
              <option>-- Select --</option>
              <option>AM</option>
              <option>PM</option>
              <option>Full Day</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label>From :</label>
            <input type="date" />
            <select className={styles.miniSelect}>
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label>To :</label>
            <input type="date" />
            <select className={styles.miniSelect}>
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label>No of days :</label>
            <input type="number" />
          </div>
          <div className={styles.formRow}>
            <label>Leave Type :</label>
            <select>
              <option>-- Select --</option>
              <option>Casual Leave (CL)</option>
              <option>Sick Leave (SL)</option>
              <option>Earned Leave (EL)</option>
              <option>Compensatory off</option>
              <option>Unpaid Leave</option>
            </select>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          <div className={styles.formRow}>
            <label>Time :</label>
            <input
              type="time"
              readOnly
              Value={new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            />
          </div>

          <div className={styles.formRow}>
            <label>
              Employee <br /> Name :
            </label>
            <input type="text" placeholder="Enter Name" />
          </div>
        </div>

        {/* Reason full width below, NO label, only placeholder */}
        <div className={styles.reasonRow}>
          <textarea placeholder="Reason :" rows={3} />
        </div>
        <button className={styles.submitBtn}>Submit</button>
      </form>
    </>
  );
};

export default ApplyLeaveForm;

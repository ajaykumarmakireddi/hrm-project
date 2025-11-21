import React from "react";
import { X } from "lucide-react";
import SidePopupBox from "@/utils/SidePopupBox";
import styles from "./AttendanceForm.module.css";
import CentralPopupBox from "@/utils/CentralPopupBox";

function RequestForm({ btnName, btnClass }) {
  return (
    <>
      {/* <div className="approvedSidebar">
                <div className="attendanceContent">
                    <h2>Attendance Details</h2>
                    <span className="closeIcon" onClick={onClose}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="black" />
                        </svg>
                    </span>
                </div>
                <form className="approvedForm">
                    <label>Date : <input type="date" /></label>

                    <div className="approvedRow">
                        <label>Actual IN : <input type="time" /></label>
                        <label>Actual OUT : <input type="time" /></label>
                    </div>

                    <label>Shift : <input type="text" placeholder="G1 / G2 / G3" /></label>
                    <label>Half : <input type="text" placeholder="PH / FH / SH" /></label>

                    <div className="approvedRow">
                        <label>Request IN : <input type="time" /></label>
                        <label>Request OUT : <input type="time" /></label>
                    </div>

                    <label>Work Hours : <input type="text" /></label>
                    <label>Reason : <textarea rows="2" /></label>

                    <div className="approvedActions">
                        <button type="submit">Submit</button>
                     <button type="button" onClick={onClose}>Close</button> }
                    </div>
                </form>
            </div> */}

      <CentralPopupBox
        btnClass={btnClass}
        btnName={btnName}
        title={"Attendance Details"}
      >
        {
          <form className={styles.approvedForm}>
            <label>Date : </label>
            <input type="date" />

            <div className={styles.approvedRow}>
              <div className={styles.approvedFeild}>
                <label>Actual IN : </label>
                <input type="time" />
              </div>
              <div className={styles.approvedFeild}>
                <label>Actual OUT : </label>
                <input type="time" />
              </div>
            </div>

            <label>Shift : </label>
            <input type="text" placeholder="G1 / G2 / G3" />

            <div className={styles.approvedRow}>
              <div className={styles.approvedFeild}>
                <label>Half : </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="text" placeholder="PH / FH / SH" />
                  <input type="text" placeholder="PH / FH / SH" />
                </div>
              </div>
            </div>

            <div className={styles.approvedRow}>
              <div className={styles.approvedFeild}>
                <label>Request IN : </label>
                <input type="time" />
              </div>
              <div className={styles.approvedFeild}>
                <label>Request OUT : </label>
                <input type="time" />
              </div>
            </div>

            <label>Work Hours : </label>
            <input type="text" />

            <label>Reason : </label>
            <textarea rows="2" />

            <div className={styles.approvedActions}>
              {/* <button type="submit" className={styles.approveBtn}>Approve</button>
                        <button type="button" className={styles.declineBtn}>Decline</button> */}

              {btnName === "Hold" && (
                <button type="button" className={styles.editButton}>
                  Edit
                </button>
              )}
            </div>
          </form>
        }
      </CentralPopupBox>
    </>
  );
}

export default RequestForm;

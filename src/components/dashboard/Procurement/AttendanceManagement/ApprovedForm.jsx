import React from "react";
import { X } from "lucide-react";
import SidePopupBox from "@/utils/SidePopupBox";
import styles from "./AttendanceForm.module.css";

function ApprovedForm({ btnName }) {
  return (
    <>
      <SidePopupBox
        btnStyling={"table-view-btn"}
        btnText={btnName}
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
              <button type="submit" className={styles.approveBtn}>
                Approve
              </button>
              <button type="button" className={styles.declineBtn}>
                Decline
              </button>
            </div>
          </form>
        }
      </SidePopupBox>
    </>
  );
}

export default ApprovedForm;

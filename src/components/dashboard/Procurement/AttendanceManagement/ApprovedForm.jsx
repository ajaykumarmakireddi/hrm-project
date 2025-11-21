import React from "react";
import { X } from "lucide-react";
import styles from "./AttendanceForm.module.css";
import CentralPopupBox from "@/utils/CentralPopupBox";

function ApprovedForm({ btnName }) {
  return (
    <>
      <CentralPopupBox
        btnClass={"table-approved-btn"}
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

            <div className="d-flex justify-content-center">
              <button type="submit" className="submitbtn">
                Approve
              </button>
              <button type="button" className="cancelbtn">
                Decline
              </button>
            </div>
          </form>
        }
      </CentralPopupBox>
    </>
  );
}

export default ApprovedForm;

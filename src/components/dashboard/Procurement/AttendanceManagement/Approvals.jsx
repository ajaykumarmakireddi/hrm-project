import React from "react";
import PresentList from "./PresentList";
import styles from "./AttendanceForm.module.css";
import ApprovedForm from "./ApprovedForm";

function Approvals({navigate}) {
  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/attendance")}>Attendance</span>{" "}
        <i className="bi bi-chevron-right"></i> Approvals
      </p>

      <PresentList />
      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Date</th>
              <th>Shift</th>
              <th>Check IN</th>
              <th>Check OUT</th>
              <th>1st Half</th>
              <th>2nd Half</th>
              <th>Requested IN</th>
              <th>Requested OUT</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>00-00-0000</td>
                <td>G1</td>
                <td>00:00</td>
                <td>00:00</td>
                <td>PH</td>
                <td>PH</td>
                <td>00:00</td>
                <td>00:00</td>
                <td>
                  {/* <button className={styles.viewButton}>View</button> */}

                  <ApprovedForm btnName={"View"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Approvals;

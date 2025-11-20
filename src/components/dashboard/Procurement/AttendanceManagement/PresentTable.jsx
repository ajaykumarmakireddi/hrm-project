import React from "react";
import ApprovedForm from "./ApprovedForm";
import styles from "./AttendanceForm.module.css";

function PresentTable() {
  return (
    <>
      <table className="square-table w-75">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Date</th>
            <th>Employee code</th>
            <th>Employee Name</th>
            <th>Shift</th>
            <th>Check IN</th>
            <th>Check OUT</th>
            <th>1st Half</th>
            <th>2nd Half</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                {/* <button className={styles.viewButton}>View</button> */}
                <ApprovedForm btnName={"Present"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default PresentTable;

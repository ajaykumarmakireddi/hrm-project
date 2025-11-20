import React from 'react'
import styles from './Application.module.css'
import ApprovedForm from '../AttendanceManagement/ApprovedForm'
import ViewPopupForm from './ViewPopupForm'

function ApplicationApprovals({navigate}) {
  return (
    <>

      <p className="path">
        <span onClick={() => navigate("/applications")}>Applications</span>{" "}
        <i className="bi bi-chevron-right"></i> Approvals
      </p>
      <div className="d-flex justify-content-center p-3">
        <table className="square-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Applied For</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Karthik</td>
              <td>EMP01</td>
              <td>22-11-2022</td>
              <td>Pay Slip</td>
              <td className="table-view-btn">
                {/* <button className={styles.completedButton}>View</button> */}
                {/* <ApprovedForm btnName={"view"}/> */}
                <ViewPopupForm btnName={"view"} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ApplicationApprovals

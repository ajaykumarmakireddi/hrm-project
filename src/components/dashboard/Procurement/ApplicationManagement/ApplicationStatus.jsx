import React from 'react'
import styles from './Application.module.css'

function ApplicationStatus({navigate}) {
  return (
    <>

      <p className="path">
        <span onClick={() => navigate("/applications")}>Applications</span>{" "}
        <i className="bi bi-chevron-right"></i> Status
      </p>

      <div className={styles.appContainer}>
        <table className='square-table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Applied For</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>22-11-202</td>
              <td>Pay Slips</td>
              <td>
                <button className={"table-approved-btn"}>Completed</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ApplicationStatus

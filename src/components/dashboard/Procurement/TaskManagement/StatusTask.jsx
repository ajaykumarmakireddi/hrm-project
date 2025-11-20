import React from 'react'
import styles from './TaskManagement.module.css'
import RequestForm from '../AttendanceManagement/RequestForm'
import StatusForm from './StatusForm'

function StatusTask({navigate}) {
  // 
  return (
    <>

      <p className="path">
        <span onClick={() => navigate("/tasks")}>Tasks</span>{" "}
        <i className="bi bi-chevron-right"></i> Status
      </p>
      <div className={styles.container}>
        <table className="square-table">
          <thead>
            <tr>
              <th>S:No</th>
              <th>Subject</th>
              <th>Last Date</th>
              <th>Given To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Decrease KMs in Vadlamudi BMC Routes</td>
              <td>2024-11-26</td>
              <td>Karthik</td>
              <td className={"table-approved-btn"}>
                {/* <button>Completed</button> */}
                <StatusForm btnName={"Complete"} />
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>Decrease KMs in Vadlamudi BMC Routes</td>
              <td>2024-11-26</td>
              <td>Karthik</td>
              <td className={"table-pending-btn"}>
                {/* <button>Pending</button> */}
                <StatusForm btnName={"Pending"} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default StatusTask

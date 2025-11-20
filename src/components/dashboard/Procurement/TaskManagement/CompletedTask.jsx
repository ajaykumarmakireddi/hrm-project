import React from 'react'
import styles from './TaskManagement.module.css'
import RequestForm from '../AttendanceManagement/RequestForm'
import CompletedForm from './CompletedForm'

function CompletedTask({navigate }) {
  // 
  return (
    <>

      <p className="path">
        <span onClick={() => navigate("/tasks")}>Tasks</span>{" "}
        <i className="bi bi-chevron-right"></i> Completed
      </p>
      <div className="d-flex justify-content-center p-3">
        <table className="square-table">
          <thead>
            <tr>
              <th>S:No</th>
              <th>Subject</th>
              <th>Last Date</th>
              <th>Given By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Decrease KMs in Vadlamudi BMC Routes</td>
              <td>2024-11-26</td>
              <td>Karthik</td>
              <td className="table-approved-btn">
                {/* <button>Completed</button> */}
                <CompletedForm btnName={"Completed"} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default CompletedTask

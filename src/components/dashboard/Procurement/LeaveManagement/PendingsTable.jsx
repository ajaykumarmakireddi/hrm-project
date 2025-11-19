


import React, { useState } from 'react'
// import styles from './AttendanceForm.module.css';
import styles from '../AttendanceManagement/AttendanceForm.module.css'
import PresentList from '../AttendanceManagement/PresentList';
import ApprovedForm from '../AttendanceManagement/ApprovedForm';
import RequestForm from '../AttendanceManagement/RequestForm';
import PendingsForm from './PendingsForm';
// import PresentList from './PresentList';
// import ApprovedForm from './ApprovedForm';
// import RequestForm from './RequestForm';

function PendingsTable({ navigate }) {

  const requestsList = [{
    sn: 1,
    id: "KA0045",
    name: "Karthik",
    fromDate: "30-07-2025",
    toDate: "10-08-2025",
    noOfDays: "2",
    mobile: "7522233390",
    email: "karthik@gmail.com",
    requestOut: "00:00",
    status: "Approved"
  }, {
    sn: 2,
    id: "KA0046",
    name: "Shanmukh",
    fromDate: "31-07-2025",
    toDate: "11-08-2025",
    noOfDays: "3",
    mobile: "7522233391",
    email: "shanmukh@gmail.com",
    requestOut: "00:00",
    status: "Pending"
  }, {
    sn: 3,
    id: "KA0047",
    name: "Hari Krishna",
    fromDate: "01-08-2025",
    toDate: "12-08-2025",
    noOfDays: "4",
    mobile: "7522233392",
    email: "harikrishna@gmail.com",
    requestOut: "00:00",
    status: "Declined"
  }]


  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/leave-management")}>Leave Management</span>{" "}
        <i className="bi bi-chevron-right"></i> Pendings
      </p>

      <div className="d-flex justify-content-center p-3">
        <table className="square-table">

          <thead>
            <tr>
              <th>S.NO</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>No Of Days</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requestsList.map((req) => (<tr className="circular-table-row">
              <td >{req.sn}</td>
              <td>{req.id}</td>
              <td>{req.name}</td>
              <td>{req.fromDate}</td>
              <td>{req.toDate}</td>
              <td>{req.noOfDays}</td>
              <td>{req.mobile}</td>
              <td>{req.email}</td>
              <td>
                {/* <RequestForm btnName={req.status} btnClass={req.status === "Approved" ? styles.approveButton : req.status === "Pending" ? styles.holdButton : styles.declineButton} /> */}
                <PendingsForm btnName={req.status} btnClass={req.status === "Approved" ? styles.approveButton : req.status === "Pending" ? styles.holdButton : styles.declineButton} />
              </td>

            </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  )
}

export default PendingsTable;


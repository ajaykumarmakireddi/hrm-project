import React from 'react';
import SidePopupBox from '@/utils/SidePopupBox';
import styles from './ApprovalsTray.module.css'; // Make sure to create and style this CSS module
import CentralPopupBox from '@/utils/CentralPopupBox';

export default function ApprovalsTray({
  row,
  selectedRow,
  onSelectRow
}) {
  const isThisOpen = selectedRow && selectedRow.id === row.id;

  const handleApprove = (event) => {
    event.preventDefault();
    // alert(`✅ Approved leave for ${row.name}`);
    onSelectRow(null);
  };

  const handleDecline = (event) => {
    // alert(`❌ Declined leave for ${row.name}`);
    event.preventDefault();
    onSelectRow(null);
  };

  return (
    <CentralPopupBox
      title="Leave Status Details"
      btnName="View"
      btnStyling="table-view-btn"
      open={isThisOpen}
      onClose={() => onSelectRow(null)}
    >
      <form className={styles.leaveForm}>
        <div className={styles.leaveForm}>
          <div className={styles.rowGroup}>
            <div className={styles.inputGroup}>
              <label>Date:</label>
              <input type="text" value={row.date} readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label>Time:</label>
              <input type="text" value={row.time || "AM"} readOnly />
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.inputGroup}>
              <label>Employee ID:</label>
              <input type="text" value={row.empId} readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label>Employee Name:</label>
              <input type="text" value={row.name} readOnly />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Leave Type:</label>
            <input type="text" value={row.leaveType} readOnly />
          </div>

          <div className={styles.inputGroup}>
            <label>Type:</label>
            <input type="text" value={row.type} readOnly />
          </div>

          <div className={styles.inputGroup}>
            <label>From Date:</label>
            <input type="text" value={row.fromDate} readOnly />
          </div>

          <div className={styles.inputGroup}>
            <label>To Date:</label>
            <input type="text" value={row.toDate} readOnly />
          </div>

          <div className={styles.inputGroup}>
            <label>No. of Days:</label>
            <input type="text" value={row.noOfDays} readOnly />
          </div>

          <div className={styles.inputGroup}>
            <label>Reason:</label>
            <textarea value={row.reason} readOnly />
          </div>

          <div>
            <button className='table-approved-btn' onClick={handleApprove}>Approve</button>
            <button className='table-declined-btn' onClick={handleDecline}>Decline</button>
          </div>
        </div>

      </form>
    </CentralPopupBox>
  );
}

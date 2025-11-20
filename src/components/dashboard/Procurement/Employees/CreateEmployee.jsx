// src/modules/employees/CreateEmployee.jsx
import React from 'react';
import styles from './CreateEmployee.module.css';
import { FaUserPlus } from 'react-icons/fa';

export default function CreateEmployee({navigate}) {
  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/employees")}>Employees</span>{" "}
        <i className="bi bi-chevron-right"></i> Create Employee
      </p>

      <div className={styles.outerContainer}>
        <div className={styles.formContainer}>
          {/* LEFT SIDE */}
          <div className={styles.leftPanel}>
            <div className={styles.row}>
              <label>Department :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>Role :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>State :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>District :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>Center :</label>
              <input type="text" />
            </div>
            <div className={styles.iconBox}>
              <FaUserPlus size={48} color="#226688" />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.rightPanel}>
            <div className={styles.row}>
              <label>First Name :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>Last Name :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>Surname :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>Mobile Number :</label>
              <input type="text" />
            </div>
            <div className={styles.row}>
              <label>Email ID :</label>
              <input type="email" />
            </div>

            <div className={styles.buttonGroup}>
              <button className={"table-approved-btn"}>Submit</button>
              <button className={"table-declined-btn"}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

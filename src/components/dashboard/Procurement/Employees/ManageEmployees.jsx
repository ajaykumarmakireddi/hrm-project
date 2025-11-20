import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageEmployees.module.css";
import CentralPopupBox from "@/utils/CentralPopupBox";
import ViewEmployeeDetails from "./ViewEmployeeDetails";

const initialEmployees = [
  {
    id: 1,
    empId: "1234",
    name: "karthik",
    mobile: "9863452345",
    email: "abc@gmail.com",
    roles: ["Admin"],
    enabled: true,
  },
  {
    id: 2,
    empId: "1235",
    name: "shanmukh",
    mobile: "9863452346",
    email: "ecf@gmail.com",
    roles: ["Editor"],
    enabled: false,
  },
];

const ManageEmployees = ({navigate}) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [viewingEmployeePage, setViewingEmployeePage] = useState(false);
  const deletePopupRef = useRef();

  const handleToggle = (id) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, enabled: !emp.enabled } : emp
      )
    );
  };

  const handleDeleteClick = (employee) => {
    setDeleteCandidate(employee);
  };

  const confirmDelete = () => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== deleteCandidate.id));
    deletePopupRef.current?.closePopup();
    setDeleteCandidate(null);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setViewingEmployeePage(true);
  };

  if (viewingEmployeePage) {
    return (
      <ViewEmployeeDetails
        employee={selectedEmployee}
        onBack={() => setViewingEmployeePage(false)}
      />
    );
  }

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/employees")}>Employees</span>{" "}
        <i className="bi bi-chevron-right"></i> Manage Employees
      </p>

      <div className={styles.appContainer}>
        <table className="square-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Emp ID</th>
              <th>Employee Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Role</th>
              <th>Enable/Disable</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
                <td>{index + 1}</td>
                <td>{emp.empId}</td>
                <td>{emp.name}</td>
                <td>{emp.mobile}</td>
                <td>{emp.email}</td>
                <td>{emp.roles.join(", ")}</td>
                <td>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={emp.enabled}
                      onChange={() => handleToggle(emp.id)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </td>
                <td>
                  <button
                    className={"table-view-btn"}
                    onClick={() => handleView(emp)}
                  >
                    View
                  </button>
                  <CentralPopupBox
                    ref={deletePopupRef}
                    btnName="Delete"
                    btnClass={"table-declined-btn"}
                  >
                    <div className={styles.popupContent}>

                      <p>
                        Are you sure you want to delete {" "}
                        <strong>{deleteCandidate?.name}</strong>?
                      </p>
                      <div className={styles.popupActions}>
                        <button onClick={confirmDelete} className={styles.confirmBtn}>
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => deletePopupRef.current?.closePopup()}
                          className={styles.cancelBtn}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </CentralPopupBox>
                  <button
                    className={styles.hiddenDeleteSetup}
                    onClick={() => handleDeleteClick(emp)}
                    style={{ display: "none" }}
                  >
                    SetupDelete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageEmployees;

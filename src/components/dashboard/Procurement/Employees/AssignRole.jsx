import React, { useState, useEffect } from "react";
import SidePopupBox from "@/utils/SidePopupBox";
import styles from "./AssignRole.module.css";
import CentralPopupBox from "@/utils/CentralPopupBox";

const employeeData = [
  {
    id: 1,
    empId: "1234",
    name: "karthik",
    mobile: "9863452345",
    email: "abc@gmail.com",
    roles: ["Admin"],
  },
  {
    id: 2,
    empId: "1234",
    name: "shanmukh",
    mobile: "9863452345",
    email: "ecf@gmail.com",
    roles: ["Editor"],
  },
];

const availableRoles = ["Admin", "Editor", "Viewer", "HR", "Finance"];

const AssignRole = ({navigate}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRolesInput, setSelectedRolesInput] = useState("");
  const [formValues, setFormValues] = useState({
    empId: "",
    name: "",
    mobile: "",
    email: "",
  });

  // Open popup and fill values
  const handleViewClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedRoles(employee.roles || []);
    setFormValues({
      empId: employee.empId,
      name: employee.name,
      mobile: employee.mobile,
      email: employee.email,
    });
    setPopupOpen(true);
  };

  // Submit logic
  const handleSubmit = () => {
    console.log("Updated Info:");
    console.log("Form Values:", formValues);
    console.log("Selected Roles:", selectedRoles);
    setPopupOpen(false);
  };

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/employees")}>Employees</span>{" "}
        <i className="bi bi-chevron-right"></i> Assign Role
      </p>
      <div className="d-flex justify-content-center p-3">
        <table className="square-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Emp ID</th>
              <th>Employee Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((emp, index) => (
              <tr key={emp.id}>
                <td>{index + 1}</td>
                <td>{emp.empId}</td>
                <td>{emp.name}</td>
                <td>{emp.mobile}</td>
                <td>{emp.email}</td>
                <td>{emp.roles.join(", ")}</td>
                <td>
                  <button
                    className={"table-view-btn"}
                    onClick={() => handleViewClick(emp)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <CentralPopupBox
          title="Employee Role Assignment"
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
        >
          {selectedEmployee && (
            <div className={styles.popupContent}>
              <label><strong>Employee ID:</strong></label>
              <input
                type="text"
                value={formValues.empId}
                onChange={(e) => setFormValues({ ...formValues, empId: e.target.value })}
                className={styles.input}
              />

              <label><strong>Employee Name:</strong></label>
              <input
                type="text"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                className={styles.input}
              />

              <label><strong>Mobile Number:</strong></label>
              <input
                type="text"
                value={formValues.mobile}
                onChange={(e) => setFormValues({ ...formValues, mobile: e.target.value })}
                className={styles.input}
              />

              <label><strong>Email:</strong></label>
              <input
                type="email"
                value={formValues.email}
                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                className={styles.input}
              />

              <label><strong>Add Role:</strong></label>
              <div className={styles.roleInputRow}>
                <select
                  value={selectedRolesInput}
                  onChange={(e) => setSelectedRolesInput(e.target.value)}
                  className={styles.singleSelect}
                >
                  <option value="" disabled>Select a role</option>
                  {availableRoles
                    .filter((role) => !selectedRoles.includes(role))
                    .map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                </select>
                <button
                  className={styles.addButton}
                  onClick={() => {
                    if (selectedRolesInput && !selectedRoles.includes(selectedRolesInput)) {
                      setSelectedRoles([...selectedRoles, selectedRolesInput]);
                      setSelectedRolesInput("");
                    }
                  }}
                >
                  Add
                </button>
              </div>

              <div className={styles.roleList}>
                {selectedRoles.map((role) => (
                  <div key={role} className={styles.roleItem}>
                    {role}
                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        setSelectedRoles(selectedRoles.filter((r) => r !== role))
                      }
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.popupActions}>
                <button onClick={handleSubmit} className={styles.submitBtn}>
                  Submit
                </button>
                <button onClick={() => setPopupOpen(false)} className={styles.cancelBtn}>
                  Close
                </button>
              </div>
            </div>
          )}
        </CentralPopupBox>
      </div>
    </>
  );
};

export default AssignRole;

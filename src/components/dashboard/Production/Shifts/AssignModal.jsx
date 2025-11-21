import React, { useState } from "react";
import styles from "./Shifts.module.css";

/*
Props:
 - shift: shift object
 - onAssign(assignedList, effectiveFrom, until)
 - onClose()
*/
export default function AssignModal({ shift, onAssign, onClose }) {
  const [assignTo, setAssignTo] = useState("employees"); // employees | role | department
  const [selectedEmployees, setSelectedEmployees] = useState([]); // array of user objects
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [until, setUntil] = useState("indefinite");
  const [untilDate, setUntilDate] = useState("");

  // Dummy lists
  const dummyEmployees = [
    { id: 201, name: "Employee A" },
    { id: 202, name: "Employee B" },
    { id: 203, name: "Employee C" },
  ];
  const dummyRoles = ["Operator", "Supervisor", "Manager"];
  const dummyDepartments = ["Operations", "HR", "Sales"];

  const toggleSelect = (listSetter, list, item) => {
    if (list.some((x) => x.id === item.id || x === item)) {
      listSetter(list.filter((x) => (x.id ? x.id !== item.id : x !== item)));
    } else {
      listSetter([...list, item]);
    }
  };

  const handleAssign = () => {
    let assignedList = [];
    if (assignTo === "employees") assignedList = selectedEmployees;
    else if (assignTo === "role")
      assignedList = selectedRoles.map((r) => ({ role: r }));
    else assignedList = selectedDepartments.map((d) => ({ dept: d }));

    if (assignedList.length === 0) {
      if (!window.confirm("No members selected. Assign anyway?")) return;
    }
    onAssign &&
      onAssign(
        assignedList,
        effectiveFrom,
        until === "indefinite" ? null : untilDate
      );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Assign Shift: {shift.name}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label>
              <input
                type="radio"
                checked={assignTo === "employees"}
                onChange={() => setAssignTo("employees")}
              />{" "}
              Employees
            </label>{" "}
            <label>
              <input
                type="radio"
                checked={assignTo === "role"}
                onChange={() => setAssignTo("role")}
              />{" "}
              Role
            </label>{" "}
            <label>
              <input
                type="radio"
                checked={assignTo === "department"}
                onChange={() => setAssignTo("department")}
              />{" "}
              Department
            </label>
          </div>

          {assignTo === "employees" && (
            <div>
              <div style={{ fontWeight: 700 }}>Select Employees</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {dummyEmployees.map((e) => (
                  <button
                    key={e.id}
                    className={
                      selectedEmployees.some((s) => s.id === e.id)
                        ? styles.chipSelected
                        : styles.chip
                    }
                    onClick={() =>
                      toggleSelect(setSelectedEmployees, selectedEmployees, e)
                    }
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {assignTo === "role" && (
            <div>
              <div style={{ fontWeight: 700 }}>Select Roles</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {dummyRoles.map((r) => (
                  <button
                    key={r}
                    className={
                      selectedRoles.includes(r)
                        ? styles.chipSelected
                        : styles.chip
                    }
                    onClick={() =>
                      toggleSelect(setSelectedRoles, selectedRoles, r)
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {assignTo === "department" && (
            <div>
              <div style={{ fontWeight: 700 }}>Select Departments</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {dummyDepartments.map((d) => (
                  <button
                    key={d}
                    className={
                      selectedDepartments.includes(d)
                        ? styles.chipSelected
                        : styles.chip
                    }
                    onClick={() =>
                      toggleSelect(
                        setSelectedDepartments,
                        selectedDepartments,
                        d
                      )
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label>Effective From</label>
            <input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
            />
            <label>Until</label>
            <select value={until} onChange={(e) => setUntil(e.target.value)}>
              <option value="indefinite">Indefinite</option>
              <option value="custom">Custom Date</option>
            </select>
            {until === "custom" && (
              <input
                type="date"
                value={untilDate}
                onChange={(e) => setUntilDate(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.primary} onClick={handleAssign}>
            Assign
          </button>
          <button
            className={styles.secondary}
            onClick={() => {
              handleAssign(); /* remain open for "Save & Assign More" */
            }}
          >
            Save & Assign More
          </button>
          <button onClick={onClose} className={styles.tertiary}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

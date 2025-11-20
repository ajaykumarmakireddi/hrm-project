import React, { useState } from "react";
import styles from "./AttendanceForm.module.css";
import WeekoffPopup from "./WeekoffPopup";
import RolesPopup from "./RolesPopup";

function WeekoffSettings({ navigate }) {
  const [filter, setFilter] = useState("employee");
  const [role, setRole] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [openPopup, setOpenPopup] = useState();

  const dummyData = [
    {
      id: "KA0045",
      name: "Karthik",
      mobile: "8521478965",
      email: "karthik@gmail.com",
    },
    {
      id: "KA0046",
      name: "Ajay",
      mobile: "1234567890",
      email: "ajay@gmail.com",
    },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(dummyData.map((emp) => emp.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows((prev) => [...prev, id]);
    }
  };

  const isAllSelected =
    dummyData.length > 0 && selectedRows.length === dummyData.length;

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/attendance")}>Attendance</span>{" "}
        <i className="bi bi-chevron-right"></i> Weekoff - Settings
      </p>

      <div className={styles.weekContainer}>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setRole(""); // reset role when switching
          }}
          className={styles.dropdown}
        >
          {/* <option value="">Select Option</option> */}
          <option value="employee">Employee Based</option>
          <option value="role">Role Based</option>
        </select>

        {filter === "role" && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.dropdown}
          >
            <option value="">Select Role</option>
            <option value="role1">Role 1</option>
            <option value="role2">Role 2</option>
            <option value="role3">Role 3</option>
            <option value="role4">Role 4</option>
            <option value="role5">Role 5</option>
          </select>
        )}
      </div>

      {/* 👇 Employee Based Table */}
      {filter === "employee" && (
        <div className="d-flex justify-content-center">
          <table className="square-table w-75">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Emp Id</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>KA0046</td>
                  <td>Karthik</td>
                  <td>1234567890</td>
                  <td>karthik@gmail.com</td>
                  <td>
                    <button
                      className={styles.viewButtonRequest}
                      onClick={() => setSelectedEmployee(dummyData[i])}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 👇 Role Based Dropdown */}
      {filter === "role" && (
        <>
          {/* <div className={styles.weekContainer}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.dropdown}
            >
              <option value="">Select Role</option>
              <option value="role1">Role 1</option>
              <option value="role2">Role 2</option>
              <option value="role3">Role 3</option>
            </select>
          </div> */}

          {/* 👇 Table shown only when a role is selected */}
          {filter === "role" && role && (
            <div className="d-flex justify-content-center">
              <table className="square-table w-75">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>S.no</th>
                    <th>Emp Id</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyData.map((emp, i) => (
                    <tr key={emp.id} className="circular-table-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(emp.id)}
                          onChange={() => handleSelectRow(emp.id)}
                        />
                      </td>
                      <td>{i + 1}</td>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.mobile}</td>
                      <td>{emp.email}</td>
                      {/* <td>
                        <button
                          className={styles.viewButtonRequest}
                          onClick={() => setSelectedEmployee(emp)}
                        >
                          View
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
                <RolesPopup
                  role={role}
                  btnClass={styles.viewButtonWeek}
                  btnName={"view"}
                  selectedRows={selectedRows}
                />
              </table>
            </div>
          )}
        </>
      )}
      {selectedEmployee && (
        <WeekoffPopup
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </>
  );
}

export default WeekoffSettings;

// import React, { useState } from 'react';
// import styles from './AttendanceForm.module.css';
// import WeekoffPopup from './WeekoffPopup';

// function WeekoffSettings() {
//   const [filter, setFilter] = useState("employee");
//   const [role, setRole] = useState('');
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedRows, setSelectedRows] = useState([]);

//   const dummyData = [
//     { id: 'KA0045', name: 'Karthik', mobile: '8521478965', email: 'karthik@gmail.com' },
//     { id: 'KA0046', name: 'Ajay', mobile: '1234567890', email: 'ajay@gmail.com' },
//     { id: 'KA0047', name: 'Priya', mobile: '9876543210', email: 'priya@gmail.com' }
//   ];

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedRows(dummyData.map(emp => emp.id));
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   const handleSelectRow = (id) => {
//     if (selectedRows.includes(id)) {
//       setSelectedRows(prev => prev.filter(rowId => rowId !== id));
//     } else {
//       setSelectedRows(prev => [...prev, id]);
//     }
//   };

//   const isAllSelected = dummyData.length > 0 && selectedRows.length === dummyData.length;

//   return (
//     <>
//       <div className={styles.weekContainer}>
//         <select
//           value={filter}
//           onChange={(e) => {
//             setFilter(e.target.value);
//             setRole('');
//             setSelectedRows([]);
//           }}
//           className={styles.dropdown}
//         >
//           <option value="employee">Employee Based</option>
//           <option value="role">Role Based</option>
//         </select>

//         {filter === 'role' && (
//           <select
//             value={role}
//             onChange={(e) => {
//               setRole(e.target.value);
//               setSelectedRows([]);
//             }}
//             className={styles.dropdown}
//           >
//             <option value="">Select Role</option>
//             <option value="role1">Role 1</option>
//             <option value="role2">Role 2</option>
//             <option value="role3">Role 3</option>
//             <option value="role4">Role 4</option>
//             <option value="role5">Role 5</option>
//           </select>
//         )}
//       </div>

//       {filter === 'role' && role && (
//         <div className={styles.tableContainer}>
//           <table className="circular-table">
//             <thead>
//               <tr>
//                 <th>
//                   <input
//                     type="checkbox"
//                     checked={isAllSelected}
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//                 <th>S.no</th>
//                 <th>Emp Id</th>
//                 <th>Name</th>
//                 <th>Mobile</th>
//                 <th>Email</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dummyData.map((emp, i) => (
//                 <tr key={emp.id} className="circular-table-row">
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selectedRows.includes(emp.id)}
//                       onChange={() => handleSelectRow(emp.id)}
//                     />
//                   </td>
//                   <td>{i + 1}</td>
//                   <td>{emp.id}</td>
//                   <td>{emp.name}</td>
//                   <td>{emp.mobile}</td>
//                   <td>{emp.email}</td>
//                   <td>
//                     <button
//                       className={styles.viewButtonRequest}
//                       onClick={() => setSelectedEmployee(emp)}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {selectedEmployee && (
//         <WeekoffPopup
//           employee={selectedEmployee}
//           onClose={() => setSelectedEmployee(null)}
//         />
//       )}
//     </>
//   );
// }

// export default WeekoffSettings;

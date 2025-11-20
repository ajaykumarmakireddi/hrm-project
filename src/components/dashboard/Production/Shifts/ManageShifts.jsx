import React from "react";
import ViewPopupForm from "../../Procurement/ApplicationManagement/ViewPopupForm";
import SidePopupForm from "./SidePopupForm";

function ManageShifts({ navigate }) {
  const employees = [
    {
      name: "Karthik",
      id: "KEMP0004",
      mobile: "1234567899",
      role: "Intern",
      shift: "1",
    },
    {
      name: "Shanmukh",
      id: "KEMP0005",
      mobile: "1234567890",
      role: "Staff",
      shift: "2",
    },
    {
      name: "Hari Krishna",
      id: "KEMP0006",
      mobile: "1234567890",
      role: "Superviosor",
      shift: "1",
    },
  ];

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/shifts")}>Shifts</span>{" "}
        <i className="bi bi-chevron-right"></i> Manage-Shifts
      </p>

      <div className="d-flex justify-content-center p-3">
        <table className="square-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Mobile Number</th>
              <th>Role</th>
              <th>Shifts</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Karthik</td>
              <td>KEMP004</td>
              <td>1234567890</td>
              <td>Intern</td>
              <td>1</td>
              <td className="table-view-btn">
                <SidePopupForm btnName={"view"} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageShifts;

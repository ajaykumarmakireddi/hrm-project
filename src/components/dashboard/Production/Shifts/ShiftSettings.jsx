import React from "react";
import ShiftsGeneralSettings from "./ShiftSettings/ShiftsGeneralSettings";
import AttendanceSettings from "./ShiftSettings/AttendanceSettings";
import TimeCalculationSettings from "./ShiftSettings/TimeCalculationSettings";
import OvertimeRulesSettings from "./ShiftSettings/OvertimeRulesSettings";
import WeekoffHolidaySettings from "./ShiftSettings/WeekoffHolidaySettings";
import LeaveHandlingSettings from "./ShiftSettings/LeaveHandlingSettings";
import AutoActionPenaltiesSettings from "./ShiftSettings/AutoActionPenaltiesSettings";
import PermissionAccessControlSettings from "./ShiftSettings/PermissionAccessControlSettings";
import IntegrationsSettings from "./ShiftSettings/IntegrationsSettings";

function ShiftSettings({ navigate }) {
  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/shifts")}>Shifts</span>{" "}
        <i className="bi bi-chevron-right"></i> Shift-Settings
      </p>

      <ShiftsGeneralSettings />
      <AttendanceSettings />
      <TimeCalculationSettings />
      <OvertimeRulesSettings />
      <WeekoffHolidaySettings />
      <LeaveHandlingSettings />
      <AutoActionPenaltiesSettings />
      <PermissionAccessControlSettings />
      <IntegrationsSettings />
    </>
  );
}

export default ShiftSettings;

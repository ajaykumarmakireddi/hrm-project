import React, { useState } from "react";
// import styles from './LeaveSettings.module.css';
import styles from "./AttendanceForm.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";
import GeneralSettings from "./AttendanceSettingsTables/GeneralSettings";
import ShiftsTimingsConfigurations from "./AttendanceSettingsTables/ShiftsTimingsConfigurations";
import BufferFlexiTimeRules from "./AttendanceSettingsTables/BufferFlexiTimeRules";
import AttendanceSources from "./AttendanceSettingsTables/AttendanceSources";
import RegularizationApprovals from "./AttendanceSettingsTables/RegularizationApprovals";
import LeaveHolidayHandling from "./AttendanceSettingsTables/LeaveHolidayHandling";
import EmployeeRoleMapping from "./AttendanceSettingsTables/EmployeeRoleMapping";
import NotificationsAlerts from "./AttendanceSettingsTables/NotificationsAlerts";
import PayrollIntegration from "./AttendanceSettingsTables/PayroleIntegration";
import ReportingDisplay from "./AttendanceSettingsTables/ReportingDisplay";

const LeaveSettings = ({navigate}) => {
  

  
  
  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/attendance")}>Attendance</span>{" "}
        <i className="bi bi-chevron-right"></i> Leave - Setting
      </p>

      <GeneralSettings/>
      <ShiftsTimingsConfigurations/>
      <BufferFlexiTimeRules/>
      <AttendanceSources/>
      <RegularizationApprovals/>
      <LeaveHolidayHandling/>
      <EmployeeRoleMapping/>
      <NotificationsAlerts/>
      <PayrollIntegration/>
      <ReportingDisplay/>

    </>
  );
};

export default LeaveSettings;

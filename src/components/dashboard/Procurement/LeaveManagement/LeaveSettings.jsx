import React from 'react'
import LeaveTypesConfiguration from './LeaveManagementTables/LeaveTypesCofiguraton'
import LeaveRolesRestrictions from './LeaveManagementTables/LeaveRolesRestrictions'
import LeaveBalanceCredit from './LeaveManagementTables/LeaveBalanceCredit'
import ApprovalWorkFlow from './LeaveManagementTables/ApprovalWorkFlow'
import HolidayWeekendsApplicability from './LeaveManagementTables/HolidayWeekendsApplicability'
import VisibilityUsage from './LeaveManagementTables/VisibilityUsage'
import NotificationsSettings from './LeaveManagementTables/NotificationsSettings'
import AddManageLeaveTypes from './LeaveManagementTables/AddManageLeaveTypes'

const LeaveSettings = ({navigate}) => {
  return (
    <>

      <p className="path">
        <span onClick={() => navigate("/leave-management")}>Leave Management</span>
        <i className="bi bi-chevron-right"></i> Leave - Setting
      </p>
      <LeaveTypesConfiguration />
      <LeaveRolesRestrictions/>
      <LeaveBalanceCredit/>
      <ApprovalWorkFlow/>
      <HolidayWeekendsApplicability/>
      <VisibilityUsage/>
      <NotificationsSettings/>
      <AddManageLeaveTypes/>
    </>
  )
}

export default LeaveSettings

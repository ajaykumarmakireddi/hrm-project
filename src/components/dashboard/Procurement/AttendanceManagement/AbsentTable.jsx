import React from 'react'
import ApprovedForm from './ApprovedForm'
import styles from './AttendanceForm.module.css';

function AbsentTable() {
    return (
        <>
                <table className="square-table w-75">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Date</th>
                            <th>Employee code</th>
                            <th>Employee Name</th>
                            <th>Type of Leave</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map((item, i) => (
                            <tr key={i} className="circular-table-row">
                                <td >{i + 1}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                
                                
                                <td>
                                    <button className={styles.viewButton}>Absent</button>
                                    {/* <ApprovedForm btnName={"Absent"}/> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </>
    )
}

export default AbsentTable

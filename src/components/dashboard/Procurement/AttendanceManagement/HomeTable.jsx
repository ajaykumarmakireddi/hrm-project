import React from 'react'
import ApprovedForm from './ApprovedForm'
import styles from './AttendanceForm.module.css';

function HomeTable() {
    return (
        <>
            <table className="square-table w-75">
                <thead>
                    <tr>
                        <th>S.no</th>
                        <th>Date</th>
                        <th>Shift</th>
                        <th>Check IN</th>
                        <th>Check OUT</th>
                        <th>1st Half</th>
                        <th>2nd Half</th>
                        <th>Working Hours</th>
                        <th>ExtraWork Hours</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3].map((item, i) => (
                        <tr key={i}>
                            <td >{i + 1}</td>
                            <td>00-00-0000</td>
                            <td>G1</td>
                            <td>00:00</td>
                            <td>00:00</td>
                            <td>PH</td>
                            <td>PH</td>
                            <td>00:00</td>
                            <td>00:00</td>
                            <td>
                                {/* <button className={styles.viewButton}>View</button> */}
                                <ApprovedForm btnName={"View"} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default HomeTable

import SidePopupBox from '@/utils/SidePopupBox'
import React from 'react'
import styles from '../AttendanceManagement/AttendanceForm.module.css'
import CentralPopupBox from '@/utils/CentralPopupBox'

function PendingsForm({ btnClass, btnName }) {
    return (
        <>
            <CentralPopupBox btnClass={btnClass} btnName={btnName} title={"Leave Details"} >
                {<form className={styles.approvedForm}>
                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Date : </label>
                            <input type="date" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Employee ID : </label>
                            <input type="text" />
                        </div>

                    </div>


                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Employee Name : </label>
                            <input type="text" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Type : </label>
                            <input type="text" />
                        </div>

                    </div>
                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>From : </label>
                            <input type="text" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>AM/PM : </label>
                            <input type="text" />
                        </div>

                    </div>
                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>To : </label>
                            <input type="text" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>AM/PM : </label>
                            <input type="text" />
                        </div>

                    </div>

                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>No Of Days : </label>
                            <input type="time" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Leave Type : </label>
                            <input type="time" />
                        </div>
                    </div>
                    <label>Reason : </label>
                    <textarea rows="2" />

                    <div className={styles.approvedActions}>
                        {/* <button type="submit" className={styles.approveBtn}>Approve</button>
                              <button type="button" className={styles.declineBtn}>Decline</button> */}

                        {btnName === "Pending" && <button type="button" className={styles.editButton}>Edit</button>}
                    </div>
                </form>}
            </CentralPopupBox>

        </>
    )
}

export default PendingsForm

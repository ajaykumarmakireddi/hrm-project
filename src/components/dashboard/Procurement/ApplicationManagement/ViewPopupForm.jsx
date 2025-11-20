import React from 'react'
import SidePopupBox from '@/utils/SidePopupBox'
import styles from '../AttendanceManagement/AttendanceForm.module.css';
import CentralPopupBox from '@/utils/CentralPopupBox';


function ViewPopupForm({ btnName}) {
    return (
        <>

            <CentralPopupBox btnStyling={styles.viewButtonRequest} btnName={btnName} title={"Application Details"} >
                {<form className={styles.approvedForm}>
                    <label>Date : </label>
                    <input type="date" />

                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Employee Name : </label>
                            <input type="text" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Empolyee ID : </label>
                            <input type="text" />
                        </div>

                    </div>

                    <label>Applied For :  </label>
                    {/* <input type="text" placeholder="G1 / G2 / G3" /> */}
                    <input type="text" />
{/* 
                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Half : </label>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input type="text" placeholder="PH / FH / SH" />
                                <input type="text" placeholder="PH / FH / SH" />
                            </div>
                        </div>

                    </div>


                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Request IN : </label>
                            <input type="time" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Request OUT : </label>
                            <input type="time" />
                        </div>
                    </div>

                    <label>Work Hours : </label>
                    <input type="text" />
 */}
                    <label>Reason : </label>
                    <textarea rows="2" />

                    <div >
                        <button type="submit" className={"table-approved-btn"}>Approve</button>
                        <button type="button" className={"table-declined-btn"}>Decline</button>
                    </div>
                </form>}
            </CentralPopupBox>
        </>
    )
}

export default ViewPopupForm

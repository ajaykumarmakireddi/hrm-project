import React from 'react'
import SidePopupBox from '@/utils/SidePopupBox'
import styles from './TaskManagement.module.css'
import CentralPopupBox from '@/utils/CentralPopupBox'

function CompletedForm({ btnClass, btnName }) {
    return (
        <>
{/* check this comment ajay */}
            <CentralPopupBox btnClass={btnClass} btnName={btnName} title={"Completed Tasks"} >
                {<form className={styles.approvedForm}>
                    <label>Date : </label>
                    <input type="date" />

                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Time : </label>
                            <input type="time" />
                        </div>
                        {/* <div className={styles.approvedFeild}>
                            <label>Actual OUT : </label>
                            <input type="time" />
                        </div> */}

                    </div>

                    <label>Given By : </label>
                    <input type="text" placeholder="" />

                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Last Date to Submit : </label>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input type="text" placeholder="PH / FH / SH" />
                                {/* <input type="text" placeholder="PH / FH / SH" /> */}
                            </div>
                        </div>

                    </div>


                    {/* <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Request IN : </label>
                            <input type="time" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Request OUT : </label>
                            <input type="time" />
                        </div>
                    </div> */}

                    <label>Subject : </label>
                    <input type="text" />

                    <label>Description : </label>
                    <textarea rows="2" />
                    <label>Submitted Date : </label>
                    <input type="date" />
                    <label>Descripttion about Submission : </label>
                    <textarea rows="2" />

                    <div >
                        <button  className={"table-declined-btn"}>Cancel</button>
                        {/* <button type="button" className={styles.declineBtn}>Completed</button> */}

                        {/* {btnName === "Hold" && <button type="button" className={styles.editButton}>Edit</button>} */}
                    </div>
                </form>}
            </CentralPopupBox>

        </>
    )
}

export default CompletedForm

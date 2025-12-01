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


                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Date : </label>
                            <input type="date" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Time : </label>
                            <input type="text" />
                        </div>

                    </div>

                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Given Time : </label>
                            <input type="date" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Last Date to Submit : </label>
                            <input type="text" />
                        </div>

                    </div>

                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Subject : </label>
                            <input type="date" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Submitted Date : </label>
                            <input type="text" />
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

                    

                    <label>Description : </label>
                    <textarea rows="2" />
                   
                    <label>Descripttion about Submission : </label>
                    <textarea rows="2" />

                    <div >
                        <button className={"table-declined-btn"}>Cancel</button>
                        {/* <button type="button" className={styles.declineBtn}>Completed</button> */}

                        {/* {btnName === "Hold" && <button type="button" className={styles.editButton}>Edit</button>} */}
                    </div>
                </form>}
            </CentralPopupBox>

        </>
    )
}

export default CompletedForm

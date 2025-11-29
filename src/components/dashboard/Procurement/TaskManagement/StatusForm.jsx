import React from 'react'
import SidePopupBox from '@/utils/SidePopupBox'
import styles from './TaskManagement.module.css'
import CentralPopupBox from '@/utils/CentralPopupBox'

function StatusForm({ btnClass, btnName }) {
    // 
    return (
        <>
            <CentralPopupBox btnClass={btnClass} btnName={btnName} title={"Task Status"} >
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
                            <label>Given By : </label>
                            <input type="date" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Given To : </label>
                            <input type="text" />
                        </div>

                    </div>
                    


                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Last Date to Submit : </label>
                            <input type="date" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Subject : </label>
                            <input type="text" />
                        </div>
                    </div>

                    

                    <label>Description : </label>
                    <textarea rows="2" />

                    <div className={styles.approvedActions}>
                        <button type="submit" className="table-declined-btn">Cancel</button>
                        {/* <button type="button" className={styles.declineBtn}>Completed</button> */}

                        {/* {btnName === "Hold" && <button type="button" className={styles.editButton}>Edit</button>} */}
                    </div>
                </form>}
            </CentralPopupBox>
        </>
    )
}

export default StatusForm

import SidePopupBox from '@/utils/SidePopupBox'
import React from 'react'
import styles from '../../../../components/dashboard/Procurement/AttendanceManagement/AttendanceForm.module.css'
import CentralPopupBox from '@/utils/CentralPopupBox'


function SidePopupForm({ btnName }) {
    return (
        <>
            <CentralPopupBox btnStyling={styles.viewButtonRequest} btnName={btnName} title={"Delete Shift"} >
                {<form className={styles.approvedForm}>


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

                    <div className={styles.approvedRow}>
                        <div className={styles.approvedFeild}>
                            <label>Mobile Number : </label>
                            <input type="text" />
                        </div>
                        <div className={styles.approvedFeild}>
                            <label>Role : </label>
                            <input type="text" />
                        </div>
                    </div>


                    <label>Shift : </label>
                    <select name="" id="">
                        <option value="">--select--</option>
                        <option value="">some data</option>
                        <option value="">some data</option>
                        <option value="">some data</option>
                    </select>
                   
                    <div>
                        <button type="submit" className={"table-approved-btn"}>Submit</button>
                        <button type="button" className={"table-declined-btn"}>Cancel</button>
                    </div>
                </form>}
            </CentralPopupBox>

        </>
    )
}

export default SidePopupForm

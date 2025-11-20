import React, { useRef } from 'react'
import SidePopupBox from '@/utils/SidePopupBox'
import styles from './TaskManagement.module.css'

function PendingFormTwo({ onCompleteClick }) {

    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click(); // trigger hidden input
    };
    // 
    const handleFileChange = (event) => {
        const files = event.target.files;
        console.log("Selected files:", files);
    };


    return (
        <>


            {<form className={styles.approvedForm} onSubmit={(e) => e.preventDefault()}>

                <label>Subject : </label>
                <textarea rows="2" />

                <label>Submission Date : </label>
                <input type="date" />

                <label htmlFor="">Upload :</label>
                {/* <button className="upload-btn" onClick={handleButtonClick}>
                    Choose Files
                </button> */}
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden-input"
                    onChange={handleFileChange}
                />
                {/* <input type="file" /> */}

                {/* <div className={styles.approvedRow}>
                    <div className={styles.approvedFeild}>
                        <label>Time : </label>
                        <input type="time" />
                    </div>
                    <div className={styles.approvedFeild}>
                        <label>Actual OUT : </label>
                        <input type="time" />
                    </div>

                </div>

                <label>Given By : </label>
                <input type="text" placeholder="" /> */}
                {/* 
                <div className={styles.approvedRow}>
                    <div className={styles.approvedFeild}>
                        <label>Last Date to Submit : </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input type="text" placeholder="PH / FH / SH" />
                            <input type="text" placeholder="PH / FH / SH" />
                        </div>
                    </div>

                </div> */}


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

                {/* <label>Subject : </label>
                <input type="text" /> */}

                <label>Description and Submission: </label>
                <textarea rows="2" />

                

                <div className="d-flex justify-content-center">
                    <button className="cancelbtn" onClick={onCompleteClick}>
                        Cancel
                    </button>
                    <button onClick={onCompleteClick} className="submitbtn">
                        Submit
                    </button>
                </div>
            </form>}

        </>
    )
}

export default PendingFormTwo

import { useNavigate } from "react-router-dom";
import React from "react";


function LeaveManagementHomePage() {

    const navigate = useNavigate();
    
    return (
        <>
            <div className="row m-0 p-0">
                <div className="col">
                    <button
                        className={`homebtn`}
                        onClick={() => navigate("/leave-management/apply")}
                    >
                        Apply for Leave
                    </button>
                    <button
                        className={`homebtn`}
                        onClick={() => navigate("/leave-management/pendings")}
                    >
                        Pendings
                    </button>
                    <button
                        className={`homebtn`}
                        onClick={() => navigate("/leave-management/leave-settings")}   
                    >
                        Leave Settings
                    </button>
                    <button
                        className={`homebtn`}
                        onClick={() => navigate("/leave-management/approvals")}
                    >
                        Approvals
                    </button>
                </div>
            </div>
        </>
    );
}

export default LeaveManagementHomePage;
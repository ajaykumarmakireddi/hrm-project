import React from "react";
import CentralNavBar from "@/utils/CentralNavBar";
import styles from "./AttendanceForm.module.css";
import PresentList from "./PresentList";
import { useLocation, useNavigate } from "react-router-dom";

function AttendanceHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <CentralNavBar></CentralNavBar>
    </>
  );
}

export default AttendanceHeader;

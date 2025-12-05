// Modal.jsx
import React, { useEffect } from "react";
import modalStyles from "./Modal.module.css";

export default function Modal({ title, children, onClose }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    function backdropClick(e) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div className={modalStyles.backdrop} onClick={backdropClick}>
            <div className={modalStyles.modal}>
                <div className={modalStyles.header}>
                    <h3>{title}</h3>
                    <button className={modalStyles.closeBtn} onClick={onClose} aria-label="Close">×</button>
                </div>
                <div className={modalStyles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}

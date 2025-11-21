import React from "react";
import styles from "./Shifts.module.css";

export default function AssignedMembersModal({ shift, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Assigned Members for {shift.name}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div>
          {(shift.assigned || []).length === 0 ? (
            <div>No members assigned</div>
          ) : (
            <ul>
              {shift.assigned.map((m) => (
                <li key={m.id}>
                  {m.name} ({m.id})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.primary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// StepApprovalWorkflow.jsx
import React, { useState } from "react";
import styles from "./PayrollRunEngine.module.css";

export default function StepApprovalWorkflow({
  approverOptions = [],
  defaultApprover = "",
  defaultSequence = "parallel",
  onSave = () => {},
}) {
  const [approver, setApprover] = useState(defaultApprover);
  const [sequence, setSequence] = useState(defaultSequence);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    const payload = {
      approver,
      sequence,
      notes,
      savedAt: new Date().toISOString(),
    };
    onSave(payload);
  };

  return (
    <div className={styles.container}>
      <p className={styles.stepPara}>
        Configure the approval workflow by selecting the approver, choosing the
        approval sequence (parallel or sequential), and adding optional notes.
        Once approved, payroll will be locked.
      </p>

      <div className={styles.form}>
        {/* Approver */}
        <div className={styles.field}>
          <label className={styles.label}>Approver</label>
          <select
            className={styles.input}
            value={approver}
            onChange={(e) => setApprover(e.target.value)}
          >
            <option value="">Select Approver</option>
            {approverOptions.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Sequence */}
        <div className={styles.field}>
          <label className={styles.label}>Approval Sequence</label>
          <select
            className={styles.input}
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
          >
            <option value="parallel">Parallel</option>
            <option value="sequential">Sequential</option>
          </select>
        </div>

        {/* Notes */}
        <div className={styles.field}>
          <label className={styles.label}>Notes</label>
          <textarea
            className={styles.textarea}
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Button */}
        <div className="d-flex justify-content-center">
          <button className={"submitbtn"} onClick={handleSave}>
            Save & Notify Approvers
          </button>
        </div>
      </div>
    </div>
  );
}

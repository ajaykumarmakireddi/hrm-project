import React, { useState, useEffect } from "react";
import styles from "./Shifts.module.css";

/*
Props:
 - initial: if present, it's an edit. contains shift object
 - onCreate(data) => returns true if created ok
 - onSave(id, data)
 - onClose()
*/
function ShiftFormModal({ initial, onCreate, onSave, onClose }) {
  const defaultState = {
    name: "",
    code: "",
    type: "Regular",
    start: "09:00",
    end: "17:00",
    breakMins: 30,
    color: "#67D352",
    description: "",
    status: "Active",
  };
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        code: initial.code || "",
        type: initial.type || "Regular",
        start: initial.start || "09:00",
        end: initial.end || "17:00",
        breakMins: initial.breakMins || 0,
        color: initial.color || "#67D352",
        description: initial.description || "",
        status: initial.status || "Active",
      });
    }
  }, [initial]);

  const handleSubmitCreate = () => {
    // validate required
    if (!form.name.trim() || !form.code.trim()) {
      alert("Name and Code are required.");
      return;
    }
    const ok = onCreate && onCreate(form);
    if (ok === false) return;
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) {
      alert("Name and Code are required.");
      return;
    }
    onSave && onSave(initial.id, form);
  };

  // compute working hours live
  const computeWorking = () => {
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    let s = toMin(form.start);
    let e = toMin(form.end);
    if (e <= s) e += 24 * 60;
    const total = e - s - (Number(form.breakMins) || 0);
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    return `${hh}h ${mm}m`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{initial ? "Edit Shift" : "Create Shift"}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className={styles.formGrid}>
          <label>
            Shift Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label>
            Shift Code
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </label>

          <label>
            Shift Type
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Regular</option>
              <option>Rotational</option>
              <option>Split</option>
              <option>Flexible</option>
            </select>
          </label>

          <label>
            Start Time
            <input
              type="time"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
            />
          </label>

          <label>
            End Time
            <input
              type="time"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
            />
          </label>

          <label>
            Break (mins)
            <input
              type="number"
              min={0}
              value={form.breakMins}
              onChange={(e) => setForm({ ...form, breakMins: e.target.value })}
            />
          </label>

          <label>
            Color Code
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
            Description
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>

          <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
            <strong>Working Hours (calculated):</strong> {computeWorking()}
          </div>
        </div>

        <div className="d-flex justify-content-center p-3">
          {initial ? (
            <button className={"submitbtn"} onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className={"submitbtn"} onClick={handleSubmitCreate}>
              Create & Assign
            </button>
          )}
          <button onClick={onClose} className={"cancelbtn"}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShiftFormModal;

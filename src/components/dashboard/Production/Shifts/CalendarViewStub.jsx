import React from "react";
import styles from "./Shifts.module.css";

/* A simplified calendar stub showing shifts by day/time block.
   In production, replace with react-big-calendar/fullcalendar */
export default function CalendarViewStub({ shifts }) {
  return (
    <div className={styles.calendarStub}>
      <h4>Calendar View (stub)</h4>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {shifts.map((s) => (
          <div key={s.id} className={styles.calendarCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, background: s.color, borderRadius: 4 }} />
              <strong>{s.name}</strong>
            </div>
            <div>{s.start} - {s.end}</div>
            <div>{s.type} • {(s.assigned||[]).length} assigned</div>
          </div>
        ))}
      </div>
    </div>
  );
}

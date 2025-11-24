import React, { useState, useMemo } from "react";
import ShiftFormModal from "./ShiftFormModal";
import AssignModal from "./AssignModal";
import AssignedMembersModal from "./AssignedMembersModal";
import CalendarViewStub from "./CalendarViewStub";
import styles from "./Shifts.module.css";
import { useNavigate } from "react-router-dom";

/* Dummy initial data */
const initialShifts = [
  {
    id: 1,
    name: "Morning Shift",
    code: "MS001",
    type: "Regular",
    start: "09:00",
    end: "17:00",
    breakMins: 30,
    color: "#67D352",
    description: "Default morning shift",
    status: "Active",
    assigned: [
      { id: 101, name: "Alice" },
      { id: 102, name: "Bob" },
    ],
    deleted: false,
  },
  {
    id: 2,
    name: "Night Shift",
    code: "NS001",
    type: "Rotational",
    start: "22:00",
    end: "06:00",
    breakMins: 45,
    color: "#0070AC",
    description: "Night rotation",
    status: "Inactive",
    assigned: [{ id: 103, name: "Charlie" }],
    deleted: false,
  },
  {
    id: 3,
    name: "Split Shift",
    code: "SS001",
    type: "Split",
    start: "09:00",
    end: "19:00", // we'll interpret split in description
    breakMins: 60,
    color: "#E6A017",
    description: "Split working hours",
    status: "Active",
    assigned: [],
    deleted: false,
  },
];

export default function ShiftsPage() {
  const [shifts, setShifts] = useState(initialShifts);
  const [filter, setFilter] = useState({
    q: "",
    type: "",
    dept: "",
    role: "",
    status: "",
  });

  // UI state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editShift, setEditShift] = useState(null);
  const [assignShift, setAssignShift] = useState(null);
  const [membersList, setMembersList] = useState(null);
  const [calendarMode, setCalendarMode] = useState(false);

  // Pagination simple
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filters applied
  const filtered = useMemo(() => {
    return shifts
      .filter((s) => !s.deleted)
      .filter((s) => {
        if (filter.q) {
          const q = filter.q.toLowerCase();
          if (
            !(
              s.name.toLowerCase().includes(q) ||
              s.code.toLowerCase().includes(q) ||
              s.type.toLowerCase().includes(q)
            )
          ) {
            return false;
          }
        }
        if (filter.type && s.type !== filter.type) return false;
        if (filter.status && s.status !== filter.status) return false;
        // dept & role not implemented in dummy shifts, skip
        return true;
      });
  }, [shifts, filter]);

  const navigate = useNavigate();

  // Handlers
  const handleCreate = (shiftData) => {
    // if code must be unique — do quick check
    if (shifts.some((s) => s.code === shiftData.code)) {
      alert("Shift code must be unique.");
      return false;
    }
    const newShift = {
      ...shiftData,
      id: Date.now(),
      assigned: [],
      deleted: false,
    };
    setShifts((prev) => [newShift, ...prev]);
    return true;
  };

  const handleSaveEdit = (id, newData) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...newData } : s))
    );
  };

  const handleDuplicate = (id) => {
    const src = shifts.find((s) => s.id === id);
    if (!src) return;
    const copy = {
      ...src,
      id: Date.now(),
      code: src.code + "_COPY",
      name: src.name + " (Copy)",
      assigned: [],
    };
    setShifts((prev) => [copy, ...prev]);
  };

  const handleSoftDelete = (id) => {
    // warn about dependencies: if assigned count > 0 show dependency warning
    const s = shifts.find((sh) => sh.id === id);
    if (!s) return;
    if (s.assigned && s.assigned.length > 0) {
      if (
        !window.confirm(
          `This shift has ${s.assigned.length} assigned employees. Soft-delete anyway?`
        )
      ) {
        return;
      }
    } else if (!window.confirm("Delete this shift?")) {
      return;
    }
    setShifts((prev) =>
      prev.map((sh) => (sh.id === id ? { ...sh, deleted: true } : sh))
    );
  };

  const handleAssignOpen = (shift) => {
    setAssignShift(shift);
  };

  const handleAssignSave = (shiftId, assignedList, effectiveFrom, until) => {
    // For dummy: append assignedList entries to shift.assigned
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? { ...s, assigned: [...(s.assigned || []), ...assignedList] }
          : s
      )
    );
    setAssignShift(null);
  };

  const handleViewAssigned = (shift) => setMembersList(shift);

  // Simple export/import stubs
  const handleExport = () => {
    const csv = ["id,name,code,type,start,end,break,color,status,assignedCount"]
      .concat(
        shifts.map(
          (s) =>
            `${s.id},${s.name},${s.code},${s.type},${s.start},${s.end},${
              s.breakMins
            },${s.color},${s.status},${(s.assigned || []).length}`
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shifts_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // calculate working hours (hh:mm) from start/end and break minutes
  const computeWorkingHours = (start, end, breakMins) => {
    // start,end in "HH:MM" 24 hr
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    let s = toMin(start);
    let e = toMin(end);
    // if end <= start -> next day
    if (e <= s) e += 24 * 60;
    const total = e - s - (breakMins || 0);
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    return `${hh}h ${mm}m`;
  };

  // Pagination slice
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        {/* <div className={styles.title}>Shifts</div> */}
        <div className={styles.actions}>
          <button onClick={() => setIsCreateOpen(true)} className="homebtn">
            + Create Shift
          </button>
          <button
            className="homebtn"
            onClick={() => alert("Open bulk assign (not implemented in dummy)")}
          >
            Assign Shift
          </button>
          <button
            className="homebtn"
            onClick={() => setCalendarMode((s) => !s)}
          >
            {calendarMode ? "List View" : "Calendar View"}
          </button>
          <button
            className="homebtn"
            onClick={() => navigate("/shifts/shift-settings")}
          >
            Shift Settings
          </button>
        </div>
        <div className="d-flex gap-3">
          <button
            className={styles.tertiary}
            onClick={() => alert("Import CSV (stub)")}
          >
            Import
          </button>
          <button className={styles.tertiary} onClick={handleExport}>
            Export
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          placeholder="Search by name, code, type..."
          value={filter.q}
          onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
        />
        <select
          value={filter.type}
          onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">All Types</option>
          <option>Regular</option>
          <option>Rotational</option>
          <option>Split</option>
          <option>Flexible</option>
        </select>
        <select
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">Any Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>
          Showing {filtered.length} shifts
        </div>
      </div>

      {/* Calendar or List */}
      {calendarMode ? (
        <CalendarViewStub shifts={filtered} />
      ) : (
        <>
          <div className="d-flex justify-content-center pt-3">
            <table className="square-table w-75">
              <thead>
                <tr>
                  <th>Shift Name</th>
                  <th>Type</th>
                  <th>Working Hours</th>
                  <th>Break</th>
                  <th>Start - End</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            background: s.color,
                            borderRadius: 4,
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: "#666" }}>
                            {s.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{s.type}</td>
                    <td>{computeWorkingHours(s.start, s.end, s.breakMins)}</td>
                    <td>{s.breakMins} mins</td>
                    <td>
                      {s.start} - {s.end}
                    </td>
                    <td>
                      <button
                        className={styles.link}
                        onClick={() => handleViewAssigned(s)}
                      >
                        {(s.assigned || []).length} Employees
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.badge}
                        onClick={() =>
                          setShifts((prev) =>
                            prev.map((sh) =>
                              sh.id === s.id
                                ? {
                                    ...sh,
                                    status:
                                      sh.status === "Active"
                                        ? "Inactive"
                                        : "Active",
                                  }
                                : sh
                            )
                          )
                        }
                      >
                        {s.status}
                      </button>
                    </td>
                    <td>
                      <div className="d-flex gap-3">
                        <button
                          className={"table-view-btn"}
                          onClick={() => {
                            setEditShift(s);
                            setIsCreateOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={"table-pending-btn"}
                          onClick={() => handleDuplicate(s.id)}
                        >
                          Duplicate
                        </button>
                        <button
                          className={"table-approved-btn"}
                          onClick={() => handleAssignOpen(s)}
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => handleSoftDelete(s.id)}
                          className={"table-declined-btn"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span>
              Page {page} / {pageCount}
            </span>
            <button
              disabled={page === pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      {isCreateOpen && (
        <ShiftFormModal
          initial={editShift}
          onClose={() => {
            setIsCreateOpen(false);
            setEditShift(null);
          }}
          onCreate={(data) => {
            const ok = handleCreate(data);
            if (ok) {
              setIsCreateOpen(false);
            }
          }}
          onSave={(id, data) => {
            handleSaveEdit(id, data);
            setIsCreateOpen(false);
            setEditShift(null);
          }}
        />
      )}

      {assignShift && (
        <AssignModal
          shift={assignShift}
          onClose={() => setAssignShift(null)}
          onAssign={(assignedList, effFrom, until) =>
            handleAssignSave(assignShift.id, assignedList, effFrom, until)
          }
        />
      )}

      {membersList && (
        <AssignedMembersModal
          shift={membersList}
          onClose={() => setMembersList(null)}
        />
      )}
    </div>
  );
}

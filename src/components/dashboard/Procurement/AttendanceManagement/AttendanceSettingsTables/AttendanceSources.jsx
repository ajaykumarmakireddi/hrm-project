import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const attendanceMethodOptions = [
  "Fingerprint",
  "Mobile GPS",
  "Web Check-In",
  "RFID",
  "Face Recognition",
];

const defaultEntries = [
  {
    attendanceMethods: ["Fingerprint", "Web Check-In"],
    ipRestrictions: ["192.168.1.0/24"],
    geoRadiusMeters: 50,
    selfCheckInAllowed: true,
    autoCheckInOnLogin: false,
  },
  {
    attendanceMethods: ["Mobile GPS"],
    ipRestrictions: [],
    geoRadiusMeters: 100,
    selfCheckInAllowed: false,
    autoCheckInOnLogin: true,
  },
];

const blankNewEntry = {
  attendanceMethods: [],
  ipRestrictions: [],
  geoRadiusMeters: 0,
  selfCheckInAllowed: false,
  autoCheckInOnLogin: false,
};

const AttendanceSources = () => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // temporary input states for IP add fields per-row (only used in edit mode)
  // store as object: { [rowIndex]: currentInputValue }
  const [ipInputs, setIpInputs] = useState({});

  // Enter edit mode
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(entries)));
    setEditMode(true);
  };

  // Cancel -> revert
  const handleCancel = () => {
    if (backupEntries) setEntries(backupEntries);
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setIpInputs({});
    setEditMode(false);
  };

  // Save -> commit
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setIpInputs({});
    setEditMode(false);
  };

  // Update simple field for existing entry
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Toggle attendance method checkbox for a row
  const toggleAttendanceMethod = (index, method) => {
    const updated = [...entries];
    const arr = updated[index].attendanceMethods || [];
    if (arr.includes(method)) {
      updated[index].attendanceMethods = arr.filter((m) => m !== method);
    } else {
      updated[index].attendanceMethods = [...arr, method];
    }
    setEntries(updated);
  };

  // Add IP restriction to row (uses ipInputs state)
  const addIpToRow = (index) => {
    const val = (ipInputs[index] || "").trim();
    if (!val) return;
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      ipRestrictions: Array.from(new Set([...(updated[index].ipRestrictions || []), val])),
    };
    setEntries(updated);
    setIpInputs((s) => ({ ...s, [index]: "" }));
  };

  const removeIpFromRow = (index, ipIndex) => {
    const updated = [...entries];
    const arr = [...(updated[index].ipRestrictions || [])];
    arr.splice(ipIndex, 1);
    updated[index].ipRestrictions = arr;
    setEntries(updated);
  };

  // Add IP for newEntry (local temporary input)
  const [newEntryIpInput, setNewEntryIpInput] = useState("");
  const addIpToNewEntry = () => {
    const val = newEntryIpInput.trim();
    if (!val) return;
    setNewEntry((prev) => ({
      ...prev,
      ipRestrictions: Array.from(new Set([...(prev.ipRestrictions || []), val])),
    }));
    setNewEntryIpInput("");
  };
  const removeIpFromNewEntry = (ipIndex) => {
    setNewEntry((prev) => {
      const arr = [...(prev.ipRestrictions || [])];
      arr.splice(ipIndex, 1);
      return { ...prev, ipRestrictions: arr };
    });
  };

  // Delete a row
  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Add a new row
  const handleAddEntry = () => {
    // basic validation: geoRadiusMeters >= 0
    if (newEntry.geoRadiusMeters < 0) {
      alert("Geo Location Radius must be 0 or greater.");
      return;
    }
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
    setNewEntryIpInput("");
  };

  return (
    <>
      <h4 className={styles.title}>Attendance Sources</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Attendance Methods</th>
              <th>IP Restrictions</th>
              <th>Geo Location Radius (meters)</th>
              <th>Self Check-In Allowed</th>
              <th>Auto Check-In on Login</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Attendance Methods (checkbox list in edit mode, comma list otherwise) */}
                <td>
                  {editMode ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {attendanceMethodOptions.map((m) => (
                        <label key={m} style={{ fontSize: 13 }}>
                          <input
                            type="checkbox"
                            checked={!!(row.attendanceMethods || []).includes(m)}
                            onChange={() => toggleAttendanceMethod(idx, m)}
                          />{" "}
                          {m}
                        </label>
                      ))}
                    </div>
                  ) : (
                    (row.attendanceMethods || []).length ? row.attendanceMethods.join(", ") : "—"
                  )}
                </td>

                {/* IP Restrictions (list + add input in edit mode) */}
                <td>
                  <div>
                    {(row.ipRestrictions || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {row.ipRestrictions.map((ip, i) => (
                          <div
                            key={i}
                            style={{
                              background: "#eef2f7",
                              padding: "4px 8px",
                              borderRadius: 12,
                              display: "inline-flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontSize: 13 }}>{ip}</span>
                            {editMode && (
                              <button
                                type="button"
                                onClick={() => removeIpFromRow(idx, i)}
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
                                }}
                                title="Remove"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#666", fontSize: 13 }}>—</div>
                    )}

                    {editMode && (
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <input
                          className={styles.input}
                          placeholder="Add IP / CIDR"
                          value={ipInputs[idx] || ""}
                          onChange={(e) => setIpInputs((s) => ({ ...s, [idx]: e.target.value }))}
                        />
                        <button className={styles.addBtn} type="button" onClick={() => addIpToRow(idx)}>
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                {/* Geo Radius */}
                <td>
                  {editMode ? (
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={row.geoRadiusMeters}
                      onChange={(e) => updateField(idx, "geoRadiusMeters", Number(e.target.value))}
                    />
                  ) : (
                    `${row.geoRadiusMeters ?? 0} m`
                  )}
                </td>

                {/* Self Check-In Allowed */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.selfCheckInAllowed}
                        onChange={(e) => updateField(idx, "selfCheckInAllowed", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.selfCheckInAllowed ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.selfCheckInAllowed ? "Yes" : "No"
                  )}
                </td>

                {/* Auto Check-In on Login */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.autoCheckInOnLogin}
                        onChange={(e) => updateField(idx, "autoCheckInOnLogin", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.autoCheckInOnLogin ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.autoCheckInOnLogin ? "Yes" : "No"
                  )}
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(idx)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* NEW ENTRY ROW */}
            {editMode && (
              <tr className={styles.newRow}>
                {/* Attendance Methods (checkboxes) */}
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {attendanceMethodOptions.map((m) => (
                      <label key={m} style={{ fontSize: 13 }}>
                        <input
                          type="checkbox"
                          checked={(newEntry.attendanceMethods || []).includes(m)}
                          onChange={() =>
                            setNewEntry((prev) => {
                              const arr = prev.attendanceMethods || [];
                              return arr.includes(m)
                                ? { ...prev, attendanceMethods: arr.filter((x) => x !== m) }
                                : { ...prev, attendanceMethods: [...arr, m] };
                            })
                          }
                        />{" "}
                        {m}
                      </label>
                    ))}
                  </div>
                </td>

                {/* IP Restrictions (list + input for new entry) */}
                <td>
                  <div>
                    {(newEntry.ipRestrictions || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {newEntry.ipRestrictions.map((ip, i) => (
                          <div
                            key={i}
                            style={{
                              background: "#eef2f7",
                              padding: "4px 8px",
                              borderRadius: 12,
                              display: "inline-flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontSize: 13 }}>{ip}</span>
                            <button
                              type="button"
                              onClick={() => removeIpFromNewEntry(i)}
                              style={{ border: "none", background: "transparent", cursor: "pointer" }}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#666", fontSize: 13 }}>—</div>
                    )}

                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <input
                        className={styles.input}
                        placeholder="Add IP / CIDR"
                        value={newEntryIpInput}
                        onChange={(e) => setNewEntryIpInput(e.target.value)}
                      />
                      <button className={styles.addBtn} type="button" onClick={addIpToNewEntry}>
                        Add
                      </button>
                    </div>
                  </div>
                </td>

                {/* Geo Radius */}
                <td>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={newEntry.geoRadiusMeters}
                    onChange={(e) => setNewEntry({ ...newEntry, geoRadiusMeters: Number(e.target.value) })}
                  />
                </td>

                {/* Self Check-In Allowed */}
                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.selfCheckInAllowed}
                      onChange={(e) => setNewEntry({ ...newEntry, selfCheckInAllowed: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.selfCheckInAllowed ? "Yes" : "No"}</span>
                  </label>
                </td>

                {/* Auto Check-In on Login */}
                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.autoCheckInOnLogin}
                      onChange={(e) => setNewEntry({ ...newEntry, autoCheckInOnLogin: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.autoCheckInOnLogin ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td className={styles.actionsCell}>
                  <button className={styles.addBtn} onClick={handleAddEntry}>
                    + Add
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center p-3">
        {!editMode ? (
          <button className="submitbtn" onClick={handleEnterEdit}>Edit</button>
        ) : (
          <>
            <button className="submitbtn" onClick={handleSave}>Save</button>
            <button className="cancelbtn" onClick={handleCancel}>Cancel</button>
          </>
        )}
      </div>
    </>
  );
};

export default AttendanceSources;

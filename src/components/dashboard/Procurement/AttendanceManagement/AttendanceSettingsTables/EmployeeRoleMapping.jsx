import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const weeklyOffOptions = [
  "Count as Working Day",
  "Exclude (no work)",
  "Count as Leave",
  "Flexible",
];

const defaultEntries = [
  {
    // new rule lists
    employeeBasedRules: ["Flexible hours allowed", "Work-from-home twice a week"],
    roleBasedRules: ["Manager override", "Mandatory approvals"],
    priorityRule: "Employee-based", // "Employee-based" | "Role-based" | "Both"

    // keep previous fields (if you don't need them you can remove)
    autoMarkAbsent: true,
    considerApprovedLeaveAsPresent: false,
    considerHolidaysAsPresent: true,
    weeklyOffHandling: "Exclude (no work)",
  },
  {
    employeeBasedRules: ["Overtime approval required"],
    roleBasedRules: ["Payroll sync"],
    priorityRule: "Role-based",

    autoMarkAbsent: false,
    considerApprovedLeaveAsPresent: true,
    considerHolidaysAsPresent: false,
    weeklyOffHandling: "Count as Working Day",
  },
];

const blankNewEntry = {
  employeeBasedRules: [],
  roleBasedRules: [],
  priorityRule: "Employee-based",

  autoMarkAbsent: false,
  considerApprovedLeaveAsPresent: false,
  considerHolidaysAsPresent: false,
  weeklyOffHandling: weeklyOffOptions[0],
};

const EmployeeRoleMapping = () => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // temporary per-row inputs for adding rules: { [rowIndex]: "current input" }
  const [employeeRuleInputs, setEmployeeRuleInputs] = useState({});
  const [roleRuleInputs, setRoleRuleInputs] = useState({});

  // temporary inputs for new entry lists
  const [newEntryEmployeeRuleInput, setNewEntryEmployeeRuleInput] = useState("");
  const [newEntryRoleRuleInput, setNewEntryRoleRuleInput] = useState("");

  // Enter edit mode (keep backup for cancel)
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(entries)));
    setEditMode(true);
  };

  // Cancel -> revert to backup
  const handleCancel = () => {
    if (backupEntries) setEntries(backupEntries);
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEmployeeRuleInputs({});
    setRoleRuleInputs({});
    setNewEntryEmployeeRuleInput("");
    setNewEntryRoleRuleInput("");
    setEditMode(false);
  };

  // Save -> commit (we already updated entries live)
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setEmployeeRuleInputs({});
    setRoleRuleInputs({});
    setNewEntryEmployeeRuleInput("");
    setNewEntryRoleRuleInput("");
    setEditMode(false);
  };

  // Update single field (keeps previous fields for compatibility)
  const updateField = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  // Delete row
  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Add row
  const handleAddEntry = () => {
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
    setNewEntryEmployeeRuleInput("");
    setNewEntryRoleRuleInput("");
  };

  // Employee rule helpers (per-row)
  const addEmployeeRuleToRow = (index) => {
    const val = (employeeRuleInputs[index] || "").trim();
    if (!val) return;
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      employeeBasedRules: Array.from(new Set([...(updated[index].employeeBasedRules || []), val])),
    };
    setEntries(updated);
    setEmployeeRuleInputs((s) => ({ ...s, [index]: "" }));
  };

  const removeEmployeeRuleFromRow = (index, ruleIndex) => {
    const updated = [...entries];
    const arr = [...(updated[index].employeeBasedRules || [])];
    arr.splice(ruleIndex, 1);
    updated[index].employeeBasedRules = arr;
    setEntries(updated);
  };

  // Role rule helpers (per-row)
  const addRoleRuleToRow = (index) => {
    const val = (roleRuleInputs[index] || "").trim();
    if (!val) return;
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      roleBasedRules: Array.from(new Set([...(updated[index].roleBasedRules || []), val])),
    };
    setEntries(updated);
    setRoleRuleInputs((s) => ({ ...s, [index]: "" }));
  };

  const removeRoleRuleFromRow = (index, ruleIndex) => {
    const updated = [...entries];
    const arr = [...(updated[index].roleBasedRules || [])];
    arr.splice(ruleIndex, 1);
    updated[index].roleBasedRules = arr;
    setEntries(updated);
  };

  // New entry rule helpers
  const addEmployeeRuleToNewEntry = () => {
    const v = newEntryEmployeeRuleInput.trim();
    if (!v) return;
    setNewEntry((prev) => ({
      ...prev,
      employeeBasedRules: Array.from(new Set([...(prev.employeeBasedRules || []), v])),
    }));
    setNewEntryEmployeeRuleInput("");
  };
  const removeEmployeeRuleFromNewEntry = (i) => {
    setNewEntry((prev) => {
      const arr = [...(prev.employeeBasedRules || [])];
      arr.splice(i, 1);
      return { ...prev, employeeBasedRules: arr };
    });
  };

  const addRoleRuleToNewEntry = () => {
    const v = newEntryRoleRuleInput.trim();
    if (!v) return;
    setNewEntry((prev) => ({
      ...prev,
      roleBasedRules: Array.from(new Set([...(prev.roleBasedRules || []), v])),
    }));
    setNewEntryRoleRuleInput("");
  };
  const removeRoleRuleFromNewEntry = (i) => {
    setNewEntry((prev) => {
      const arr = [...(prev.roleBasedRules || [])];
      arr.splice(i, 1);
      return { ...prev, roleBasedRules: arr };
    });
  };

  return (
    <>
      <h4 className={styles.title}>Employee & Role Mapping</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Employee Based Rules</th>
              <th>Role Based Rules</th>
              <th>Priority Rule</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Employee Based Rules */}
                <td>
                  <div>
                    {(row.employeeBasedRules || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        {row.employeeBasedRules.map((r, i) => (
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
                            <span style={{ fontSize: 13 }}>{r}</span>
                            {editMode && (
                              <button
                                type="button"
                                onClick={() => removeEmployeeRuleFromRow(idx, i)}
                                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                                title="Remove"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>—</div>
                    )}

                    {editMode && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          className={styles.input}
                          placeholder="Add employee rule"
                          value={employeeRuleInputs[idx] || ""}
                          onChange={(e) => setEmployeeRuleInputs((s) => ({ ...s, [idx]: e.target.value }))}
                        />
                        <button className={styles.addBtn} type="button" onClick={() => addEmployeeRuleToRow(idx)}>
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                {/* Role Based Rules */}
                <td>
                  <div>
                    {(row.roleBasedRules || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        {row.roleBasedRules.map((r, i) => (
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
                            <span style={{ fontSize: 13 }}>{r}</span>
                            {editMode && (
                              <button
                                type="button"
                                onClick={() => removeRoleRuleFromRow(idx, i)}
                                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                                title="Remove"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>—</div>
                    )}

                    {editMode && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          className={styles.input}
                          placeholder="Add role rule"
                          value={roleRuleInputs[idx] || ""}
                          onChange={(e) => setRoleRuleInputs((s) => ({ ...s, [idx]: e.target.value }))}
                        />
                        <button className={styles.addBtn} type="button" onClick={() => addRoleRuleToRow(idx)}>
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                {/* Priority Rule - radio group */}
                <td>
                  {editMode ? (
                    <div>
                      <label style={{ marginRight: 8 }}>
                        <input
                          type="radio"
                          name={`priority_${idx}`}
                          value="Employee-based"
                          checked={row.priorityRule === "Employee-based"}
                          onChange={() => updateField(idx, "priorityRule", "Employee-based")}
                        />{" "}
                        Employee-based
                      </label>

                      <label style={{ marginRight: 8 }}>
                        <input
                          type="radio"
                          name={`priority_${idx}`}
                          value="Role-based"
                          checked={row.priorityRule === "Role-based"}
                          onChange={() => updateField(idx, "priorityRule", "Role-based")}
                        />{" "}
                        Role-based
                      </label>

                      <label>
                        <input
                          type="radio"
                          name={`priority_${idx}`}
                          value="Both"
                          checked={row.priorityRule === "Both"}
                          onChange={() => updateField(idx, "priorityRule", "Both")}
                        />{" "}
                        Both
                      </label>
                    </div>
                  ) : (
                    <span>{row.priorityRule}</span>
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
                {/* Employee Based Rules (new entry) */}
                <td>
                  <div>
                    {(newEntry.employeeBasedRules || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        {newEntry.employeeBasedRules.map((r, i) => (
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
                            <span style={{ fontSize: 13 }}>{r}</span>
                            <button
                              type="button"
                              onClick={() => removeEmployeeRuleFromNewEntry(i)}
                              style={{ border: "none", background: "transparent", cursor: "pointer" }}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>—</div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        className={styles.input}
                        placeholder="Add employee rule"
                        value={newEntryEmployeeRuleInput}
                        onChange={(e) => setNewEntryEmployeeRuleInput(e.target.value)}
                      />
                      <button className={styles.addBtn} type="button" onClick={addEmployeeRuleToNewEntry}>
                        Add
                      </button>
                    </div>
                  </div>
                </td>

                {/* Role Based Rules (new entry) */}
                <td>
                  <div>
                    {(newEntry.roleBasedRules || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        {newEntry.roleBasedRules.map((r, i) => (
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
                            <span style={{ fontSize: 13 }}>{r}</span>
                            <button
                              type="button"
                              onClick={() => removeRoleRuleFromNewEntry(i)}
                              style={{ border: "none", background: "transparent", cursor: "pointer" }}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>—</div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        className={styles.input}
                        placeholder="Add role rule"
                        value={newEntryRoleRuleInput}
                        onChange={(e) => setNewEntryRoleRuleInput(e.target.value)}
                      />
                      <button className={styles.addBtn} type="button" onClick={addRoleRuleToNewEntry}>
                        Add
                      </button>
                    </div>
                  </div>
                </td>

                {/* Priority Rule (new entry) */}
                <td>
                  <div>
                    <label style={{ marginRight: 8 }}>
                      <input
                        type="radio"
                        name="priority_new"
                        value="Employee-based"
                        checked={newEntry.priorityRule === "Employee-based"}
                        onChange={() => setNewEntry({ ...newEntry, priorityRule: "Employee-based" })}
                      />{" "}
                      Employee-based
                    </label>

                    <label style={{ marginRight: 8 }}>
                      <input
                        type="radio"
                        name="priority_new"
                        value="Role-based"
                        checked={newEntry.priorityRule === "Role-based"}
                        onChange={() => setNewEntry({ ...newEntry, priorityRule: "Role-based" })}
                      />{" "}
                      Role-based
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="priority_new"
                        value="Both"
                        checked={newEntry.priorityRule === "Both"}
                        onChange={() => setNewEntry({ ...newEntry, priorityRule: "Both" })}
                      />{" "}
                      Both
                    </label>
                  </div>
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
          <button className="submitbtn" onClick={handleEnterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className="submitbtn" onClick={handleSave}>
              Save
            </button>
            <button className="cancelbtn" onClick={handleCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default EmployeeRoleMapping;

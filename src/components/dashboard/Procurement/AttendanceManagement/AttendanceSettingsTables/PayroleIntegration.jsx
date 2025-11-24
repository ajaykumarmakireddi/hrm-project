import React, { useState } from "react";
import styles from "../../LeaveManagement/LeaveSettings.module.css";

const defaultEntries = [
  {
    deductForLateComing: true,
    deductionRules: ["First 10 min - No deduction", "After 30 min - 0.5 day"],
    linkOvertimeToPayroll: true,
  },
  {
    deductForLateComing: false,
    deductionRules: ["After 60 min - 1 day"],
    linkOvertimeToPayroll: false,
  },
];

const blankNewEntry = {
  deductForLateComing: false,
  deductionRules: [],
  linkOvertimeToPayroll: false,
};

const PayrollIntegration = () => {
  const [entries, setEntries] = useState(defaultEntries);
  const [editMode, setEditMode] = useState(false);
  const [newEntry, setNewEntry] = useState(blankNewEntry);
  const [backupEntries, setBackupEntries] = useState(null);

  // per-row temporary inputs for adding deduction rules: { [rowIndex]: currentValue }
  const [deductionRuleInputs, setDeductionRuleInputs] = useState({});
  // temporary input for newEntry's deduction rule
  const [newEntryDeductionInput, setNewEntryDeductionInput] = useState("");

  // Enter edit mode (keep backup)
  const handleEnterEdit = () => {
    setBackupEntries(JSON.parse(JSON.stringify(entries)));
    setEditMode(true);
  };

  // Cancel -> revert
  const handleCancel = () => {
    if (backupEntries) setEntries(backupEntries);
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setDeductionRuleInputs({});
    setNewEntryDeductionInput("");
    setEditMode(false);
  };

  // Save -> commit
  const handleSave = () => {
    setBackupEntries(null);
    setNewEntry(blankNewEntry);
    setDeductionRuleInputs({});
    setNewEntryDeductionInput("");
    setEditMode(false);
  };

  // Update field for existing row
  const updateField = (index, field, value) => {
    const copy = [...entries];
    copy[index] = { ...copy[index], [field]: value };
    setEntries(copy);
  };

  // Delete a row
  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Add row
  const handleAddEntry = () => {
    setEntries([...entries, newEntry]);
    setNewEntry(blankNewEntry);
    setNewEntryDeductionInput("");
  };

  // Deduction rules per-row: add
  const addDeductionRuleToRow = (index) => {
    const txt = (deductionRuleInputs[index] || "").trim();
    if (!txt) return;
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      deductionRules: Array.from(new Set([...(updated[index].deductionRules || []), txt])),
    };
    setEntries(updated);
    setDeductionRuleInputs((s) => ({ ...s, [index]: "" }));
  };

  // Deduction rules per-row: remove
  const removeDeductionRuleFromRow = (index, ruleIndex) => {
    const updated = [...entries];
    const arr = [...(updated[index].deductionRules || [])];
    arr.splice(ruleIndex, 1);
    updated[index].deductionRules = arr;
    setEntries(updated);
  };

  // New entry deduction rules helpers
  const addDeductionRuleToNewEntry = () => {
    const v = newEntryDeductionInput.trim();
    if (!v) return;
    setNewEntry((prev) => ({
      ...prev,
      deductionRules: Array.from(new Set([...(prev.deductionRules || []), v])),
    }));
    setNewEntryDeductionInput("");
  };
  const removeDeductionRuleFromNewEntry = (i) => {
    setNewEntry((prev) => {
      const arr = [...(prev.deductionRules || [])];
      arr.splice(i, 1);
      return { ...prev, deductionRules: arr };
    });
  };

  return (
    <>
      <h4 className={styles.title}>Payroll Integration</h4>

      <div className={styles.tableContainer}>
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Deduct for Late Coming</th>
              <th>Deduction Rules</th>
              <th>Link Overtime to Payroll</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {entries.map((row, idx) => (
              <tr key={idx} className={styles.row}>
                {/* Deduct for Late Coming (toggle) */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.deductForLateComing}
                        onChange={(e) => updateField(idx, "deductForLateComing", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.deductForLateComing ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.deductForLateComing ? "Yes" : "No"
                  )}
                </td>

                {/* Deduction Rules (chips + add) */}
                <td>
                  <div>
                    {(row.deductionRules || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        {row.deductionRules.map((r, i) => (
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
                                onClick={() => removeDeductionRuleFromRow(idx, i)}
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
                          placeholder="Add deduction rule (e.g. After 30 min - 0.5 day)"
                          value={deductionRuleInputs[idx] || ""}
                          onChange={(e) => setDeductionRuleInputs((s) => ({ ...s, [idx]: e.target.value }))}
                        />
                        <button className={styles.addBtn} type="button" onClick={() => addDeductionRuleToRow(idx)}>
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                {/* Link Overtime to Payroll (toggle) */}
                <td>
                  {editMode ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!row.linkOvertimeToPayroll}
                        onChange={(e) => updateField(idx, "linkOvertimeToPayroll", e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>{row.linkOvertimeToPayroll ? "Yes" : "No"}</span>
                    </label>
                  ) : (
                    row.linkOvertimeToPayroll ? "Yes" : "No"
                  )}
                </td>

                {editMode && (
                  <td className={styles.actionsCell}>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(idx)} title="Delete">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* New entry row */}
            {editMode && (
              <tr className={styles.newRow}>
                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.deductForLateComing}
                      onChange={(e) => setNewEntry({ ...newEntry, deductForLateComing: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.deductForLateComing ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td>
                  <div>
                    {(newEntry.deductionRules || []).length > 0 ? (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        {newEntry.deductionRules.map((r, i) => (
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
                              onClick={() => removeDeductionRuleFromNewEntry(i)}
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
                        placeholder="Add deduction rule"
                        value={newEntryDeductionInput}
                        onChange={(e) => setNewEntryDeductionInput(e.target.value)}
                      />
                      <button className={styles.addBtn} type="button" onClick={addDeductionRuleToNewEntry}>
                        Add
                      </button>
                    </div>
                  </div>
                </td>

                <td>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!newEntry.linkOvertimeToPayroll}
                      onChange={(e) => setNewEntry({ ...newEntry, linkOvertimeToPayroll: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>{newEntry.linkOvertimeToPayroll ? "Yes" : "No"}</span>
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

export default PayrollIntegration;

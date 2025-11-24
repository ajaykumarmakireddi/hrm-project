import React, { useState } from "react";
import styles from "../ShiftSettings.module.css";
import BootstrapSwitch from "@/utils/BootstrapSwitch";

const deviceTypes = [
  "Biometric Device",
  "RFID Scanner",
  "Mobile App",
  "Face Recognition System",
  "Web Punch"
];

const syncFrequencyOptions = [
  "Realtime",
  "5 min",
  "10 min",
  "Manual"
];

const dummyRows = [
  {
    enableSync: true,
    deviceType: "Biometric Device",
    syncFreq: "Realtime"
  },
  {
    enableSync: false,
    deviceType: "Mobile App",
    syncFreq: "5 min"
  },
  {
    enableSync: true,
    deviceType: "RFID Scanner",
    syncFreq: "10 min"
  },
  {
    enableSync: false,
    deviceType: "Face Recognition System",
    syncFreq: "Manual"
  }
];

const blankRow = {
  enableSync: false,
  deviceType: "",
  syncFreq: ""
};

const IntegrationsSettings = () => {
  const [rows, setRows] = useState(dummyRows);
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState(null);
  const [newRow, setNewRow] = useState(blankRow);

  // Enter edit mode
  const enterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(rows)));
    setEditMode(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    if (backupRows) setRows(backupRows);
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Save
  const save = () => {
    setBackupRows(null);
    setNewRow(blankRow);
    setEditMode(false);
  };

  // Update field
  const updateField = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  // Delete row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Add row
  const addRow = () => {
    if (!newRow.deviceType || !newRow.syncFreq) {
      alert("Please fill all fields.");
      return;
    }

    setRows([...rows, newRow]);
    setNewRow(blankRow);
  };

  return (
    <>
      <h4 className={styles.title}>Integrations Settings</h4>

      <div className="d-flex justify-content-center">
        <table className="square-table w-75">
          <thead>
            <tr>
              <th>Enable Device Sync</th>
              <th>Device Type</th>
              <th>Sync Frequency</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {/* Enable Device Sync */}
                <td>
                  {editMode ? (
                    <BootstrapSwitch
                      checked={row.enableSync}
                      setChecked={(val) => updateField(idx, "enableSync", val)}
                    />
                  ) : (
                    <BootstrapSwitch checked={row.enableSync} disabled />
                  )}
                </td>

                {/* Device Type */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.deviceType}
                      onChange={(e) =>
                        updateField(idx, "deviceType", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {deviceTypes.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.deviceType}</span>
                  )}
                </td>

                {/* Sync Frequency */}
                <td>
                  {editMode ? (
                    <select
                      className={`form-select ${styles.select}`}
                      value={row.syncFreq}
                      onChange={(e) =>
                        updateField(idx, "syncFreq", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {syncFrequencyOptions.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.syncFreq}</span>
                  )}
                </td>

                {/* Delete */}
                {editMode && (
                  <td className={styles.actionsCell}>
                    <button className={styles.deleteBtn} onClick={() => deleteRow(idx)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {/* Add New Row */}
            {editMode && (
              <tr>
                <td>
                  <BootstrapSwitch
                    checked={newRow.enableSync}
                    setChecked={(val) => setNewRow({ ...newRow, enableSync: val })}
                  />
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.deviceType}
                    onChange={(e) =>
                      setNewRow({ ...newRow, deviceType: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {deviceTypes.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <select
                    className={`form-select ${styles.select}`}
                    value={newRow.syncFreq}
                    onChange={(e) =>
                      setNewRow({ ...newRow, syncFreq: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {syncFrequencyOptions.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </td>

                <td className={styles.actionsCell}>
                  <button className={styles.addBtn} onClick={addRow}>
                    + Add
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Action Buttons */}
      <div className="d-flex justify-content-center p-3">
        {!editMode ? (
          <button className="submitbtn" onClick={enterEdit}>
            Edit
          </button>
        ) : (
          <>
            <button className="submitbtn" onClick={save}>Save</button>
            <button className="cancelbtn" onClick={cancelEdit}>Cancel</button>
          </>
        )}
      </div>
    </>
  );
};

export default IntegrationsSettings;

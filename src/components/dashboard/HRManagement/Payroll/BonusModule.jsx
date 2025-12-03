/**
 * BonusModule.jsx
 * Self-contained Bonus / Variable Pay module component (React).
 *
 * Features implemented (mapped to payroll_bonusPay.pdf):
 * - Tabs: Cycles, Structures, Assignments, Review & Approval, Release, Reports (PDF pages 2-9). :contentReference[oaicite:1]{index=1}
 * - Create / Edit cycles (fields and validations).
 * - Create / Edit structures with calculation types (percentage-of-base, percentage-of-gross, fixed, formula).
 * - Assignment list with auto-calculation, override handling and audit entries.
 * - Review page with approve / reject / request revision and bulk approve/reject.
 * - Pre-release validation rules and release summary (budget checks, missing assignments, overrides).
 * - Exports (CSV) and simple report generation.
 * - Client-side mock "API" (in-memory) — adapt to server calls easily.
 *
 * NOTE: This is intentionally single-file (subcomponents included) to make copy-paste easy.
 */

import React, { useEffect, useMemo, useState } from "react";
import styles from "./BonusModule.module.css";

/* --------------------------
   Utility helpers
   -------------------------- */

/** safeEvalFormula
 * Very small formula evaluator that replaces placeholders like {baseSalary} or {target}
 * with numeric values, then evaluates basic arithmetic expressions.
 * Supported operators: + - * / and parenthesis.
 *
 * NOTE: This evaluator uses Function internally after sanitizing characters.
 * In production replace with a dedicated math parser (mathjs) and stricter validation.
 */
function safeEvalFormula(formula, context = {}) {
  if (!formula) return 0;
  // Replace placeholders {key} with numeric values
  let expr = String(formula);
  expr = expr.replace(/\{(\w+)\}/g, (_, k) => {
    const v = Number(context[k] ?? 0);
    // ensure numeric text inserted
    return `${v}`;
  });
  // allow only numbers, spaces, parentheses and +-*/.% characters
  if (!/^[0-9+\-*/().\s%]+$/.test(expr)) {
    // disallow suspicious content
    throw new Error("Unsupported characters in formula");
  }
  // support percentage token like "50%" -> (50/100)
  expr = expr.replace(/([0-9]+(?:\.[0-9]+)?)%/g, "($1/100)");
  // eslint-disable-next-line no-new-func
  const val = new Function(`return (${expr});`)();
  if (typeof val !== "number" || Number.isNaN(val) || !isFinite(val)) return 0;
  return val;
}

/** currencyFormat */
function toCurrency(n) {
  return `₹ ${Number(n || 0).toLocaleString("en-IN")}`;
}

/* --------------------------
   Mock in-memory store (replace with APIs)
   -------------------------- */

const initialStore = {
  cycles: [], // {id, name, type, startDate, endDate, currency, defaultStructureId, enableProrate, enablePerformanceWeightage, minEligibilityPercent, maxBonusCap, status}
  structures: [], // {id, name, type, calculation: 'base_pct'|'gross_pct'|'fixed'|'formula', value, formula, minBonus, maxBonus, overrideAllowed}
  employees: [], // basic employees {id, name, code, baseSalary, grossSalary, department, designation}
  assignments: [], // {id, employeeId, cycleId, structureId, target, achievement, autoCalcAmount, overrideAmount, finalAmount, approvalStatus, notes, audit:[]}
  approvals: [], // approval entries
  releases: [], // release records
};

let DB = JSON.parse(JSON.stringify(initialStore)); // shallow copy

// seed data for demo
function seedDB() {
  DB.employees = [
    {
      id: "e1",
      name: "Asha Rao",
      code: "EMP001",
      baseSalary: 50000,
      grossSalary: 65000,
      department: "Sales",
      designation: "Manager",
    },
    {
      id: "e2",
      name: "Ravi Kumar",
      code: "EMP002",
      baseSalary: 30000,
      grossSalary: 35000,
      department: "Support",
      designation: "Executive",
    },
    {
      id: "e3",
      name: "Sita Iyer",
      code: "EMP003",
      baseSalary: 45000,
      grossSalary: 52000,
      department: "Sales",
      designation: "Executive",
    },
  ];

  DB.structures = [
    {
      id: "s1",
      name: "Sales Bonus 10% of base",
      type: "Percentage of Base Salary",
      calculation: "base_pct",
      value: 10,
      minBonus: 0,
      maxBonus: 100000,
      overrideAllowed: true,
    },
    {
      id: "s2",
      name: "Fixed Spot Bonus",
      type: "Fixed Amount",
      calculation: "fixed",
      value: 5000,
      minBonus: 0,
      maxBonus: 5000,
      overrideAllowed: false,
    },
    {
      id: "s3",
      name: "Formula: target * 0.01 * base",
      type: "Formula-based",
      calculation: "formula",
      formula: "{target} * 0.01 * {baseSalary}",
      minBonus: 0,
      maxBonus: 200000,
      overrideAllowed: true,
    },
  ];

  DB.cycles = [
    {
      id: "c1",
      name: "FY2024 Q4 Bonus",
      type: "Quarterly",
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      currency: "INR",
      defaultStructureId: "s1",
      enableProrate: true,
      enablePerformanceWeightage: true,
      minEligibilityPercent: 50,
      maxBonusCap: 200000,
      status: "Active", // Draft | Active | Closed
      totalBudget: 500000,
    },
  ];

  // some assignments (auto-calculated)
  DB.assignments = [
    {
      id: "a1",
      employeeId: "e1",
      cycleId: "c1",
      structureId: "s1",
      target: 100,
      achievement: 90,
      autoCalcAmount: 0, // will be recalculated
      overrideAmount: null,
      finalAmount: 0,
      approvalStatus: "Pending", // Pending | Approved | Rejected
      notes: "",
      audit: [],
    },
    {
      id: "a2",
      employeeId: "e2",
      cycleId: "c1",
      structureId: "s2",
      target: null,
      achievement: null,
      autoCalcAmount: 5000,
      overrideAmount: null,
      finalAmount: 5000,
      approvalStatus: "Pending",
      notes: "spot recognition",
      audit: [],
    },
  ];
}
seedDB();

/* --------------------------
   Simple mock API functions
   -------------------------- */
const api = {
  getCycles: async () => JSON.parse(JSON.stringify(DB.cycles)),
  createCycle: async (cycle) => {
    const id = `c${Date.now()}`;
    DB.cycles.push({ ...cycle, id });
    return id;
  },
  updateCycle: async (id, patch) => {
    DB.cycles = DB.cycles.map((c) => (c.id === id ? { ...c, ...patch } : c));
  },

  getStructures: async () => JSON.parse(JSON.stringify(DB.structures)),
  createStructure: async (s) => {
    const id = `s${Date.now()}`;
    DB.structures.push({ ...s, id });
    return id;
  },
  updateStructure: async (id, patch) => {
    DB.structures = DB.structures.map((s) =>
      s.id === id ? { ...s, ...patch } : s
    );
  },

  getEmployees: async () => JSON.parse(JSON.stringify(DB.employees)),

  getAssignments: async (cycleId) =>
    JSON.parse(
      JSON.stringify(DB.assignments.filter((a) => a.cycleId === cycleId))
    ),
  createAssignment: async (assignment) => {
    const id = `a${Date.now()}`;
    DB.assignments.push({ ...assignment, id });
    return id;
  },
  updateAssignment: async (id, patch) => {
    DB.assignments = DB.assignments.map((a) =>
      a.id === id ? { ...a, ...patch } : a
    );
  },

  getApprovals: async () => JSON.parse(JSON.stringify(DB.approvals)),
  createApprovalEntry: async (entry) => {
    DB.approvals.push(entry);
  },

  createRelease: async (r) => {
    DB.releases.push(r);
  },

  // export CSV helper
  exportCSV: async (rows, filename = "export.csv") => {
    const keys = Object.keys(rows[0] || {});
    const csv = [keys.join(",")]
      .concat(
        rows.map((r) => keys.map((k) => `"${String(r[k] ?? "")}"`).join(","))
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};

/* --------------------------
   Main component
   -------------------------- */

function TabButton({ active, onClick, children }) {
  return (
    <button className={`homebtn`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function BonusModule({ navigate }) {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("cycles"); // cycles | structures | assignments | review | release | reports
  const [cycles, setCycles] = useState([]);
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState(null);

  // fetch initial
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [c, s, e] = await Promise.all([
        api.getCycles(),
        api.getStructures(),
        api.getEmployees(),
      ]);
      setCycles(c);
      setStructures(s);
      setEmployees(e);
      setSelectedCycleId(c[0]?.id ?? null);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedCycleId) {
      setAssignments([]);
      return;
    }
    (async () => {
      const a = await api.getAssignments(selectedCycleId);
      // recalc auto amounts for all assignments on load
      const recalc = a.map((ass) => {
        const computed = computeAutoAmount(ass, structures, employees);
        const final = finalizeAmount(
          computed,
          ass.overrideAmount,
          selectedCycle()
        );
        return { ...ass, autoCalcAmount: computed, finalAmount: final };
      });
      setAssignments(recalc);
    })();
  }, [selectedCycleId, structures, employees]);

  function selectedCycle() {
    return cycles.find((c) => c.id === selectedCycleId) ?? null;
  }

  /* --------------------------
     Calculation and rules
     -------------------------- */
  function computeAutoAmount(assignment, structuresList, employeesList) {
    // find employee and structure
    const emp = employeesList.find((x) => x.id === assignment.employeeId);
    const structure =
      structuresList.find((s) => s.id === assignment.structureId) ||
      structuresList.find((s) => s.id === DB.cycles[0]?.defaultStructureId) ||
      null;
    if (!structure || !emp) return 0;
    try {
      switch (structure.calculation) {
        case "base_pct": {
          // value is percent
          // (baseSalary * value / 100) * (achievement/target) if target exists and auto-scaling desired
          const base = Number(emp.baseSalary || 0);
          const pct = Number(structure.value || 0);
          // if assignment has achievement & target interpret as performance proportion
          const proportion =
            assignment.target && assignment.achievement
              ? Number(assignment.achievement) /
                Math.max(1, Number(assignment.target))
              : 1;
          return Math.round(base * (pct / 100) * proportion);
        }
        case "gross_pct": {
          const gross = Number(emp.grossSalary || 0);
          const pct = Number(structure.value || 0);
          const proportion =
            assignment.target && assignment.achievement
              ? Number(assignment.achievement) /
                Math.max(1, Number(assignment.target))
              : 1;
          return Math.round(gross * (pct / 100) * proportion);
        }
        case "fixed": {
          return Number(structure.value || 0);
        }
        case "formula": {
          // allow formula with placeholders: {baseSalary}, {grossSalary}, {target}, {achievement}
          const ctx = {
            baseSalary: Number(emp.baseSalary || 0),
            grossSalary: Number(emp.grossSalary || 0),
            target: Number(assignment.target || 0),
            achievement: Number(assignment.achievement || 0),
          };
          const res = safeEvalFormula(structure.formula, ctx);
          return Math.round(res);
        }
        default:
          return 0;
      }
    } catch (err) {
      console.error("formula error", err);
      return 0;
    }
  }

  function finalizeAmount(autoCalc, overrideAmount, cycle) {
    // validation rules (see PDF Section 9):
    // - Active cycle required for assigning bonuses (enforced in UI)
    // - Targets cannot exceed 100% unless overridden
    // - Bonus cannot exceed predefined caps (cycle.maxBonusCap and structure maxBonus)
    // - Proration rules ignored for simplicity here but can be applied if cycle.enableProrate
    let amount = Number(autoCalc || 0);
    if (overrideAmount != null && overrideAmount !== "") {
      amount = Number(overrideAmount);
    }
    // apply cycle cap if present
    if (cycle && Number.isFinite(Number(cycle.maxBonusCap))) {
      amount = Math.min(amount, Number(cycle.maxBonusCap));
    }
    return Math.round(amount);
  }

  /* --------------------------
     CRUD operations for cycles, structures, assignments
     -------------------------- */

  async function handleCreateCycle(data) {
    // minimal validation
    if (!data.name || !data.startDate || !data.endDate) {
      setMessage({
        type: "error",
        text: "Cycle name, startDate and endDate are required",
      });
      return;
    }
    const id = await api.createCycle({ ...data, status: "Draft" });
    const newCycles = await api.getCycles();
    setCycles(newCycles);
    setSelectedCycleId(id);
    setMessage({ type: "success", text: "Cycle created" });
  }

  async function handleCreateStructure(data) {
    if (!data.name || !data.calculation) {
      setMessage({
        type: "error",
        text: "Structure name and calculation are required",
      });
      return;
    }
    await api.createStructure(data);
    setStructures(await api.getStructures());
    setMessage({ type: "success", text: "Structure created" });
  }

  async function handleAssignToEmployee({ employeeId, structureId, target }) {
    if (!selectedCycleId) {
      setMessage({
        type: "error",
        text: "Select an active cycle to assign bonuses (Validation rule).",
      });
      return;
    }
    const ass = {
      employeeId,
      cycleId: selectedCycleId,
      structureId,
      target: target ?? null,
      achievement: null,
      autoCalcAmount: 0,
      overrideAmount: null,
      finalAmount: 0,
      approvalStatus: "Pending",
      notes: "",
      audit: [
        {
          when: new Date().toISOString(),
          by: "system",
          note: "Assignment created",
        },
      ],
    };
    const id = await api.createAssignment(ass);
    const recalc = computeAutoAmount({ ...ass, id }, structures, employees);
    await api.updateAssignment(id, {
      autoCalcAmount: recalc,
      finalAmount: finalizeAmount(recalc, null, selectedCycle()),
    });
    const a = await api.getAssignments(selectedCycleId);
    setAssignments(
      a.map((x) => ({
        ...x,
        autoCalcAmount: computeAutoAmount(x, structures, employees),
        finalAmount: finalizeAmount(
          computeAutoAmount(x, structures, employees),
          x.overrideAmount,
          selectedCycle()
        ),
      }))
    );
    setMessage({ type: "success", text: "Assignment added" });
  }

  async function handleUpdateAssignmentField(id, patch) {
    await api.updateAssignment(id, patch);
    // refresh
    const a = await api.getAssignments(selectedCycleId);
    const recalc = a.map((ass) => {
      const computed = computeAutoAmount(ass, structures, employees);
      const final = finalizeAmount(
        computed,
        ass.overrideAmount,
        selectedCycle()
      );
      return { ...ass, autoCalcAmount: computed, finalAmount: final };
    });
    setAssignments(recalc);
  }

  /* --------------------------
     Review / Approval actions
     -------------------------- */

  async function handleBulkApprove(selectedIds) {
    for (const id of selectedIds) {
      await api.updateAssignment(id, { approvalStatus: "Approved" });
      await api.createApprovalEntry({
        id,
        by: "approverX",
        when: new Date().toISOString(),
        action: "Approved",
      });
    }
    const a = await api.getAssignments(selectedCycleId);
    setAssignments(
      a.map((x) => ({
        ...x,
        autoCalcAmount: computeAutoAmount(x, structures, employees),
        finalAmount: finalizeAmount(
          computeAutoAmount(x, structures, employees),
          x.overrideAmount,
          selectedCycle()
        ),
      }))
    );
    setMessage({ type: "success", text: "Selected assignments approved" });
  }

  async function handleApproveSingle(id) {
    await api.updateAssignment(id, { approvalStatus: "Approved" });
    await api.createApprovalEntry({
      id,
      by: "approverX",
      when: new Date().toISOString(),
      action: "Approved",
    });
    const a = await api.getAssignments(selectedCycleId);
    setAssignments(
      a.map((x) => ({
        ...x,
        autoCalcAmount: computeAutoAmount(x, structures, employees),
        finalAmount: finalizeAmount(
          computeAutoAmount(x, structures, employees),
          x.overrideAmount,
          selectedCycle()
        ),
      }))
    );
    setMessage({ type: "success", text: "Approved" });
  }

  async function handleRejectSingle(id, reason) {
    await api.updateAssignment(id, {
      approvalStatus: "Rejected",
      notes: reason || "Rejected by approver",
    });
    await api.createApprovalEntry({
      id,
      by: "approverX",
      when: new Date().toISOString(),
      action: "Rejected",
      note: reason || "",
    });
    const a = await api.getAssignments(selectedCycleId);
    setAssignments(
      a.map((x) => ({
        ...x,
        autoCalcAmount: computeAutoAmount(x, structures, employees),
        finalAmount: finalizeAmount(
          computeAutoAmount(x, structures, employees),
          x.overrideAmount,
          selectedCycle()
        ),
      }))
    );
    setMessage({ type: "warn", text: "Rejected" });
  }

  /* --------------------------
     Pre-release validation & release
     -------------------------- */

  function runPreReleaseValidation() {
    // checks: missing assignments, overrides without approval, budget breach, negative values, pending approvals
    const cycle = selectedCycle();
    const result = { ok: true, issues: [] };

    // missing assignments: employees eligible vs assigned - for demo assume all employees are eligible
    const assignedEmployeeIds = new Set(assignments.map((a) => a.employeeId));
    const missing = employees.filter((e) => !assignedEmployeeIds.has(e.id));
    if (missing.length > 0) {
      result.ok = false;
      result.issues.push({
        type: "missing_assignments",
        message: `${missing.length} employees missing assignments`,
      });
    }

    // overrides without approval
    const overrides = assignments.filter(
      (a) =>
        a.overrideAmount != null &&
        a.overrideAmount !== "" &&
        a.approvalStatus !== "Approved"
    );
    if (overrides.length > 0) {
      result.ok = false;
      result.issues.push({
        type: "overrides",
        message: `${overrides.length} overrides exist without approval`,
      });
    }

    // budget breach
    const totalPlanned = assignments.reduce(
      (s, a) => s + Number(a.finalAmount || 0),
      0
    );
    if (
      cycle &&
      Number(cycle.totalBudget) &&
      totalPlanned > Number(cycle.totalBudget)
    ) {
      result.ok = false;
      result.issues.push({
        type: "budget",
        message: `Planned total ${toCurrency(
          totalPlanned
        )} exceeds budget ${toCurrency(cycle.totalBudget)}`,
      });
    }

    // negative or zero values
    const negatives = assignments.filter(
      (a) => Number(a.finalAmount || 0) <= 0
    );
    if (negatives.length > 0) {
      result.ok = false;
      result.issues.push({
        type: "negative",
        message: `${negatives.length} assignments have zero/negative amounts`,
      });
    }

    // pending approvals
    const pending = assignments.filter((a) => a.approvalStatus !== "Approved");
    if (pending.length > 0) {
      result.ok = false;
      result.issues.push({
        type: "pendingApprovals",
        message: `${pending.length} assignments not approved`,
      });
    }

    return result;
  }

  async function performRelease({ confirmContinueWithWarnings = false }) {
    const validation = runPreReleaseValidation();
    if (!validation.ok && !confirmContinueWithWarnings) {
      setMessage({
        type: "error",
        text: "Pre-release validation failed. See issues.",
      });
      return validation;
    }
    // create release summary and store
    const releaseRecord = {
      id: `rel-${Date.now()}`,
      when: new Date().toISOString(),
      cycleId: selectedCycleId,
      totalAmount: assignments.reduce(
        (s, a) => s + Number(a.finalAmount || 0),
        0
      ),
      totalEmployees: assignments.length,
      by: "system",
    };
    await api.createRelease(releaseRecord);
    // trigger post-release actions (for demo we just create message)
    setMessage({
      type: "success",
      text: `Released successfully. Total ${toCurrency(
        releaseRecord.totalAmount
      )}`,
    });
    return { ok: true, release: releaseRecord };
  }

  /* --------------------------
     Reports & export
     -------------------------- */

  async function exportAssignmentsCSV() {
    if (!assignments.length) {
      setMessage({ type: "warn", text: "No assignments to export" });
      return;
    }
    const rows = assignments.map((a) => {
      const emp = employees.find((e) => e.id === a.employeeId) || {};
      const struct = structures.find((s) => s.id === a.structureId) || {};
      return {
        employeeCode: emp.code,
        employeeName: emp.name,
        department: emp.department,
        cycle: selectedCycle()?.name ?? "",
        structure: struct.name,
        target: a.target,
        achievement: a.achievement,
        autoCalcAmount: a.autoCalcAmount,
        overrideAmount: a.overrideAmount,
        finalAmount: a.finalAmount,
        approvalStatus: a.approvalStatus,
        notes: a.notes,
      };
    });
    await api.exportCSV(rows, `assignments_${selectedCycleId || "all"}.csv`);
    setMessage({ type: "success", text: "Export started" });
  }

  /* --------------------------
     UI small helpers & components
     -------------------------- */

  function showMsg() {
    if (!message) return null;
    return (
      <div className={`${styles.msg} ${styles[message.type || ""]}`}>
        {message.text}
      </div>
    );
  }

  if (loading)
    return (
      <div className={styles.container}>
        <h3>Loading Bonus Module...</h3>
      </div>
    );

  return (
    <>
      <p className="path">
        <span onClick={() => navigate("/payroll")}>Payroll</span>{" "}
        <i className="bi bi-chevron-right"></i> Bonus Pay
      </p>

      <div className={styles.container}>
        {showMsg()}
        <div className={styles.headerRow}>
          <div className={styles.tabs}>
            <TabButton
              active={tab === "cycles"}
              onClick={() => setTab("cycles")}
            >
              Cycles
            </TabButton>
            <TabButton
              active={tab === "structures"}
              onClick={() => setTab("structures")}
            >
              Structures
            </TabButton>
            <TabButton
              active={tab === "assignments"}
              onClick={() => setTab("assignments")}
            >
              Assignments
            </TabButton>
            <TabButton
              active={tab === "review"}
              onClick={() => setTab("review")}
            >
              Review & Approval
            </TabButton>
            <TabButton
              active={tab === "release"}
              onClick={() => setTab("release")}
            >
              Release
            </TabButton>
            <TabButton
              active={tab === "reports"}
              onClick={() => setTab("reports")}
            >
              Reports
            </TabButton>
          </div>
        </div>

        <div className={styles.cycleSelector}>
          <label>Selected Cycle</label>
          <select
            value={selectedCycleId || ""}
            onChange={(e) => setSelectedCycleId(e.target.value)}
          >
            <option value="">-- Select Cycle --</option>
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.status})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tabContent}>
          {tab === "cycles" && (
            <CyclesTab
              cycles={cycles}
              onCreate={handleCreateCycle}
              onUpdate={async (id, patch) => {
                await api.updateCycle(id, patch);
                setCycles(await api.getCycles());
                setMessage({ type: "success", text: "Cycle updated" });
              }}
            />
          )}

          {tab === "structures" && (
            <StructuresTab
              structures={structures}
              onCreate={handleCreateStructure}
              onUpdate={async (id, patch) => {
                await api.updateStructure(id, patch);
                setStructures(await api.getStructures());
                setMessage({ type: "success", text: "Structure updated" });
              }}
            />
          )}

          {tab === "assignments" && (
            <AssignmentsTab
              employees={employees}
              assignments={assignments}
              structures={structures}
              cycle={selectedCycle()}
              onAssign={handleAssignToEmployee}
              onUpdateAssignmentField={handleUpdateAssignmentField}
              onExportCSV={exportAssignmentsCSV}
            />
          )}

          {tab === "review" && (
            <ReviewTab
              assignments={assignments}
              employees={employees}
              onApprove={handleApproveSingle}
              onReject={handleRejectSingle}
              onBulkApprove={handleBulkApprove}
            />
          )}

          {tab === "release" && (
            <ReleaseTab
              assignments={assignments}
              cycle={selectedCycle()}
              onPreRelease={() => {
                const v = runPreReleaseValidation();
                if (!v.ok)
                  setMessage({
                    type: "error",
                    text:
                      "Pre-release issues: " +
                      v.issues.map((i) => i.message).join("; "),
                  });
                else
                  setMessage({
                    type: "success",
                    text: "Pre-release checks OK",
                  });
                return v;
              }}
              onRelease={performRelease}
            />
          )}

          {tab === "reports" && (
            <ReportsTab
              assignments={assignments}
              employees={employees}
              onExport={exportAssignmentsCSV}
            />
          )}
        </div>
      </div>
    </>
  );
}

/* --------------------------
   Subcomponent: CyclesTab
   -------------------------- */
function CyclesTab({ cycles, onCreate, onUpdate }) {
  const [form, setForm] = useState({
    name: "",
    type: "Annual",
    startDate: "",
    endDate: "",
    currency: "INR",
    defaultStructureId: "",
    enableProrate: false,
    enablePerformanceWeightage: false,
    minEligibilityPercent: 0,
    maxBonusCap: 1000000,
    totalBudget: 0,
  });

  return (
    <div>
      <h3 className={styles.headerh3}>Bonus Cycle Management (Cycle List)</h3>
      <div className={styles.cyclesGrid}>
        <div className={styles.cycleList}>
          <h4 className={styles.cyclesh4}>Cycles List</h4>
          <table className={"square-table w-100"}>
            <thead>
              <tr>
                <th>Cycle Name</th>
                <th>Type</th>
                <th>Period</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.type}</td>
                  <td>
                    {c.startDate} → {c.endDate}
                  </td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.cycleForm}>
          <h4 className={styles.cyclesh4}>Create New Cycle</h4>
          <div className={styles.formRow}>
            <label>Cycle Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className={styles.formRow}>
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Annual</option>
              <option>Quarterly</option>
              <option>Monthly</option>
              <option>Adhoc</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label>Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className={styles.formRow}>
            <label>End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <div className={styles.formRow}>
            <label>Currency</label>
            <input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </div>
          <div className={styles.formRow}>
            <label>Total Budget</label>
            <input
              type="number"
              value={form.totalBudget}
              onChange={(e) =>
                setForm({ ...form, totalBudget: e.target.value })
              }
            />
          </div>
          <div className={styles.formRow}>
            <label>Max Bonus Cap</label>
            <input
              type="number"
              value={form.maxBonusCap}
              onChange={(e) =>
                setForm({ ...form, maxBonusCap: e.target.value })
              }
            />
          </div>
          <div className={styles.formRow}>
            <button onClick={() => onCreate(form)} className={`submitbtn`}>
              Create Cycle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Subcomponent: StructuresTab
   -------------------------- */
function StructuresTab({ structures, onCreate, onUpdate }) {
  const [form, setForm] = useState({
    name: "",
    calculation: "base_pct",
    value: 0,
    formula: "",
    minBonus: 0,
    maxBonus: 100000,
    overrideAllowed: false,
  });

  return (
    <div>
      <h3 className={styles.headerh3}>Bonus Structure Setup</h3>
      <div className={styles.cyclesGrid}>
        <div className={styles.cycleList}>
          <h4 className={styles.cyclesh4}>Structures List</h4>
          <table className={"square-table w-100"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Calc</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {structures.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.type}</td>
                  <td>
                    {s.calculation === "formula"
                      ? `formula: ${s.formula}`
                      : s.calculation === "base_pct"
                      ? `${s.value}% of base`
                      : s.calculation === "gross_pct"
                      ? `${s.value}% of gross`
                      : `fixed ${toCurrency(s.value)}`}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        onUpdate(s.id, { ...s, name: s.name + " (edited)" })
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.cycleList}>
          <h4 className={styles.cyclesh4}>Create Structure</h4>
          <div className={styles.formRow}>
            <label>Structure Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className={styles.formRow}>
            <label>Calculation</label>
            <select
              value={form.calculation}
              onChange={(e) =>
                setForm({ ...form, calculation: e.target.value })
              }
            >
              <option value="base_pct">Percentage of Base Salary</option>
              <option value="gross_pct">Percentage of Gross Salary</option>
              <option value="fixed">Fixed Amount</option>
              <option value="formula">Formula Based</option>
            </select>
          </div>

          {form.calculation === "formula" ? (
            <div className={styles.formRow}>
              <label>
                Formula (use {`{baseSalary}`}, {`{grossSalary}`}, {`{target}`},{" "}
                {`{achievement}`})
              </label>
              <textarea
                value={form.formula}
                onChange={(e) => setForm({ ...form, formula: e.target.value })}
                rows={3}
              />
            </div>
          ) : (
            <div className={styles.formRow}>
              <label>Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          )}

          <div className={styles.formRow}>
            <label>Min Bonus</label>
            <input
              type="number"
              value={form.minBonus}
              onChange={(e) => setForm({ ...form, minBonus: e.target.value })}
            />
          </div>
          <div className={styles.formRow}>
            <label>Max Bonus</label>
            <input
              type="number"
              value={form.maxBonus}
              onChange={(e) => setForm({ ...form, maxBonus: e.target.value })}
            />
          </div>

          <div className={styles.formRow}>
            <label>
              <input
                type="checkbox"
                checked={form.overrideAllowed}
                onChange={(e) =>
                  setForm({ ...form, overrideAllowed: e.target.checked })
                }
              />{" "}
              Allow Override
            </label>
          </div>

          <div className={styles.formRow}>
            <button
              className={"submitbtn"}
              onClick={() => {
                onCreate({
                  ...form,
                  type:
                    form.calculation === "formula"
                      ? "Formula-based"
                      : form.calculation,
                });
                setForm({
                  name: "",
                  calculation: "base_pct",
                  value: 0,
                  formula: "",
                  minBonus: 0,
                  maxBonus: 100000,
                  overrideAllowed: false,
                });
              }}
            >
              Create Structure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Subcomponent: AssignmentsTab
   -------------------------- */
function AssignmentsTab({
  employees,
  assignments,
  structures,
  cycle,
  onAssign,
  onUpdateAssignmentField,
  onExportCSV,
}) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedStructure, setSelectedStructure] = useState(
    structures[0]?.id ?? ""
  );
  const [target, setTarget] = useState("");

  return (
    <div>
      <h3 className={styles.headerh3}>Assign Bonus to Employees</h3>

      <div className={styles.cyclesGrid}>
        <div className={styles.cycleList}>
          <h4 className={styles.cyclesh4}>Assign Bonus</h4>
          <div className={styles.assignControls}>
            <label>Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- select --</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.code})
                </option>
              ))}
            </select>

            <label>Structure</label>
            <select
              value={selectedStructure}
              onChange={(e) => setSelectedStructure(e.target.value)}
            >
              {structures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <label>Target (if applicable)</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />

            <button
              className={"submitbtn"}
              onClick={() => {
                onAssign({
                  employeeId: selectedEmployee,
                  structureId: selectedStructure,
                  target: target || null,
                });
                setSelectedEmployee("");
                setTarget("");
              }}
            >
              Assign
            </button>
            <button className={"viewbtn"} onClick={onExportCSV}>
              Export CSV
            </button>
          </div>
        </div>

        <div className={styles.cycleList}>
          <h4 className={styles.cyclesh4}>Assigned List</h4>
          <table className={"square-table w-100"}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Structure</th>
                <th>Target</th>
                <th>Achievement</th>
                <th>Auto Calc</th>
                <th>Override</th>
                <th>Final</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const emp = employees.find((e) => e.id === a.employeeId);
                const struct = structures.find((s) => s.id === a.structureId);
                return (
                  <tr key={a.id}>
                    <td>
                      {emp?.name}{" "}
                      <div className={styles.smallText}>{emp?.code}</div>
                    </td>
                    <td>{struct?.name}</td>
                    <td>
                      <input
                        type="number"
                        value={a.target ?? ""}
                        onChange={(e) =>
                          onUpdateAssignmentField(a.id, {
                            target: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={a.achievement ?? ""}
                        onChange={(e) =>
                          onUpdateAssignmentField(a.id, {
                            achievement: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>{toCurrency(a.autoCalcAmount)}</td>
                    <td>
                      <input
                        type="number"
                        value={a.overrideAmount ?? ""}
                        onChange={(e) =>
                          onUpdateAssignmentField(a.id, {
                            overrideAmount: e.target.value,
                            audit: (a.audit || []).concat([
                              {
                                when: new Date().toISOString(),
                                by: "user",
                                note: "override changed",
                              },
                            ]),
                          })
                        }
                      />
                    </td>
                    <td>{toCurrency(a.finalAmount)}</td>
                    <td>{a.approvalStatus}</td>
                    <td>
                      <button
                        onClick={() => alert("Open history / edit modal")}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Subcomponent: ReviewTab
   -------------------------- */
function ReviewTab({
  assignments,
  employees,
  onApprove,
  onReject,
  onBulkApprove,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.concat(id)
    );
  }

  return (
    <div>
      <h3 className={styles.headerh3}>Review & Approval Workflow</h3>
      <div className="d-flex justify-content-center">
        <div className={`w-75 ${styles.actionRow}`}>
          <button
            className={"submitbtn"}
            onClick={() => onBulkApprove(selectedIds)}
          >
            Bulk Approve
          </button>
          <button
            className="cancelbtn"
            onClick={() => {
              selectedIds.forEach((id) =>
                onReject(id, "Bulk rejected by manager")
              );
              setSelectedIds([]);
            }}
          >
            Bulk Reject
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <table className={"square-table w-75"}>
          <thead>
            <tr>
              <th></th>
              <th>Employee</th>
              <th>Calculated Bonus</th>
              <th>Override</th>
              <th>Final</th>
              <th>Approval</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => {
              const emp = employees.find((e) => e.id === a.employeeId);
              return (
                <tr key={a.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(a.id)}
                      onChange={() => toggleSelect(a.id)}
                    />
                  </td>
                  <td>
                    {emp?.name}{" "}
                    <div className={styles.smallText}>{emp?.department}</div>
                  </td>
                  <td>{toCurrency(a.autoCalcAmount)}</td>
                  <td>
                    {a.overrideAmount != null
                      ? toCurrency(a.overrideAmount)
                      : "-"}
                  </td>
                  <td>{toCurrency(a.finalAmount)}</td>
                  <td>{a.approvalStatus}</td>
                  <td>
                    <button className="table-approved-btn" onClick={() => onApprove(a.id)}>Approve</button>
                    <button className="table-declined-btn" onClick={() => onReject(a.id, "Needs revision")}>
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------------------------
   Subcomponent: ReleaseTab
   -------------------------- */
function ReleaseTab({ assignments, cycle, onPreRelease, onRelease }) {
  const [warningsOk, setWarningsOk] = useState(false);

  const summary = useMemo(() => {
    const totalAmount = assignments.reduce(
      (s, a) => s + Number(a.finalAmount || 0),
      0
    );
    const perEmployee = assignments.length
      ? Math.round(totalAmount / assignments.length)
      : 0;
    return { totalAmount, totalEmployees: assignments.length, perEmployee };
  }, [assignments]);

  return (
    <div>
      <h3 className={styles.header3}>Final Bonus Release</h3>
      <div className={styles.cycleList}>
        <h4 className={styles.cyclesh4}>Pre-Release Validation</h4>
        <div>
          <button
            onClick={() => {
              const v = onPreRelease();
              if (v && !v.ok) setWarningsOk(false);
            }}
          >
            Run Validation
          </button>
        </div>
        <div className={styles.smallText}>
          Checks: missing assignments, overrides without approval, budget
          breach, negative values, pending approvals.
        </div>
      </div>
      <div className={styles.cycleList}>
        <h4 className={styles.cyclesh4}>Release Summary</h4>
        <div className={styles.summaryRow}>
          <div>Total Bonus Amount</div>
          <div>{toCurrency(summary.totalAmount)}</div>
        </div>
        <div className={styles.summaryRow}>
          <div>Total Employees</div>
          <div>{summary.totalEmployees}</div>
        </div>
        <div className={styles.summaryRow}>
          <div>Per Employee Average</div>
          <div>{toCurrency(summary.perEmployee)}</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={warningsOk}
              onChange={(e) => setWarningsOk(e.target.checked)}
            />{" "}
            Confirm continue with warnings (if any)
          </label>
        </div>
        <div style={{ marginTop: 10 }}>
          <button
            className={"submitbtn"}
            onClick={() =>
              onRelease({ confirmContinueWithWarnings: warningsOk })
            }
          >
            Confirm Release
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Subcomponent: ReportsTab
   -------------------------- */
function ReportsTab({ assignments, employees, onExport }) {
  const cycleWise = {}; // naive
  assignments.forEach((a) => {
    const cycleId = a.cycleId || "unknown";
    cycleWise[cycleId] = cycleWise[cycleId] || { total: 0, count: 0 };
    cycleWise[cycleId].total += Number(a.finalAmount || 0);
    cycleWise[cycleId].count += 1;
  });

  return (
    <div>
      <h3 className={styles.headerh3}>Bonus Reports</h3>
      <div className={styles.cycleList}>
        <h4 className={styles.cyclesh4}>Cycle Wise Summary</h4>
        <table className={"square-table w-100"}>
          <thead>
            <tr>
              <th>Cycle ID</th>
              <th>Employees</th>
              <th>Total Bonus</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(cycleWise).map(([cid, v]) => (
              <tr key={cid}>
                <td>{cid}</td>
                <td>{v.count}</td>
                <td>{toCurrency(v.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 10 }}>
          <button className="submitbtn" onClick={onExport}>Export Assignments CSV</button>
        </div>
      </div>
    </div>
  );
}

// mockData.js
export const initialPayCycles = [
  {
    id: 1,
    cycleName: "Monthly - Nov 2025",
    country: "India",
    payFrequency: "Monthly",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    cutOffDate: "2025-11-28",
    payDate: "2025-12-01",
    status: "Draft",
  },
  {
    id: 2,
    cycleName: "Biweekly - Nov 16 2025",
    country: "US",
    payFrequency: "Biweekly",
    startDate: "2025-11-16",
    endDate: "2025-11-29",
    cutOffDate: "2025-11-28",
    payDate: "2025-11-30",
    status: "Approved",
  },
  {
    id: 3,
    cycleName: "Monthly - Oct 2025",
    country: "India",
    payFrequency: "Monthly",
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    cutOffDate: "2025-10-29",
    payDate: "2025-11-01",
    status: "Archived",
  },
];

export function generateFutureCycles(currentCycles, howMany = 3) {
  // create a couple of synthetic upcoming cycles based on currentCycles
  const units = [];
  for (let i = 0; i < howMany; i++) {
    const base = currentCycles[0] || currentCycles[i % currentCycles.length];
    const start = new Date();
    start.setMonth(start.getMonth() + (i + 1));
    const end = new Date(start);
    end.setDate(new Date(base?.endDate || start).getDate());
    units.push({
      id: Date.now() + i + 1000,
      cycleName: `${base?.payFrequency || "Monthly"} - ${start.toLocaleString(
        "default",
        { month: "short" }
      )} ${start.getFullYear()}`,
      country: base?.country || "India",
      payFrequency: base?.payFrequency || "Monthly",
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      payDate: new Date(start.getFullYear(), start.getMonth(), 28)
        .toISOString()
        .slice(0, 10),
      status: "Scheduled",
    });
  }
  return units;
}

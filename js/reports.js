const REPORT_DEFINITIONS = [
  ["Linux Servers", (record) => /rocky|rhel/i.test(record.operatingSystem)],
  ["Oracle Servers", (record) => /oracle linux/i.test(record.operatingSystem)],
  ["AIX Servers", (record) => /^aix/i.test(record.operatingSystem)],
  ["PROD Servers", (record) => record.environment === "PROD"],
  ["UAT Servers", (record) => record.environment === "UAT"],
  ["Cloud Servers", (record) => record.hosting === "Cloud"]
];

window.addEventListener("eiop:data-ready", ({ detail: records }) => {
  const summary = REPORT_DEFINITIONS.map(([label, predicate]) => ({
    label,
    count: records.filter(predicate).length
  }));

  document.querySelectorAll("[data-report]").forEach((element) => {
    const item = summary.find(({ label }) => label === element.dataset.report);
    if (item) element.textContent = item.count;
  });

  const table = document.getElementById("reportSummaryBody");
  if (table) {
    table.innerHTML = summary.map((item) => `
      <tr>
        <td>${item.label}</td>
        <td>${item.count}</td>
        <td>${Math.round((item.count / records.length) * 100)}%</td>
        <td><div class="report-bar"><span style="width:${(item.count / records.length) * 100}%"></span></div></td>
      </tr>
    `).join("");
  }

  document.getElementById("exportReport")?.addEventListener("click", () => exportCsv(summary, records.length));
});

function exportCsv(summary, total) {
  const rows = [
    ["Report", "Server Count", "Percentage", "Generated"],
    ...summary.map((item) => [item.label, item.count, `${((item.count / total) * 100).toFixed(1)}%`, new Date().toISOString()])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `eiop-infrastructure-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  window.EIOP.showToast("Report exported", "The infrastructure summary was downloaded as CSV.");
}

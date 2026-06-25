const DASHBOARD_STATUS_LABELS = ["Running", "Maintenance", "Patching", "Powered Off", "Cloud", "Decommissioned"];
const DASHBOARD_STATUS_COLORS = ["#3ccf91", "#e9a654", "#9f86ff", "#ef6b73", "#4cc9d8", "#8391a7"];

window.addEventListener("eiop:data-ready", ({ detail: records }) => {
  const statusCounts = Object.fromEntries(DASHBOARD_STATUS_LABELS.map((status) => [
    status,
    records.filter((record) => record.status === status).length
  ]));

  const values = {
    total: records.length,
    running: statusCounts.Running,
    powered: statusCounts["Powered Off"],
    maintenance: statusCounts.Maintenance,
    patching: statusCounts.Patching,
    cloud: records.filter((record) => record.hosting === "Cloud" || record.status === "Cloud").length,
    decommissioned: statusCounts.Decommissioned
  };

  Object.entries(values).forEach(([key, value]) => {
    const element = document.querySelector(`[data-kpi="${key}"]`);
    if (element) animateCount(element, value);
  });

  window.EIOP.charts.create(
    "statusChart",
    "doughnut",
    DASHBOARD_STATUS_LABELS,
    DASHBOARD_STATUS_LABELS.map((label) => statusCounts[label]),
    DASHBOARD_STATUS_COLORS
  );

  const environments = ["DEV", "TEST", "UAT", "PROD"];
  window.EIOP.charts.create(
    "environmentChart",
    "bar",
    environments,
    environments.map((label) => records.filter((record) => record.environment === label).length),
    ["#668fda", "#5c91ed", "#4cc9d8", "#3ccf91"],
    { legend: false, borderRadius: 6 }
  );

  const osLabels = ["Rocky Linux", "RHEL", "Oracle Linux", "AIX"];
  window.EIOP.charts.create(
    "osChart",
    "bar",
    osLabels,
    osLabels.map((label) => records.filter((record) => record.operatingSystem.toLowerCase().startsWith(label.toLowerCase())).length),
    ["#5c91ed", "#3ccf91", "#e9a654", "#9f86ff"],
    { legend: false, borderRadius: 6 }
  );

  renderActivity(records);
});

function animateCount(element, target) {
  const duration = 650;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderActivity(records) {
  const container = document.getElementById("activityList");
  if (!container) return;
  const priority = ["Maintenance", "Patching", "Powered Off", "Decommissioned", "Cloud"];
  const colors = {
    Maintenance: "#e9a654",
    Patching: "#9f86ff",
    "Powered Off": "#ef6b73",
    Decommissioned: "#8391a7",
    Cloud: "#4cc9d8"
  };
  const items = records
    .filter((record) => priority.includes(record.status))
    .slice(0, 6);

  container.innerHTML = items.map((record) => `
    <div class="activity-item">
      <span class="activity-indicator" style="--activity-color:${colors[record.status]}"></span>
      <div class="activity-copy">
        <strong>${record.hostname}</strong>
        <span>${record.status} · ${record.application}</span>
      </div>
      <span class="activity-time">${record.environment}</span>
    </div>
  `).join("");
}

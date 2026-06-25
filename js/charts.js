class EnterpriseCharts {
  constructor() {
    this.instances = [];
  }

  create(canvasId, type, labels, values, colors, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;
    const chart = new Chart(canvas, {
      type,
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: options.borderColors || colors,
          borderWidth: options.borderWidth ?? 0,
          borderRadius: options.borderRadius ?? 5,
          hoverOffset: type === "doughnut" ? 7 : 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 750, easing: "easeOutQuart" },
        cutout: type === "doughnut" ? "67%" : undefined,
        plugins: {
          legend: {
            display: options.legend ?? type === "doughnut",
            position: "bottom",
            labels: {
              color: this.textMuted(),
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: "circle",
              padding: 18,
              font: { size: 10, family: "Inter, Segoe UI, sans-serif" }
            }
          },
          tooltip: {
            displayColors: true,
            backgroundColor: this.surface(),
            titleColor: this.text(),
            bodyColor: this.textMuted(),
            borderColor: this.border(),
            borderWidth: 1,
            padding: 11
          }
        },
        scales: type === "bar" ? {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: this.textMuted(), font: { size: 10 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: this.border() },
            border: { display: false },
            ticks: { color: this.textMuted(), precision: 0, font: { size: 10 } }
          }
        } : undefined
      }
    });
    this.instances.push(chart);
    return chart;
  }

  refreshTheme() {
    this.instances.forEach((chart) => {
      if (chart.options.plugins?.legend) chart.options.plugins.legend.labels.color = this.textMuted();
      if (chart.options.scales) {
        chart.options.scales.x.ticks.color = this.textMuted();
        chart.options.scales.y.ticks.color = this.textMuted();
        chart.options.scales.y.grid.color = this.border();
      }
      chart.update();
    });
  }

  css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  text() { return this.css("--text"); }
  textMuted() { return this.css("--text-muted"); }
  surface() { return this.css("--surface-solid"); }
  border() { return this.css("--border-strong"); }
}

window.EIOP = window.EIOP || {};
window.EIOP.charts = new EnterpriseCharts();
window.addEventListener("eiop:theme-changed", () => window.EIOP.charts.refreshTheme());

const ICONS = {
  menu: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  bell: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8"/><path d="M10 20h4"/></svg>',
  sun: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>'
};

class Application {
  constructor() {
    this.dataService = window.EIOP.dataService;
    this.loadingOverlay = document.getElementById("loadingOverlay");
    this.fileInput = document.getElementById("workbookInput");
  }

  async init() {
    this.applyStoredPreferences();
    this.bindLayout();
    this.renderCurrentDate();
    await this.loadData();
  }

  applyStoredPreferences() {
    const theme = localStorage.getItem("eiop-theme") || "dark";
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("compact-table", localStorage.getItem("eiop-compact") === "true");
    document.body.classList.toggle("sidebar-collapsed", localStorage.getItem("eiop-sidebar") === "collapsed");
    this.updateThemeButton();
  }

  bindLayout() {
    document.getElementById("sidebarCollapse")?.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
      localStorage.setItem("eiop-sidebar", document.body.classList.contains("sidebar-collapsed") ? "collapsed" : "expanded");
    });

    document.getElementById("mobileMenuButton")?.addEventListener("click", () => {
      document.body.classList.add("mobile-nav-open");
    });

    document.getElementById("sidebarBackdrop")?.addEventListener("click", () => {
      document.body.classList.remove("mobile-nav-open");
    });

    document.getElementById("themeButton")?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("eiop-theme", next);
      this.updateThemeButton();
      window.dispatchEvent(new CustomEvent("eiop:theme-changed", { detail: next }));
    });

    const globalSearch = document.getElementById("globalSearch");
    globalSearch?.addEventListener("input", (event) => {
      window.dispatchEvent(new CustomEvent("eiop:global-search", { detail: event.target.value }));
    });
    globalSearch?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && document.body.dataset.page !== "servers") {
        sessionStorage.setItem("eiop-search", event.target.value);
        window.location.href = "servers.html";
      }
    });

    this.fileInput?.addEventListener("change", async (event) => {
      const [file] = event.target.files;
      if (!file) return;
      this.setLoadingMessage("Reading selected workbook…");
      try {
        const records = await this.dataService.loadFile(file);
        this.dataReady(records);
      } catch (error) {
        this.showLoadError(error);
      }
    });
  }

  updateThemeButton() {
    const button = document.getElementById("themeButton");
    if (!button) return;
    const isDark = document.documentElement.dataset.theme === "dark";
    button.innerHTML = isDark ? ICONS.sun : ICONS.moon;
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }

  renderCurrentDate() {
    const dateElement = document.getElementById("currentDate");
    if (!dateElement) return;
    dateElement.textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date());
  }

  async loadData() {
    try {
      const records = await this.dataService.load();
      this.dataReady(records);
    } catch (error) {
      if (window.location.protocol === "file:") {
        this.setLoadingMessage("Your browser protects local files. Select data/servers.xlsx to continue.", true);
      } else {
        this.showLoadError(error);
      }
    }
  }

  dataReady(records) {
    this.loadingOverlay?.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("eiop:data-ready", { detail: records }));
  }

  setLoadingMessage(message, showPicker = false) {
    const text = document.getElementById("loadingMessage");
    const picker = document.getElementById("fileFallback");
    const ring = this.loadingOverlay?.querySelector(".loader-ring");
    if (text) text.textContent = message;
    if (picker) picker.hidden = !showPicker;
    if (ring) ring.style.display = showPicker ? "none" : "";
  }

  showLoadError(error) {
    console.error(error);
    this.setLoadingMessage("Unable to load data/servers.xlsx. Confirm the workbook exists and refresh.", true);
  }
}

window.EIOP = window.EIOP || {};
window.EIOP.app = new Application();
document.addEventListener("DOMContentLoaded", () => window.EIOP.app.init());

window.EIOP.showToast = (title, message) => {
  const region = document.getElementById("toastRegion");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  region.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
};

window.EIOP.slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

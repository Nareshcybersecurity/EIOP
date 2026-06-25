const SERVER_COLUMNS = [
  ["hostname", "Hostname"], ["ipAddress", "IP Address"], ["environment", "Environment"],
  ["status", "Status"], ["operatingSystem", "Operating System"], ["application", "Application"],
  ["ownerTeam", "Owner Team"], ["location", "Location"], ["businessUnit", "Business Unit"],
  ["criticality", "Criticality"], ["patchStatus", "Patch Status"], ["maintenanceWindow", "Maintenance Window"],
  ["hosting", "Cloud / On-Prem"], ["lastUpdated", "Last Updated"], ["remarks", "Remarks"]
];

class ServerTable {
  constructor() {
    this.records = [];
    this.filtered = [];
    this.page = 1;
    this.pageSize = 10;
    this.sortField = "hostname";
    this.sortDirection = "asc";
    this.filters = new window.EIOP.ServerFilters(() => this.applyFilters());
  }

  init(records) {
    this.records = records;
    this.renderHeader();
    this.filters.initialize(records);
    this.bindPagination();
    const pendingSearch = sessionStorage.getItem("eiop-search");
    if (pendingSearch) {
      const input = document.getElementById("serverSearch");
      if (input) input.value = pendingSearch;
      sessionStorage.removeItem("eiop-search");
    }
    window.addEventListener("eiop:global-search", ({ detail }) => {
      const input = document.getElementById("serverSearch");
      if (input) input.value = detail;
      this.applyFilters();
    });
    this.applyFilters();
  }

  renderHeader() {
    const header = document.getElementById("serverTableHeader");
    if (!header) return;
    header.innerHTML = SERVER_COLUMNS.map(([field, label]) => `
      <th scope="col">
        <button class="sort-button" data-sort="${field}">
          ${label}<span class="sort-icon">↕</span>
        </button>
      </th>
    `).join("");
    header.querySelectorAll("[data-sort]").forEach((button) => {
      button.addEventListener("click", () => this.sort(button.dataset.sort));
    });
  }

  applyFilters() {
    const values = this.filters.values();
    const searchableFields = ["hostname", "ipAddress", "application", "ownerTeam"];
    this.filtered = this.records.filter((record) => {
      const matchesSearch = !values.search || searchableFields.some((field) => record[field].toLowerCase().includes(values.search));
      return matchesSearch
        && (!values.environment || record.environment === values.environment)
        && (!values.status || record.status === values.status)
        && (!values.operatingSystem || record.operatingSystem === values.operatingSystem)
        && (!values.ownerTeam || record.ownerTeam === values.ownerTeam)
        && (!values.businessUnit || record.businessUnit === values.businessUnit);
    });
    this.page = 1;
    this.render();
  }

  sort(field) {
    this.sortDirection = this.sortField === field && this.sortDirection === "asc" ? "desc" : "asc";
    this.sortField = field;
    this.render();
  }

  sortedRecords() {
    return [...this.filtered].sort((a, b) => {
      const first = a[this.sortField] || "";
      const second = b[this.sortField] || "";
      return first.localeCompare(second, undefined, { numeric: true }) * (this.sortDirection === "asc" ? 1 : -1);
    });
  }

  render() {
    const sorted = this.sortedRecords();
    const start = (this.page - 1) * this.pageSize;
    const pageRecords = sorted.slice(start, start + this.pageSize);
    const body = document.getElementById("serverTableBody");
    if (!body) return;

    body.innerHTML = pageRecords.length ? pageRecords.map((record) => `
      <tr>
        <td title="${record.hostname}">${record.hostname}</td>
        <td>${record.ipAddress}</td>
        <td><span class="badge badge-${window.EIOP.slugify(record.environment)}">${record.environment}</span></td>
        <td><span class="badge badge-${window.EIOP.slugify(record.status)}">${record.status}</span></td>
        <td>${record.operatingSystem}</td>
        <td title="${record.application}">${record.application}</td>
        <td>${record.ownerTeam}</td>
        <td>${record.location}</td>
        <td>${record.businessUnit}</td>
        <td><span class="criticality criticality-${record.criticality.toLowerCase()}">${record.criticality}</span></td>
        <td><span class="badge badge-${window.EIOP.slugify(record.patchStatus)}">${record.patchStatus}</span></td>
        <td>${record.maintenanceWindow}</td>
        <td>${record.hosting}</td>
        <td>${record.lastUpdated}</td>
        <td title="${record.remarks}">${record.remarks}</td>
      </tr>
    `).join("") : '<tr><td colspan="15"><div class="empty-state">No servers match the selected filters.</div></td></tr>';

    this.updateSortIndicators();
    this.renderPagination(sorted.length);
  }

  updateSortIndicators() {
    document.querySelectorAll(".sort-button").forEach((button) => {
      const active = button.dataset.sort === this.sortField;
      button.classList.toggle("active", active);
      button.querySelector(".sort-icon").textContent = active ? (this.sortDirection === "asc" ? "↑" : "↓") : "↕";
    });
  }

  bindPagination() {
    document.getElementById("previousPage")?.addEventListener("click", () => {
      if (this.page > 1) {
        this.page -= 1;
        this.render();
      }
    });
    document.getElementById("nextPage")?.addEventListener("click", () => {
      const pages = Math.ceil(this.filtered.length / this.pageSize);
      if (this.page < pages) {
        this.page += 1;
        this.render();
      }
    });
    document.getElementById("pageSize")?.addEventListener("change", (event) => {
      this.pageSize = Number(event.target.value);
      this.page = 1;
      this.render();
    });
  }

  renderPagination(total) {
    const pages = Math.max(1, Math.ceil(total / this.pageSize));
    this.page = Math.min(this.page, pages);
    const start = total ? (this.page - 1) * this.pageSize + 1 : 0;
    const end = Math.min(this.page * this.pageSize, total);
    document.getElementById("recordCount").textContent = `${total} server${total === 1 ? "" : "s"}`;
    document.getElementById("paginationInfo").textContent = `Showing ${start}–${end} of ${total}`;
    document.getElementById("previousPage").disabled = this.page === 1;
    document.getElementById("nextPage").disabled = this.page === pages;
    document.getElementById("currentPage").textContent = this.page;
    document.getElementById("totalPages").textContent = pages;
  }
}

window.addEventListener("eiop:data-ready", ({ detail }) => new ServerTable().init(detail));

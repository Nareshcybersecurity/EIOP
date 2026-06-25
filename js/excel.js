const HEADER_MAP = {
  "Hostname": "hostname",
  "IP Address": "ipAddress",
  "Environment": "environment",
  "Status": "status",
  "Operating System": "operatingSystem",
  "Application": "application",
  "Owner Team": "ownerTeam",
  "Location": "location",
  "Business Unit": "businessUnit",
  "Criticality": "criticality",
  "Patch Status": "patchStatus",
  "Maintenance Window": "maintenanceWindow",
  "Cloud / On-Prem": "hosting",
  "Last Updated": "lastUpdated",
  "Remarks": "remarks"
};

class ExcelDataService {
  constructor() {
    this.records = [];
    this.source = "data/servers.xlsx";
  }

  async load() {
    if (typeof XLSX === "undefined") {
      throw new Error("SheetJS could not be loaded.");
    }

    const response = await fetch(this.source, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Workbook request failed (${response.status}).`);
    }
    return this.parse(await response.arrayBuffer());
  }

  async loadFile(file) {
    return this.parse(await file.arrayBuffer());
  }

  parse(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(firstSheet, { defval: "", raw: false });
    this.records = rawRows
      .map((row) => this.normalizeRow(row))
      .filter((row) => row.hostname);
    return this.records;
  }

  normalizeRow(row) {
    const normalized = {};
    Object.entries(HEADER_MAP).forEach(([source, target]) => {
      normalized[target] = String(row[source] ?? "").trim();
    });
    normalized.lastUpdated = this.normalizeDate(normalized.lastUpdated);
    return normalized;
  }

  normalizeDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }
    return value;
  }

  count(field, value) {
    return this.records.filter((record) => record[field] === value).length;
  }

  distribution(field, labels) {
    return labels.map((label) => this.count(field, label));
  }
}

window.EIOP = window.EIOP || {};
window.EIOP.dataService = new ExcelDataService();

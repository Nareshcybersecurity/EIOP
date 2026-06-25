class ServerFilters {
  constructor(onChange) {
    this.onChange = onChange;
    this.fields = ["environment", "status", "operatingSystem", "ownerTeam", "businessUnit"];
  }

  initialize(records) {
    this.populate("operatingSystem", [...new Set(records.map((record) => record.operatingSystem))].sort());
    this.populate("ownerTeam", [...new Set(records.map((record) => record.ownerTeam))].sort());
    this.populate("businessUnit", [...new Set(records.map((record) => record.businessUnit))].sort());

    document.getElementById("serverSearch")?.addEventListener("input", this.onChange);
    this.fields.forEach((field) => document.getElementById(`${field}Filter`)?.addEventListener("change", this.onChange));
    document.getElementById("clearFilters")?.addEventListener("click", () => this.clear());
  }

  populate(field, values) {
    const select = document.getElementById(`${field}Filter`);
    if (!select) return;
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  values() {
    return {
      search: document.getElementById("serverSearch")?.value.trim().toLowerCase() || "",
      ...Object.fromEntries(this.fields.map((field) => [field, document.getElementById(`${field}Filter`)?.value || ""]))
    };
  }

  clear() {
    const search = document.getElementById("serverSearch");
    if (search) search.value = "";
    this.fields.forEach((field) => {
      const select = document.getElementById(`${field}Filter`);
      if (select) select.value = "";
    });
    this.onChange();
  }
}

window.EIOP = window.EIOP || {};
window.EIOP.ServerFilters = ServerFilters;

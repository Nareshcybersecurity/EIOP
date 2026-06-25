document.addEventListener("DOMContentLoaded", () => {
  const darkTheme = document.getElementById("darkThemeSetting");
  const compactTable = document.getElementById("compactTableSetting");

  if (darkTheme) darkTheme.checked = document.documentElement.dataset.theme === "dark";
  if (compactTable) compactTable.checked = localStorage.getItem("eiop-compact") === "true";

  darkTheme?.addEventListener("change", (event) => {
    const theme = event.target.checked ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("eiop-theme", theme);
    window.EIOP.app.updateThemeButton();
    window.EIOP.showToast("Theme updated", `${event.target.checked ? "Dark" : "Light"} theme is now active.`);
  });

  compactTable?.addEventListener("change", (event) => {
    document.body.classList.toggle("compact-table", event.target.checked);
    localStorage.setItem("eiop-compact", String(event.target.checked));
    window.EIOP.showToast("Table density updated", event.target.checked ? "Compact rows enabled." : "Comfortable rows enabled.");
  });

  document.getElementById("resetDashboard")?.addEventListener("click", () => {
    ["eiop-theme", "eiop-compact", "eiop-sidebar"].forEach((key) => localStorage.removeItem(key));
    document.documentElement.dataset.theme = "dark";
    document.body.classList.remove("compact-table", "sidebar-collapsed");
    if (darkTheme) darkTheme.checked = true;
    if (compactTable) compactTable.checked = false;
    window.EIOP.app.updateThemeButton();
    window.EIOP.showToast("Preferences reset", "Dashboard settings were restored to defaults.");
  });
});

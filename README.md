# Enterprise Infrastructure Operations Portal (EIOP)

A modern, enterprise-inspired infrastructure operations dashboard built using **HTML, CSS, and JavaScript**.

The project provides a centralized interface for viewing and managing server inventory from an Excel-based data source. It is designed to simulate how enterprise infrastructure teams manage servers across multiple environments before integrating with automation and monitoring platforms.

---

## Features

* Enterprise-style dashboard
* Server inventory management
* Excel (.xlsx) as the primary data source
* Dashboard statistics
* Search and filtering
* Responsive design
* Professional dark theme
* Reports and analytics
* Modular project structure
* Ready for future backend integration

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript (ES6)

### Libraries

* SheetJS (XLSX) - Read Excel files
* Chart.js - Dashboard charts

### Data Source

* Microsoft Excel (.xlsx)

---

## Project Structure

```text
EIOP/
│
├── index.html
├── servers.html
├── reports.html
├── settings.html
│
├── css/
│   ├── variables.css
│   ├── layout.css
│   ├── sidebar.css
│   ├── dashboard.css
│   ├── table.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── dashboard.js
│   ├── excel.js
│   ├── servers.js
│   ├── charts.js
│   └── settings.js
│
├── data/
│   └── servers.xlsx
│
├── assets/
│   ├── icons/
│   └── images/
│
└── README.md
```

---

## Dashboard

The dashboard provides a quick overview of the infrastructure.

### KPI Cards

* Total Servers
* Running
* Maintenance
* Patching
* Powered Off
* Cloud
* Decommissioned

### Charts

* Server Status Distribution
* Environment Distribution
* Operating System Distribution

---

## Server Inventory

Each server record contains:

* Hostname
* IP Address
* Environment
* Operating System
* Application
* Owner Team
* Business Unit
* Status
* Patch Status
* Maintenance Window
* Cloud / On-Prem
* Last Updated
* Remarks

---

## Environments

* DEV
* TEST
* UAT
* PROD

---

## Supported Server Status

* 🟢 Running
* 🟡 Maintenance
* 🟠 Patching
* 🔴 Powered Off
* ☁️ Cloud
* ⚫ Decommissioned

---

## Current Version

### Version 1

* Manual infrastructure inventory
* Excel-based data source
* Dashboard
* Reports
* Search
* Filters

---

## Planned Roadmap

### Version 2

* PostgreSQL integration
* REST API
* Authentication
* Role-Based Access Control (RBAC)

### Version 3

* Ansible integration
* Automatic inventory updates
* SSH health checks
* Service status collection

### Version 4

* Prometheus integration
* Grafana integration
* Monitoring dashboard
* Alert management

### Version 5

* ServiceNow integration
* BMC Helix integration
* Microsoft Graph API
* SharePoint Excel synchronization

---

## Future Enterprise Features

* CMDB support
* Patch management
* Maintenance scheduling
* Asset lifecycle management
* Audit logs
* Server relationships
* Cloud inventory
* Notification system
* Role-based permissions

---

## Deployment

The application can be hosted as a static website using platforms such as:

* Vercel
* GitHub Pages
* Netlify

No backend server is required for Version 1.

---

## Project Goal

This project aims to demonstrate enterprise infrastructure management concepts using modern web technologies while keeping the initial implementation simple and easy to deploy.

Although Version 1 uses an Excel workbook as the data source, the architecture is designed to evolve toward a production-ready solution with databases, automation, monitoring, and enterprise integrations.

---

## Disclaimer

This project uses sample infrastructure data for demonstration purposes only. It does not contain or expose any confidential, proprietary, or production information.

---

## Author

**Naresh Ramalingam**

GitHub: https://github.com/Nareshcybersecurity

---

## License

This project is released under the MIT License.
